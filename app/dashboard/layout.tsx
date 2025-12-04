"use client"

import { useState } from "react"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <DashboardSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Main content */}
            <main
                className={`min-h-screen transition-all duration-300 ${sidebarOpen ? "ml-[260px]" : "ml-0"
                    }`}
            >
                {children}
            </main>
        </div>
    )
}