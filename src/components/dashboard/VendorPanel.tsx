import { useEffect, useState } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, ShoppingCart, Package } from 'lucide-react'
import { useAuth } from "../../contexts/AuthContext"

interface SalesData {
  id: number
  client: string
  product: string
  quantity: number
  total: number
  date: string
  created_at: string
}

export default function VendorPanel() {
  const { user } = useAuth()
  const [sales, setSales] = useState<SalesData[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        
        const response = await axios.get("/api/sales", { headers })
        const salesData = response.data || []
        setSales(salesData)
        const sum = salesData.reduce((acc: number, s: any) => acc + (s.total || 0), 0)
        setTotal(sum)
      } catch (error) {
        console.error("Error fetching sales:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSales()
  }, [])

  const downloadPDF = () => {
    const token = localStorage.getItem("token")
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    window.open("/api/reports/sales", "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando datos de ventas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Bienvenido al panel de vendedor, <span className="font-semibold text-gray-900">{user?.name || 'Vendedor'}</span></p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendido</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">${total.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Ventas</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{sales.length}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Promedio por Venta</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${sales.length > 0 ? (total / sales.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {sales.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gráfico de Ventas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales}>
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
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Sales Section */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Ventas Recientes</h2>
        </div>
        
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-gray-600">No tienes ventas aún</p>
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
                {sales.slice(0, 10).map((sale) => (
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
  )
}
