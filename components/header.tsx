"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold instrument italic text-xl">
          V
        </div>
        <span className="text-xl font-medium tracking-tight instrument italic">VoiceAI</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-1 bg-white/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/60 shadow-sm">
        <a
          href="#"
          className="text-foreground/70 hover:text-foreground hover:bg-white/80 text-sm px-4 py-2 rounded-full transition-all duration-200"
        >
          Use Cases
        </a>
        <a
          href="#"
          className="text-foreground/70 hover:text-foreground hover:bg-white/80 text-sm px-4 py-2 rounded-full transition-all duration-200"
        >
          Pricing
        </a>
        <a
          href="#"
          className="text-foreground/70 hover:text-foreground hover:bg-white/80 text-sm px-4 py-2 rounded-full transition-all duration-200"
        >
          Developers
        </a>
      </nav>

      {/* Login Button Group with Arrow */}
      <div className="flex items-center gap-4">
        <a href="/login" className="hidden sm:block text-sm font-medium hover:opacity-70 transition-opacity">
          Log in
        </a>
        <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <button className="absolute right-0 px-2.5 py-2 rounded-full bg-primary text-white font-normal text-xs transition-all duration-300 hover:bg-primary/90 cursor-pointer h-10 flex items-center justify-center -translate-x-10 group-hover:-translate-x-14 z-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <Link href="/signup" className="px-6 py-2 rounded-full bg-primary text-white font-medium text-sm transition-all duration-300 hover:bg-primary/90 cursor-pointer h-10 flex items-center z-10 shadow-lg shadow-primary/20">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
