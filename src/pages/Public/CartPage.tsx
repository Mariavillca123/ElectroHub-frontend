import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../utils/axios"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { Trash2, ShoppingCart, Loader, Tag, Plus, Minus, CheckCircle } from "lucide-react"
import { Button } from "../../components/ui/Button"

export default function CartPage() {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [coupon, setCoupon] = useState("")
  const [discountPct, setDiscountPct] = useState(0)

  // Calcular total
  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const discountAmount = subtotal * (discountPct / 100)
  const total = Math.max(0, subtotal - discountAmount)

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (!code) {
      setDiscountPct(0)
      return
    }
    // Cupones de ejemplo: DESC10 (10%), DESC20 (20%)
    if (code === "DESC10") {
      setDiscountPct(10)
    } else if (code === "DESC20") {
      setDiscountPct(20)
    } else {
      alert("Cupón no válido")
      setDiscountPct(0)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      alert("Debes estar autenticado para comprar")
      return
    }

    if (items.length === 0) {
      alert("El carrito está vacío")
      return
    }

    setIsProcessing(true)
    const token = localStorage.getItem("token")

    try {
      // Registrar cada producto como una venta
      const promises = items.map(item =>
        axios.post("/api/sales", {
          user_id: user.id,
          product_id: item.id,
          quantity: item.quantity || 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      )

      await Promise.all(promises)

      // Limpiar carrito y mostrar mensaje de éxito
      clearCart()
      setSuccess(true)
      
      // Redirigir al dashboard del cliente después de 3 segundos
      setTimeout(() => {
        navigate('/cliente', { replace: true })
      }, 3000)
    } catch (error: any) {
      console.error("Error al procesar compra:", error)
      const errorMsg = error.response?.data?.message || "Error al procesar la compra. Intenta de nuevo."
      alert(errorMsg)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">Mi Carrito</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 sm:p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-900 dark:text-green-300 font-semibold text-sm sm:text-base">¡Compra realizada exitosamente!</p>
              <p className="text-green-800 dark:text-green-400 text-xs sm:text-sm mt-1">Tu pedido ha sido registrado. Serás redirigido a tu panel en unos momentos...</p>
            </div>
          </div>
        )}

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 sm:p-12 text-center">
            <ShoppingCart className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">Tu carrito está vacío</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">Agrega productos para continuar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Products List */}
            <div className="lg:col-span-7">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {items.map(item => (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Cantidad: {item.quantity || 1}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-1">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:gap-6">
                        <div className="text-right">
                          <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            className="p-1.5 sm:p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            aria-label="Disminuir"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center text-sm text-gray-900 dark:text-white">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="p-1.5 sm:p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                            aria-label="Aumentar"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-md lg:sticky lg:top-8">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen del Pedido</h2>

                {/* Coupon */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-5">
                  <div className="w-full sm:flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-800">
                    <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Código de cupón"
                      className="flex-1 outline-none text-xs sm:text-sm min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <Button variant="outline" className="shrink-0 w-full sm:w-auto" onClick={applyCoupon}>Aplicar</Button>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPct > 0 && (
                    <>
                      <div className="flex justify-between text-xs sm:text-sm text-green-700 dark:text-green-400">
                        <span>Descuento ({discountPct}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-green-700 dark:text-green-400">Se aplicó cupón correctamente.</p>
                    </>
                  )}
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                    <span className="text-gray-900 dark:text-white font-medium">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full gap-2 h-10 sm:h-11 text-sm sm:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Completar Compra"
                  )}
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                  Al comprar aceptas nuestros términos y condiciones
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
