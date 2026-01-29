'use client'

import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import VendorPanel from "../../components/dashboard/VendorPanel"
import DashboardSidebar from "../../components/layout/DashboardSidebar"
import { useAuth } from "../../contexts/AuthContext"

export default function VendorPage() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // Esperar a que AuthContext cargue
    if (loading) return
    
    if (!user || user.role !== 'vendor') {
      navigate('/login', { replace: true })
      return
    }
    setPageLoading(false)
  }, [user, loading, navigate])

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
      <DashboardSidebar role="vendor" />
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <div className="flex-1 overflow-auto px-4 py-8 lg:px-8">
          <VendorPanel />
        </div>
      </main>
    </div>
  )
}
