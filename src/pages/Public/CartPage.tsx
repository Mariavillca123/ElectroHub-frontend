import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../../utils/axios"
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
    } catch (error) {
      console.error("Error al procesar compra:", error)
      alert("Error al procesar la compra. Intenta de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mi Carrito</h1>
          <p className="mt-2 text-gray-600">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg flex items-start gap-4">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-green-900 font-semibold">¡Compra realizada exitosamente!</p>
              <p className="text-green-800 text-sm mt-1">Tu pedido ha sido registrado. Serás redirigido a tu panel en unos momentos...</p>
            </div>
          </div>
        )}

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
            <p className="text-gray-500 mt-2">Agrega productos para continuar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Products List */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Cantidad: {item.quantity || 1}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price.toFixed(2)} c/u
                        </p>
                      </div>
                      <div className="text-right mr-6">
                        <p className="text-lg font-semibold text-gray-900">
                          ${(item.price * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mr-4">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                          aria-label="Disminuir"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-md sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>

                {/* Coupon */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex items-center gap-2 flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2.5">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Código de cupón"
                      className="flex-1 outline-none text-sm min-w-0"
                    />
                  </div>
                  <Button variant="outline" className="shrink-0" onClick={applyCoupon}>Aplicar</Button>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountPct > 0 && (
                    <>
                      <div className="flex justify-between text-sm text-green-700">
                        <span>Descuento ({discountPct}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-green-700">Se aplicó cupón correctamente.</p>
                    </>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Envío</span>
                    <span className="text-gray-900 font-medium">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full gap-2 h-11"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Completar Compra"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
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
