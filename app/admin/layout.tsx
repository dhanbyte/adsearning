"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Menu, X, BarChart3, Users, Zap, CreditCard, Settings, LogOut, Bell } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const adminMenu = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Zap, label: "Manage Ads", href: "/admin/ads" },
    { icon: CreditCard, label: "Withdrawals", href: "/admin/withdrawals" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-md border-b border-white/10 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link
              href="/admin"
              className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent"
            >
              Admin Panel
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <LogOut size={20} className="text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="fixed lg:static w-64 h-[calc(100vh-64px)] bg-black/30 border-r border-white/10 overflow-y-auto">
            <div className="p-6 space-y-4">
              {/* Admin Info */}
              <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 p-4 rounded-xl">
                <h3 className="text-white font-semibold text-sm">Administrator</h3>
                <p className="text-gray-400 text-xs">admin@earnxhub.com</p>
              </Card>

              {/* Menu Items */}
              <nav className="space-y-2">
                {adminMenu.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <Link key={idx} href={item.href}>
                      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                        <Icon size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
