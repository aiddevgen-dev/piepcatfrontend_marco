"use client"

import { motion } from "framer-motion"

interface PulsingCircleProps {
  isActive?: boolean
  className?: string
}

export function PulsingCircle({ isActive = false, className }: PulsingCircleProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Ripple Effect - Only active when call is live */}
      {isActive && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.4, 0], scale: [1, 2] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
            className="absolute inset-0 bg-purple-400/20 rounded-full z-0"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 bg-purple-400/20 rounded-full z-0"
          />
        </>
      )}

      {/* Core Circle */}
      <motion.div
        animate={{
          scale: isActive ? [1, 1.1, 1] : 1,
          boxShadow: isActive ? "0 0 40px 10px rgba(168, 85, 247, 0.4)" : "0 0 0px 0px rgba(168, 85, 247, 0)",
        }}
        transition={{ duration: 1.5, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center relative z-10 shadow-2xl"
      >
        {/* Inner Visualizer */}
        <div className="flex items-center justify-center gap-1 h-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              animate={isActive ? { height: [10, 32, 10] } : { height: 8 }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.1,
                repeatType: "reverse",
              }}
              className="w-2 bg-white rounded-full opacity-90"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
