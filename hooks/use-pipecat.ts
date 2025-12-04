"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { PipecatClient, type PipecatClientOptions, RTVIEvent } from "@pipecat-ai/client-js"
import { WebSocketTransport } from "@pipecat-ai/websocket-transport"

export function usePipecat() {
  const [isConnected, setIsConnected] = useState(false)
  const [activeText, setActiveText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const clientRef = useRef<PipecatClient | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio()
    audioRef.current.autoplay = true

    return () => {
      if (clientRef.current) {
        clientRef.current.disconnect().catch(console.error)
      }
      if (audioRef.current) {
        audioRef.current.srcObject = null
        audioRef.current = null
      }
    }
  }, [])

  const connect = useCallback(async (assistantId = "assistant_groq_whisper") => {
    try {
      setError(null)
      const baseUrl = process.env.NEXT_PUBLIC_RTVI_URL || "https://75c772eb0aba.ngrok-free.app"

      const config: PipecatClientOptions = {
        transport: new WebSocketTransport(),
        enableMic: true,
        enableCam: false,
        callbacks: {
          onConnected: () => {
            setIsConnected(true)
            setActiveText("Connected. Say hello!")
          },
          onDisconnected: () => {
            setIsConnected(false)
            setActiveText("Disconnected")
          },
          onBotReady: () => {
            setActiveText("Agent is ready.")
          },
          onUserTranscript: (data) => {
            if (data.final) {
              const msg = `User: ${data.text}`
              setActiveText(msg)
              console.log(msg)
            }
          },
          onBotTranscript: (data) => {
            const msg = `Bot: ${data.text}`
            setActiveText(msg)
            console.log(msg)
          },
          onError: (err) => {
            console.error("Pipecat error:", err)
            setError(err?.message || "Unknown error")
          },
        },
      }

      const client = new PipecatClient(config)
      clientRef.current = client

      // Handle audio tracks
      client.on(RTVIEvent.TrackStarted, (track, participant) => {
        if (!participant?.local && track.kind === "audio" && audioRef.current) {
          const stream = new MediaStream([track])
          audioRef.current.srcObject = stream
        }
      })

      setActiveText("Initializing devices...")
      await client.initDevices()

      setActiveText("Connecting...")
      const response = await fetch(`${baseUrl}/frontend/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assistant_id: assistantId }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get WebSocket URL: ${response.status}`)
      }

      const { ws_url } = await response.json()
      await client.connect({ wsUrl: ws_url })
    } catch (err: any) {
      setError(err.message)
      setIsConnected(false)
      setActiveText("Connection failed")
    }
  }, [])

  const disconnect = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.disconnect()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [])

  return {
    isConnected,
    activeText,
    error,
    connect,
    disconnect,
  }
}
