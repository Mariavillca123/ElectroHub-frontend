import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../../utils/axios"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { Trash2, ShoppingCart, Loader, Tag, Plus, Minus, CheckCircle, Truck, Shield, AlertCircle, ArrowRight } from "lucide-react"
import { Button } from "../../components/ui/Button"

export default function CartPage() {
  const { items, removeFromCart, clearCart, updateQuantity } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  const [coupon, setCoupon] = useState("")
  const [discountPct, setDiscountPct] = useState(0)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())

  // Calcular total
  const subtotal = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const discountAmount = subtotal * (discountPct / 100)
  const total = Math.max(0, subtotal - discountAmount)
  const savings = discountAmount

  // Cupones sugeridos
  const suggestedCoupons = [
    { code: 'DESC10', discount: 10, description: '10% off' },
    { code: 'DESC20', discount: 20, description: '20% off' }
  ]

  const applyCoupon = (code?: string) => {
    const couponCode = (code || coupon).trim().toUpperCase()
    if (!couponCode) {
      setDiscountPct(0)
      return
    }
    const suggested = suggestedCoupons.find(c => c.code === couponCode)
    if (suggested) {
      setDiscountPct(suggested.discount)
      setCoupon(couponCode)
    } else {
      alert("Cupón no válido")
      setDiscountPct(0)
    }
  }

  const handleDeleteClick = (itemId: number) => {
    setItemToDelete(itemId)
  }

  const confirmDelete = (itemId: number) => {
    setRemovingItems(prev => new Set([...prev, itemId]))
    setTimeout(() => {
      removeFromCart(itemId)
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
      setItemToDelete(null)
    }, 300)
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
      // Generar número de orden
      const orderNum = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
      setOrderNumber(orderNum)

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
      
      // Redirigir al dashboard del cliente después de 5 segundos
      setTimeout(() => {
        navigate('/cliente', { replace: true })
      }, 5000)
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">Mi Carrito</h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600 dark:text-gray-400">
            {items.length} {items.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {/* Success Message - Enhanced */}
        {success && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-300 dark:border-green-700 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-800">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-200">¡Compra realizada exitosamente! 🎉</h3>
                  <p className="text-green-800 dark:text-green-300 text-sm sm:text-base mt-1">
                    Tu número de orden es: <span className="font-mono font-bold">{orderNumber}</span>
                  </p>
                  <p className="text-green-700 dark:text-green-400 text-xs sm:text-sm mt-2">
                    Te enviaremos un correo de confirmación. Serás redirigido a tu panel en unos momentos...
                  </p>
                  <Link to="/cliente" className="inline-block mt-4">
                    <Button variant="primary" className="gap-2 text-sm">
                      Ir a mis órdenes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty Cart - Enhanced */}
        {items.length === 0 && !success ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 sm:p-16 text-center shadow-sm">
            <div className="text-5xl sm:text-6xl mb-6 animate-bounce">🛒</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Parece que no has agregado ningún producto aún. ¡Explora nuestro catálogo!
            </p>
            <Link to="/productos">
              <Button size="lg" className="gap-2">
                Explorar productos
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : success ? null : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Products List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Items */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className={`p-5 sm:p-6 transition-all duration-300 ${
                        removingItems.has(item.id) ? 'opacity-50 translate-x-full' : 'opacity-100'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        {/* Item Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            ${item.price.toFixed(2)} por unidad
                          </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex items-center justify-between sm:flex-col sm:gap-4 gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                              aria-label="Disminuir"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                              aria-label="Aumentar"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition transform hover:scale-110"
                            aria-label="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      {/* Confirmation Modal */}
                      {itemToDelete === item.id && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-red-900 dark:text-red-300 font-medium text-sm mb-3">
                            ¿Eliminar este producto del carrito?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmDelete(item.id)}
                              className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition"
                            >
                              Sí, eliminar
                            </button>
                            <button
                              onClick={() => setItemToDelete(null)}
                              className="flex-1 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 text-sm font-medium transition"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-300 text-sm">Envío Gratis</p>
                      <p className="text-blue-700 dark:text-blue-400 text-xs">En toda tu compra</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-300 text-sm">Compra Segura</p>
                      <p className="text-green-700 dark:text-green-400 text-xs">Devolución en 30 días</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-md lg:sticky lg:top-24 space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Resumen de compra
                </h2>

                {/* Coupon Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Código de descuento
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500">
                      <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder="Ej: DESC10"
                        className="flex-1 outline-none text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="text-sm px-3 sm:px-4"
                      onClick={() => applyCoupon()}
                    >
                      Aplicar
                    </Button>
                  </div>

                  {/* Suggested Coupons */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Cupones disponibles:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {suggestedCoupons.map(sugg => (
                        <button
                          key={sugg.code}
                          onClick={() => applyCoupon(sugg.code)}
                          className={`p-2 rounded-lg border text-xs font-semibold transition ${
                            coupon === sugg.code
                              ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {sugg.code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  {savings > 0 && (
                    <div className="flex justify-between text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <span className="text-green-700 dark:text-green-400">Ahorras</span>
                      <span className="font-bold text-green-700 dark:text-green-400">-${savings.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Envío</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Gratis</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full gap-2 h-12 text-base font-semibold"
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

                  <Link to="/productos" className="block">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                    >
                      Continuar comprando
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {/* Fine Print */}
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Al comprar aceptas nuestros <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">términos y condiciones</a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
