import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { Package } from "lucide-react"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  discount?: number
  status?: string
  is_active?: boolean
  active?: boolean
  image?: string
}

export default function AdminProductsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true })
      return
    }
    fetchProducts()
  }, [user, navigate])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const res = await axios.get("/api/products", { headers })
      setProducts(Array.isArray(res.data) ? res.data : [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Cargando productos...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <DashboardSidebar role="admin" />
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="flex-1 overflow-auto pt-16 lg:pt-0 px-4 py-8 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Productos</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Administra el catálogo de ElectroHub</p>
            </div>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lista de Productos ({products.length})</h3>
              </div>

              {products.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay productos disponibles</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-3 grid grid-cols-12 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-gray-800/50">
                    <div className="col-span-4">Nombre</div>
                    <div className="col-span-2">Categoría</div>
                    <div className="col-span-1">Precio</div>
                    <div className="col-span-1">Stock</div>
                    <div className="col-span-1">Descuento</div>
                    <div className="col-span-3">Estado</div>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {products.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 items-center gap-4 py-3 px-6 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="col-span-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30">
                                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                            <span className="font-medium text-gray-900 dark:text-white truncate">{product.name}</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-gray-600 dark:text-gray-400 text-xs">{product.category}</div>
                        <div className="col-span-1 font-semibold text-gray-900 dark:text-white">${product.price.toFixed(2)}</div>
                        <div className="col-span-1">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                            product.stock > 10 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 
                            product.stock > 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : 
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                        <div className="col-span-1 text-gray-600 dark:text-gray-400 text-xs">{product.discount || 0}%</div>
                        <div className="col-span-3">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            (product.is_active !== false && product.active !== false && product.status !== 'inactive') 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          }`}>
                            {(product.is_active !== false && product.active !== false && product.status !== 'inactive') ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
