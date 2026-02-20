import { useEffect, useState } from "react"
import axios from "../../utils/axios"
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

  const downloadPDF = async () => {
    try {
      const res = await axios.get("/api/reports/sales-pdf", { responseType: "blob" })
      const blob = new Blob([res.data], { type: "application/pdf" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `reporte-ventas-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading report:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Cargando datos de ventas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Bienvenido al panel de vendedor, <span className="font-semibold text-gray-900 dark:text-white">{user?.name || 'Vendedor'}</span></p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vendido</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</p>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Ventas</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{sales.length}</p>
            </div>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio por Venta</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                ${sales.length > 0 ? (total / sales.length).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 p-3">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {sales.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Gráfico de Ventas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                stroke="#E5E7EB"
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                stroke="#E5E7EB"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
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
      <div className="mt-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ventas Recientes</h2>
        </div>
        
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No tienes ventas aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {sales.slice(0, 10).map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 dark:bg-blue-900/30">
                          <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{sale.product}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{sale.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{sale.quantity}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                      ${Number(sale.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
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
