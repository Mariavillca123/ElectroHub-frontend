import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Download, DollarSign, TrendingUp, Package, Calendar } from "lucide-react"
import { Button } from "../../components/ui/Button"

interface ReportSummary {
  totalRevenue: number
  totalSales: number
  totalProducts: number
  currentDate: string
}

export default function VendorReportsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login')
      return
    }
    fetchReportsSummary()
  }, [user, navigate])

  const fetchReportsSummary = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/reports/summary', { headers })
      setSummary(res.data)
    } catch (e) {
      console.error('Error fetching reports summary', e)
    } finally {
      setLoading(false)
    }
  }

  const downloadReport = async () => {
    setDownloading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      const res = await axios.get('/api/reports/sales-pdf', {
        headers,
        responseType: 'blob'
      })

      // Crear blob y descargar
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reporte-ventas-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Error downloading report', e)
      alert('No se pudo descargar el reporte')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DashboardSidebar role="vendor" />
        <main className="flex-1 flex items-center justify-center lg:ml-64">
          <div className="text-gray-500">Cargando reportes...</div>
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
            <h1 className="text-4xl font-bold text-gray-900">Reportes</h1>
            <p className="mt-2 text-gray-600">Genera y descarga reportes de tu negocio</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    ${summary?.totalRevenue.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ventas</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {summary?.totalSales || 0}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Productos</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {summary?.totalProducts || 0}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fecha</p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {summary?.currentDate || new Date().toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="rounded-lg bg-orange-50 p-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Generate Report Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Generar Reporte</h2>
                <p className="text-sm text-gray-600">Descarga un reporte completo de tus ventas, productos e inventario</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">El reporte incluye:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-blue-600 rounded-full" />
                  Resumen ejecutivo de ingresos y ventas
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-blue-600 rounded-full" />
                  Detalle completo de todas las transacciones
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-blue-600 rounded-full" />
                  Lista de productos con información de inventario
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-blue-600 rounded-full" />
                  Métricas de rendimiento del negocio
                </li>
              </ul>
            </div>

            <Button
              onClick={downloadReport}
              disabled={downloading}
              className="gap-2 h-11 text-base"
            >
              <Download className="h-5 w-5" />
              {downloading ? 'Descargando...' : 'Descargar Reporte PDF'}
            </Button>

            <p className="mt-4 text-xs text-gray-500">
              El reporte se generará en formato PDF con los datos actuales de tu negocio.
              Todos los montos están en dólares.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
