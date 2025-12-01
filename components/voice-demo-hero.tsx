"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic,
  Phone,
  ChevronRight,
  ShoppingBag,
  HeartPulse,
  Wallet,
  Sparkles,
  Home,
  GraduationCap,
  Plane,
} from "lucide-react"
import { PulsingCircle } from "@/components/pulsing-circle"
import { cn } from "@/lib/utils"
import { usePipecat } from "@/hooks/use-pipecat"

// Data structure for use cases based on the provided requirements
const categories = [
  {
    id: "retail",
    title: "Retail & E-commerce",
    icon: ShoppingBag,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    items: [
      {
        title: "Order status & delivery updates",
        description:
          "Outbound calls to inform customers about shipment, expected delivery, delays, or failed delivery attempts.",
      },
      {
        title: "Cash-on-delivery (COD) confirmation",
        description: "Automated calls to confirm address and intent before dispatching COD orders to reduce RTO.",
      },
      {
        title: "Abandoned cart recovery",
        description: "Calling high-intent customers who dropped off at checkout with offers or assistance.",
      },
      {
        title: "Product availability & store information",
        description: "Inbound AI answering questions about stock, store hours, nearest store, basic product FAQs.",
      },
      {
        title: "Returns & exchange workflow",
        description: "Guiding customers through return eligibility, pickup scheduling, and status.",
      },
      {
        title: "Loyalty & promotions",
        description:
          "Personalized calls to inform loyal customers about sales, new arrivals, and loyalty point expiry.",
      },
      {
        title: "Post-purchase feedback / NPS",
        description: "Short automated survey calls after delivery to measure satisfaction.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare & Medical",
    icon: HeartPulse,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    items: [
      {
        title: "Appointment booking & rescheduling",
        description: "AI handling incoming calls to check doctor availability and schedule/reschedule appointments.",
      },
      {
        title: "Appointment reminders & no-show reduction",
        description: "Outbound reminders with options to confirm, cancel, or reschedule via voice.",
      },
      {
        title: "Pre-visit screening & triage",
        description: "Automated symptom questions before routing to a nurse/doctor or confirming type of visit.",
      },
      {
        title: "Medication adherence reminders",
        description:
          "Daily/weekly calls asking if the patient has taken medication, logging responses, and escalating if missed.",
      },
      {
        title: "Lab result notifications",
        description:
          "Calling patients to inform that lab results are ready and routing them if they want to speak to staff.",
      },
      {
        title: "Post-discharge follow-up",
        description:
          "Check-in calls after surgeries or hospital discharge to ask about recovery and flag warning signs.",
      },
      {
        title: "Insurance & billing FAQs",
        description: "AI answering common questions about coverage, copays, outstanding balances, and payment options.",
      },
    ],
  },
  {
    id: "finance",
    title: "Finance & Banking",
    icon: Wallet,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    items: [
      {
        title: "Transaction & balance inquiries",
        description:
          "Authenticated inbound calls where AI provides balances, recent transactions, and basic account info.",
      },
      {
        title: "Fraud alerts & verification",
        description: "Outbound calls to confirm suspicious transactions and block/unblock cards instantly.",
      },
      {
        title: "Loan application status",
        description: "Automated updates on loan application progress and missing document reminders.",
      },
      {
        title: "Payment reminders",
        description: "Friendly outbound calls to remind customers of upcoming bill due dates.",
      },
      {
        title: "Credit card activation",
        description: "Secure automated process to activate new cards and set PINs.",
      },
    ],
  },
  {
    id: "real-estate",
    title: "Real Estate",
    icon: Home,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    items: [
      {
        title: "Lead response & qualification",
        description: "Instant calls to people submitting property inquiries to qualify budget, location, and timeline.",
      },
      {
        title: "Property visit scheduling",
        description: "Outbound calls to schedule or confirm house/site visits and send reminders.",
      },
      {
        title: "Follow-up after site visits",
        description: "Collecting feedback, clarifying objections, and gauging interest level.",
      },
      {
        title: "Rental inquiries & tenant screening",
        description: "AI gathering basic information from prospective tenants (income, move-in date, preferences).",
      },
      {
        title: "Document checklist & reminders",
        description: "Calling buyers/tenants with reminders for document submission (ID, proof of funds, etc.).",
      },
      {
        title: "Rent payment reminders",
        description: "Automated monthly calls to tenants with due date and payment options.",
      },
      {
        title: "Maintenance requests triage",
        description:
          "Inbound AI capturing, categorizing, and prioritizing maintenance issues before assigning to vendors.",
      },
    ],
  },
  {
    id: "education",
    title: "Education & Training",
    icon: GraduationCap,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    items: [
      {
        title: "Admissions inquiry handling",
        description: "AI answering questions about programs, eligibility, fees, and application deadlines.",
      },
      {
        title: "Admission process reminders",
        description: "Calls to applicants about missing documents, test dates, or payment deadlines.",
      },
      {
        title: "Fee payment reminders",
        description: "Monthly or semester-based reminders with options to connect to accounts department.",
      },
      {
        title: "Parent communication",
        description:
          "Automated calls about attendance issues, exam schedules, important announcements, or PTA meetings.",
      },
      {
        title: "Course/class scheduling",
        description: "For training centers, AI can schedule/reschedule class slots or demo sessions.",
      },
      {
        title: "Placement & interview coordination",
        description: "Calls to students to confirm interview slots and share instructions.",
      },
      {
        title: "Alumni engagement",
        description:
          "Outbound calls for alumni event invitations, fund-raising campaigns, and updating contact details.",
      },
    ],
  },
  {
    id: "hospitality",
    title: "Hospitality & Travel",
    icon: Plane,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    items: [
      {
        title: "Reservation booking & modification",
        description: "AI handling inbound calls to book or change hotel, restaurant, or tour reservations.",
      },
      {
        title: "Pre-arrival confirmation & upsell",
        description: "Calls to confirm stay and offer add-ons (airport pickup, breakfast, room upgrade).",
      },
      {
        title: "Flight / trip disruption alerts",
        description: "Outbound calls notifying schedule changes, cancellations, or gate changes.",
      },
    ],
  },
]

export default function VoiceDemoHero() {
  // State for the active category accordion
  const [activeCategory, setActiveCategory] = useState<string | null>("retail")
  // State for the call demo
  const [activeUseCase, setActiveUseCase] = useState<{ title: string; description: string } | null>(null)

  const { isConnected, activeText, connect, disconnect } = usePipecat()

  const handleCallToggle = async () => {
    if (isConnected) {
      await disconnect()
    } else {
      // Pass a specific assistant ID if needed, or default
      await connect()
    }
  }

  const handleUseCaseSelect = (item: { title: string; description: string }) => {
    setActiveUseCase(item)
    if (isConnected) {
      disconnect()
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-stretch justify-center p-4 lg:p-8 gap-6 max-w-7xl mx-auto z-10 relative">
      {/* Left Column: Primary Action "Talk to us" - Highlighted clearly */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:w-[45%] flex flex-col"
      >
        <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/50 rounded-[32px] shadow-xl overflow-hidden flex flex-col relative">
          {/* Subtle gradient background for the "Talk to us" card */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white/20 z-0" />

          {/* Header Area */}
          <div className="relative z-10 p-8 pb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/50 border border-purple-200/50 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-xs font-medium text-purple-900 tracking-wide uppercase">Interactive Demo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
              {activeUseCase ? activeUseCase.title : "Talk to us."}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-md">
              {activeUseCase
                ? activeUseCase.description
                : "Experience the future of voice AI. Select a use case from the list or just say hello to start."}
            </p>
          </div>

          {/* Main Visualizer Area - Centered and spacious */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 min-h-[300px] py-8">
            <div className="relative">
              <PulsingCircle isActive={isConnected} />

              {/* Live Status Indicator */}
              <div
                className={cn(
                  "absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2",
                  isConnected
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-slate-100 text-slate-500 border border-slate-200",
                )}
              >
                <div
                  className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500 animate-pulse" : "bg-slate-400")}
                />
                {isConnected ? "Live Agent Active" : "Ready to connect"}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="p-8 relative z-10 bg-white/30 border-t border-white/50 backdrop-blur-sm">
            <div className="text-center mb-8 h-16 flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeText || "default"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl font-medium text-slate-800"
                >
                  {activeText || (isConnected ? "Listening..." : "Hi, how can I help you today?")}
                </motion.p>
              </AnimatePresence>
            </div>

            <button
              onClick={handleCallToggle}
              className={cn(
                "w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98]",
                isConnected ? "bg-rose-500 hover:bg-rose-600 text-white" : "bg-slate-900 hover:bg-slate-800 text-white",
              )}
            >
              {isConnected ? (
                <>
                  <Phone className="w-5 h-5" /> End Conversation
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" /> Start Conversation
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Categories & Use Cases - Clean vertical list */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:w-[55%] flex flex-col h-full min-h-[600px]"
      >
        <div className="bg-white/30 backdrop-blur-md border border-white/40 rounded-[32px] shadow-lg p-6 lg:p-8 h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-serif text-slate-900 mb-2">Select Use Case</h2>
            <p className="text-slate-500">Explore how our AI handles complex scenarios across industries.</p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group rounded-2xl bg-white/40 border border-white/60 overflow-hidden transition-all duration-300 hover:bg-white/60 hover:shadow-sm"
              >
                <button
                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-3 rounded-xl transition-colors duration-300",
                        category.bgColor,
                        activeCategory === category.id ? "bg-opacity-100" : "bg-opacity-50",
                      )}
                    >
                      <category.icon className={cn("w-6 h-6", category.color)} />
                    </div>
                    <span
                      className={cn(
                        "text-lg font-semibold transition-colors",
                        activeCategory === category.id ? "text-slate-900" : "text-slate-700",
                      )}
                    >
                      {category.title}
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5 text-slate-400 transition-transform duration-300",
                      activeCategory === category.id ? "rotate-90" : "group-hover:translate-x-1",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {activeCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-0 pl-[5.5rem]">
                        <div className="grid grid-cols-1 gap-2">
                          {category.items.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleUseCaseSelect(item)}
                              className={cn(
                                "text-left transition-all flex items-start gap-3 group/item border border-transparent hover:border-purple-100 rounded-xl p-3",
                                activeUseCase?.title === item.title
                                  ? "bg-purple-500/10 border-purple-200"
                                  : "hover:bg-white/50",
                              )}
                            >
                              <div
                                className={cn(
                                  "mt-1.5 w-1.5 h-1.5 rounded-full transition-colors flex-shrink-0",
                                  activeUseCase?.title === item.title
                                    ? "bg-purple-600"
                                    : "bg-slate-300 group-hover/item:bg-purple-500",
                                )}
                              />
                              <div>
                                <div
                                  className={cn(
                                    "text-[15px] font-medium transition-colors",
                                    activeUseCase?.title === item.title
                                      ? "text-purple-900"
                                      : "text-slate-700 group-hover/item:text-purple-900",
                                  )}
                                >
                                  {item.title}
                                </div>
                                <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
