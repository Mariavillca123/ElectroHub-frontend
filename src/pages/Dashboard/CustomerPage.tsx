'use client'

import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { useAuth } from "../../contexts/AuthContext"
import { ShoppingBag, Clock, Tag, DollarSign, Package, ArrowRight, Zap, Mail, User } from "lucide-react"
import CustomerOrders from "../../components/dashboard/CustomerOrders"
import axios from "../../utils/axios"

interface Order {
  id: number
  total: number
  status: string
  date: string
  products?: Array<{ name: string; quantity: number }>
}

interface Product {
  id: number
  name: string
  price: number
  image?: string
}

export default function CustomerPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading } = useAuth()
  const [pageLoading, setPageLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const memberSince = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    activeCoupons: 3,
    totalSpent: 0
  })

  // Detectar modo de vista
  const showSettings = location.pathname.endsWith('/configuracion')
  const showFullOrders = location.pathname.endsWith('/pedidos')

  useEffect(() => {
    // Esperar a que AuthContext cargue
    if (loading) return
    
    // Si no hay usuario después de que loading termina, redirigir
    if (!user || user.role !== 'client') {
      navigate('/login', { replace: true })
      return
    }
    
    // Usuario validado, cargar datos
    fetchData()
    setPageLoading(false)
  }, [user, loading, navigate, location.pathname])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      // Fetch orders
      const ordersRes = await axios.get("/api/sales", { headers })
      const ordersList = ordersRes.data || []
      setOrders(ordersList)
      
      // Calculate stats
      const totalOrders = ordersList.length
      const pendingOrders = ordersList.filter((o: Order) => o.status === 'pendiente').length
      const totalSpent = ordersList.reduce((sum: number, o: Order) => sum + (o.total || 0), 0)
      
      setStats({
        totalOrders,
        pendingOrders,
        activeCoupons: 3,
        totalSpent
      })
      
      // Fetch products
      const productsRes = await axios.get("/api/products", { headers })
      const productsData = productsRes.data || []
      console.log("Productos cargados:", productsData)
      setProducts(productsData.slice(0, 4))
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar role="customer" />
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="flex-1 overflow-auto pt-16 lg:pt-0 px-6 py-6 lg:px-8">
          {showSettings ? (
            // Vista de Configuración
            <>
              <div className="space-y-2 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Configuracion</h1>
                <p className="text-gray-600">Informacion de tu cuenta</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Perfil</h2>
                  <p className="text-sm text-gray-500">Tu informacion personal</p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                      {user.name?.charAt(0).toUpperCase() || "C"}
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{user.role === "client" ? "Cliente" : user.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
                        <User className="h-4 w-4" />
                        <span>Nombre</span>
                      </div>
                      <p className="text-base font-semibold text-gray-900">{user.name}</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
                        <Mail className="h-4 w-4" />
                        <span>Email</span>
                      </div>
                      <p className="text-base font-semibold text-gray-900">{user.email}</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 md:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-2">
                        <Clock className="h-4 w-4" />
                        <span>Miembro desde</span>
                      </div>
                      <p className="text-base font-semibold text-gray-900">{memberSince}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : showFullOrders ? (
            // Vista completa de Mis Pedidos
            <CustomerOrders isFullPage={true} />
          ) : (
            // Vista de Dashboard
            <>
              {/* Saludo */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Hola, <span className="text-blue-600">{user?.name}</span>
                </h1>
                <p className="text-sm text-gray-600 mt-1">Bienvenido a tu panel de cliente.</p>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Pedidos */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Pedidos</h3>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Pedidos Pendientes */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pedidos Pendientes</h3>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                    </div>
                    <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </div>

                {/* Cupones Activos */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Cupones Activos</h3>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeCoupons}</p>
                    </div>
                    <div className="bg-pink-100 p-2 rounded-lg flex-shrink-0">
                      <Tag className="h-5 w-5 text-pink-600" />
                    </div>
                  </div>
                </div>

                {/* Total Gastado */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Total Gastado</h3>
                      <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pedidos Recientes y Productos Destacados */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pedidos Recientes */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Pedidos Recientes</h2>
                    <button 
                      onClick={() => navigate('/cliente/pedidos')}
                      className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1"
                    >
                      Ver todos <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-6">
                      <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No hay pedidos aún</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                          <div>
                            <p className="font-semibold text-gray-900">#{order.id}</p>
                            <p className="text-xs text-gray-500">{orders.length} producto{orders.length !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">${order.total.toFixed(2)}</p>
                            <span className="inline-block text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 mt-1">
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Productos Destacados */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-gray-900">Productos Destacados</h2>
                    <Link to="/productos" className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1">
                      Ver catálogo <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  
                  {products.length === 0 ? (
                    <div className="text-center py-6">
                      <Package className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No hay productos disponibles</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {products.map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                          <div className="bg-gray-100 rounded-lg p-2 mb-2 flex items-center justify-center h-16">
                            <Zap className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-xs font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-blue-600 font-semibold text-xs mt-1">${product.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
