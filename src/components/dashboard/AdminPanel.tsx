import { useEffect, useState } from "react"
import axios from "../../utils/axios"
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react'

interface Stats {
  users: number
  products: number
  sales: number
  revenue: number
  vendors: number
  clients: number
}

export default function AdminPanel() {
  const [stats, setStats] = useState<Stats>({ users: 0, products: 0, sales: 0, revenue: 0, vendors: 0, clients: 0 })
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const [vendors, clients, products, sales] = await Promise.all([
          axios.get("/api/vendors", { headers }).catch(() => ({ data: [] })),
          axios.get("/api/clients", { headers }).catch(() => ({ data: [] })),
          axios.get("/api/products", { headers }).catch(() => ({ data: [] })),
          axios.get("/api/sales", { headers }).catch(() => ({ data: [] }))
        ])

        const vendorsData = Array.isArray(vendors.data) ? vendors.data : []
        const clientsData = Array.isArray(clients.data) ? clients.data : []
        const salesData = sales.data || []
        const totalRevenue = salesData.reduce((acc: number, s: any) => acc + (s.total || 0), 0)

        const vendorsCount = vendorsData.length

        const clientsCount = clientsData.filter((u: any) => {
          const role = String(u.role || "").toLowerCase()
          return role === "client" || role === "cliente" || role === "customer"
        }).length || clientsData.length

        setStats({
          users: vendorsCount + (clientsData.length || 0),
          products: products.data?.length || 0,
          sales: salesData.length,
          revenue: totalRevenue,
          vendors: vendorsCount,
          clients: clientsCount
        })

        setVendors(vendorsData)
        setClients(clientsData)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Usuarios",
      value: stats.users,
      icon: Users,
      color: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Productos",
      value: stats.products,
      icon: Package,
      color: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Pedidos",
      value: stats.sales,
      icon: ShoppingBag,
      color: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Ingresos",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-orange-50",
      textColor: "text-orange-600"
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Cargando estadísticas...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-gray-600">Bienvenido al panel de control de ElectroHub</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`rounded-lg ${card.color} p-3`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Usuarios por Rol</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Vendedores</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.vendors}</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.clients}</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>



      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vendedores y Clientes</h2>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios ({vendors.length + clients.length})</h3>
            <span className="text-sm text-gray-500">Vendedores y clientes</span>
          </div>
          <div className="px-6 py-3 grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-3">Usuario</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Rol</div>
            <div className="col-span-2">Empresa</div>
            <div className="col-span-2">Registro</div>
          </div>
          <div className="divide-y divide-gray-100">
            {vendors.map((u) => (
              <UserRow key={u.id || u.email} user={u} badge="Vendedor" badgeClass="bg-blue-100 text-blue-700" />
            ))}
            {clients.map((u) => (
              <UserRow key={(u.id || u.email) + '-c'} user={u} badge="Cliente" badgeClass="bg-gray-100 text-gray-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface UserRowProps {
  user: any
  badge: string
  badgeClass: string
}

function UserRow({ user, badge, badgeClass }: UserRowProps) {
  return (
    <div className="grid grid-cols-12 items-center gap-4 py-3 px-6 text-sm">
      <div className="col-span-3 font-medium text-gray-900 flex items-center gap-2">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-semibold">
          {(user.name || "?").charAt(0).toUpperCase()}
        </div>
        <span className="truncate">{user.name}</span>
      </div>
      <div className="col-span-3 text-gray-600 truncate">{user.email}</div>
      <div className="col-span-2">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>{badge}</span>
      </div>
      <div className="col-span-2 text-gray-600 truncate">{user.company || user.empresa || '-'}</div>
      <div className="col-span-2 text-gray-600 truncate">{user.created_at?.slice(0, 10) || ''}</div>
    </div>
  )
}

