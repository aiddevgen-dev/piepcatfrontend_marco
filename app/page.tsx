"use client"

import Header from "@/components/header"
import VoiceDemoHero from "@/components/voice-demo-hero"
import ShaderBackground from "@/components/shader-background"

export default function ShaderShowcase() {
  return (
    <ShaderBackground>
      <Header />
      <VoiceDemoHero />
    </ShaderBackground>
  )
}
