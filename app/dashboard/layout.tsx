"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Zap,
  Video,
  Target,
  Smartphone,
  ListTodo,
  Users,
  Wallet,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Zap, label: "Watch Ads", href: "/dashboard/watch-ads" },
    { icon: Video, label: "Video Ads", href: "/dashboard/video-ads" },
    { icon: Target, label: "Offerwalls", href: "/dashboard/offerwalls" },
    { icon: Smartphone, label: "App Installs", href: "/dashboard/app-installs" },
    { icon: ListTodo, label: "Daily Tasks", href: "/dashboard/daily-tasks" },
    { icon: Users, label: "Referral", href: "/dashboard/referral" },
    { icon: Wallet, label: "Wallet", href: "/dashboard/wallet" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/40 backdrop-blur-md border-b border-white/10 z-40">
        <div className="px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              href="/dashboard"
              className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            >
              EarnX
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Bell size={18} className="text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/dashboard/settings">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings size={18} className="text-gray-300" />
              </button>
            </Link>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <LogOut size={18} className="text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex pt-14 sm:pt-16">
        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && isMobile && (
          <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Sidebar */}
        {(sidebarOpen || !isMobile) && (
          <aside
            className={`${
              isMobile ? "fixed left-0 top-14" : "static"
            } w-64 h-[calc(100vh-56px)] bg-black/30 border-r border-white/10 overflow-y-auto z-30 lg:z-auto`}
          >
            <div className="p-4 sm:p-6 space-y-4">
              {/* Balance Card */}
              <Card className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/30 p-3 sm:p-4 rounded-xl">
                <p className="text-gray-300 text-xs sm:text-sm mb-1">Available Balance</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">₹2,450</h3>
                <p className="text-cyan-400 text-xs mt-2">Pending: ₹500</p>
              </Card>

              {/* Menu Items */}
              <nav className="space-y-2">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <Link key={idx} href={item.href}>
                      <button
                        onClick={() => isMobile && setSidebarOpen(false)}
                        className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm sm:text-base"
                      >
                        <Icon size={18} className="sm:w-5 sm:h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    </Link>
                  )
                })}
              </nav>

              {/* Help Card */}
              <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 p-3 sm:p-4 rounded-xl mt-6 sm:mt-8">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle size={16} className="text-purple-400" />
                  <h4 className="text-white font-semibold text-xs sm:text-sm">Need Help?</h4>
                </div>
                <p className="text-gray-400 text-xs mb-3">Contact support via WhatsApp</p>
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 rounded-lg text-white text-xs"
                >
                  Chat Now
                </Button>
              </Card>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-8 overflow-y-auto w-full">{children}</main>
      </div>
    </div>
  )
}
