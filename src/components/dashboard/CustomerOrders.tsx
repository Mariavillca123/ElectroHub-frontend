import { useEffect, useState } from "react"
import axios from "axios"
import { ShoppingBag, Calendar, DollarSign, Package } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

interface OrderProduct {
  id: number
  name: string
  quantity: number
  price: number
}

interface Order {
  id: number
  product: string
  quantity: number
  total: number
  date: string
  status?: string
  products?: OrderProduct[]
}

const statusColors = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  enviado: 'bg-blue-100 text-blue-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700'
}

const statusLabels = {
  pendiente: 'Pendiente',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado'
}

interface CustomerOrdersProps {
  isFullPage?: boolean
}

export default function CustomerOrders({ isFullPage = false }: CustomerOrdersProps) {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // Si es página completa, validar autenticación
    if (isFullPage) {
      if (loading) return
      
      if (!user || user.role !== 'client') {
        navigate('/login', { replace: true })
        return
      }
    }
    
    fetchOrders()
    setPageLoading(false)
  }, [user, loading, navigate, isFullPage])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const response = await axios.get("/api/sales", { headers })
      setOrders(response.data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  if (isFullPage && (loading || pageLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    )
  }

  if (isFullPage && !user) {
    return null
  }

  return (
    <div>
      {isFullPage && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600 mt-2">Historial completo de tus compras</p>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">No hay pedidos aún</p>
          <p className="mt-1 text-gray-600">Cuando hagas una compra, aparecerá aquí</p>
        </div>
      ) : (
        <div className={isFullPage ? "space-y-6" : "space-y-4"}>
          {orders.map((order) => {
            const orderDate = new Date(order.date)
            const formattedDate = orderDate.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
            const formattedTime = orderDate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })

            return (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow"
              >
                {isFullPage ? (
                  <>
                    {/* Full Page Layout */}
                    <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Pedido #{order.id}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formattedDate}, {formattedTime}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                      </span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Productos
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.product}</p>
                            <p className="text-xs text-gray-600 mt-1">Cantidad: {order.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Compact Layout for Dashboard */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Package className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-semibold text-gray-900">{order.product}</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Cantidad</p>
                            <p className="font-semibold text-gray-900">{order.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total</p>
                            <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                          </div>
                          <div className="col-span-2 md:col-span-2">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <p>{new Date(order.date).toLocaleDateString('es-ES')}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.status && (
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}>
                            {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
