'use client'

import React from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  Zap,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  FileText,
  Tag,
  ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../utils/cn'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const customerNav: NavItem[] = [
  { href: '/cliente', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cliente/pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
  { href: '/cliente/configuracion', label: 'Configuración', icon: Settings },
]

const vendorNav: NavItem[] = [
  { href: '/vendedor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vendedor/productos', label: 'Productos', icon: Package },
  { href: '/vendedor/ventas', label: 'Ventas', icon: BarChart3 },
  { href: '/vendedor/clientes', label: 'Clientes', icon: Users },
  { href: '/vendedor/reportes', label: 'Reportes', icon: FileText },
]

const adminNav: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Package },
]

export default function DashboardSidebar({ role }: { role: 'customer' | 'vendor' | 'admin' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = role === 'admin' ? adminNav : role === 'vendor' ? vendorNav : customerNav
  const roleLabel = role === 'admin' ? 'Administrador' : role === 'vendor' ? 'Vendedor' : 'Cliente'
  const roleIcon = role === 'admin' ? ShieldCheck : role === 'vendor' ? Store : Users

  const RoleIcon = roleIcon

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className={cn(
        "fixed top-4 z-50 lg:hidden transition-all",
        isOpen ? "left-[272px]" : "left-4"
      )}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 shadow-md"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">ElectroHub</span>
          </Link>
        </div>

        {/* Role Badge */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
            <RoleIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{roleLabel}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-gray-900">{user?.name || 'Usuario'}</p>
              <p className="truncate text-xs text-gray-600">{user?.email || 'usuario@email.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
