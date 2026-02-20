import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Mail, CalendarDays, PackageCheck, Truck, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "../../components/ui/Button"

interface ClientSummary {
  id: number
  name: string
  email: string
  created_at: string
  orders: number
  spent: number
}

interface ClientOrder {
  id: number
  product: string
  quantity: number
  total: number
  status: 'pendiente' | 'enviado' | 'entregado' | 'cancelado'
  created_at: string
}

export default function VendorClientsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(null)
  const [orders, setOrders] = useState<ClientOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login')
      return
    }
    fetchClients()
  }, [user, navigate])

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get('/api/clients/summary', { headers })
      setClients(res.data || [])
    } catch (e) {
      console.error('Error fetching clients', e)
    } finally {
      setLoading(false)
    }
  }

  const openClientOrders = async (client: ClientSummary) => {
    setSelectedClient(client)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`/api/sales/by-client/${client.id}`, { headers })
      setOrders(res.data || [])
    } catch (e) {
      console.error('Error fetching client orders', e)
    }
  }

  const updateStatus = async (orderId: number, status: ClientOrder['status']) => {
    setProcessing(true)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await axios.put(`/api/sales/${orderId}/status`, { status }, { headers })
      // Refresh orders
      if (selectedClient) {
        await openClientOrders(selectedClient)
      }
    } catch (e) {
      console.error('Error updating status', e)
      alert('No se pudo actualizar el estado')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-white dark:bg-gray-950">
        <DashboardSidebar role="vendor" />
        <main className="flex-1 flex items-center justify-center lg:ml-64">
          <div className="text-gray-500 dark:text-gray-400">Cargando clientes...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      <DashboardSidebar role="vendor" />
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="flex-1 overflow-auto px-4 py-8 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Clientes</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Todos los clientes registrados en la plataforma</p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lista de Clientes ({clients.length})</h2>
            </div>

            {clients.length === 0 ? (
              <div className="py-12 text-center text-gray-600 dark:text-gray-400">No hay clientes registrados</div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {clients.map((c) => (
                  <div key={c.id} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold">
                        {c.name?.charAt(0).toUpperCase() || 'C'}
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> {c.email}</span>
                          <span className="inline-flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(c.created_at).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pedidos</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-white">{c.orders}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Gastado</p>
                        <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">${Number(c.spent).toFixed(2)}</p>
                      </div>
                      <Button variant="outline" onClick={() => openClientOrders(c)}>Ver pedidos</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedClient && (
            <div className="mt-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Pedidos de {selectedClient.name}</h2>
                <Button variant="outline" onClick={() => setSelectedClient(null)}>Cerrar</Button>
              </div>
              {orders.length === 0 ? (
                <div className="py-10 text-center text-gray-600 dark:text-gray-400">Este cliente no tiene pedidos</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{o.product}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{o.quantity}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">${Number(o.total).toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(o.created_at).toLocaleDateString('es-ES')}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium rounded-full px-2 py-1 ${
                              o.status === 'pendiente' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                              o.status === 'enviado' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                              o.status === 'entregado' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                              'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}>{o.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" disabled={processing} onClick={() => updateStatus(o.id, 'enviado')}>
                                <Truck className="h-4 w-4 mr-1" /> Enviar
                              </Button>
                              <Button variant="outline" disabled={processing} onClick={() => updateStatus(o.id, 'entregado')}>
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Entregar
                              </Button>
                              <Button variant="destructive" disabled={processing} onClick={() => updateStatus(o.id, 'cancelado')}>
                                <XCircle className="h-4 w-4 mr-1" /> Cancelar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}