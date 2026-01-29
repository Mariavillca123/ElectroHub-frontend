'use client'

import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminPanel from "../../components/dashboard/AdminPanel"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { useAuth } from "../../contexts/AuthContext"

export default function AdminPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [user, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg font-semibold">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar role="admin" />
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="flex-1 overflow-auto pt-16 lg:pt-0 px-4 py-8 lg:px-8">
          <AdminPanel />
        </div>
      </main>
    </div>
  )
}
