import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../utils/axios"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { useAuth } from "../../contexts/AuthContext"
import { Package, TrendingUp, ShoppingCart, DollarSign } from "lucide-react"
import { Button } from "../../components/ui/Button"

interface Sale {
  id: number
  client: string
  product: string
  quantity: number
  total: number
  date: string
  created_at: string
}

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface ChartData {
  date: string
  ingresos: number
}

export default function VendorSalesPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [sales, setSales] = useState<Sale[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSales, setTotalSales] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [averageSale, setAverageSale] = useState(0)

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login')
      return
    }
    fetchData()
    // Auto-refresh cada 5 segundos
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const [salesRes, productsRes] = await Promise.all([
        axios.get("/api/sales", { headers }),
        axios.get("/api/products", { headers })
      ])

      const salesData = salesRes.data || []
      setSales(salesData)
      setProducts(productsRes.data || [])

      // Calcular métricas
      const revenue = salesData.reduce((acc: number, s: any) => acc + (s.total || 0), 0)
      setTotalRevenue(revenue)
      setTotalSales(salesData.length)
      setAverageSale(salesData.length > 0 ? revenue / salesData.length : 0)

      // Procesar datos para el gráfico (agrupar por fecha)
      const dataPorFecha: { [key: string]: number } = {}
      salesData.forEach((sale: any) => {
        const fecha = new Date(sale.created_at).toLocaleDateString('es-ES')
        dataPorFecha[fecha] = (dataPorFecha[fecha] || 0) + (sale.total || 0)
      })

      const chartDataArray = Object.entries(dataPorFecha)
        .map(([date, ingresos]) => ({ date, ingresos: Number(ingresos) }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      setChartData(chartDataArray)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar role="vendor" />
        <main className="flex-1 flex items-center justify-center lg:ml-64">
          <div className="text-gray-500">Cargando ventas...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar role="vendor" />
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="flex-1 overflow-auto px-4 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Ventas</h1>
            <p className="mt-2 text-gray-600">Ventas en tiempo real de tus productos</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Ventas</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{totalSales}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">${averageSale.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos vs Tiempo</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#9CA3AF"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0.00'}
                  />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                <p>Sin datos para mostrar</p>
              </div>
            )}
          </div>

          {/* Sales Table */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Historial de Ventas</h2>
            </div>

            {sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingCart className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600">No tienes ventas registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                              <Package className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{sale.product}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{sale.client}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sale.quantity}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ${Number(sale.total).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(sale.created_at).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
    </div>
  )
}
