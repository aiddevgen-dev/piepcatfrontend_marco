"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
    Home,
    Settings,
    LogOut,
    BarChart3,
    Users,
    MessageSquare,
    Phone,
    FileText,
    HelpCircle,
    PanelLeftClose,
    PanelLeft
} from "lucide-react"

const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { label: "Conversations", href: "/dashboard/conversations", icon: MessageSquare },
    { label: "Calls", href: "/dashboard/calls", icon: Phone },
    { label: "Contacts", href: "/dashboard/contacts", icon: Users },
    { label: "Documents", href: "/dashboard/documents", icon: FileText },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
    { label: "Help", href: "/dashboard/help", icon: HelpCircle },
]

interface DashboardSidebarProps {
    isOpen: boolean
    onToggle: () => void
}

export default function DashboardSidebar({ isOpen, onToggle }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { data: session } = useSession()

    return (
        <>
            {/* Toggle button when sidebar is closed */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border shadow-sm hover:bg-gray-100 
  transition-colors"
                >
                    <PanelLeft className="size-5" />
                </button>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white border-r z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ width: "260px" }}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Header with logo and close button */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex 
  items-center justify-center text-white font-bold instrument italic text-xl">
                                V
                            </div>
                            <span className="text-xl font-medium tracking-tight instrument italic">VoiceAI</span>
                        </div>
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <PanelLeftClose className="size-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-gray-100"
                                        }`}
                                >
                                    <item.icon className="size-4" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User info and sign out */}
                    <div className="border-t pt-4 space-y-2">
                        {session?.user && (
                            <div className="px-3 py-2">
                                <p className="text-sm font-medium truncate">{session.user.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                            </div>
                        )}
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground
  hover:bg-gray-100 transition-colors w-full"
                        >
                            <LogOut className="size-4" />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}