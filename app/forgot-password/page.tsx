"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            if (res.ok) {
                setSuccess(true)
            } else {
                const data = await res.json()
                setError(data.error)
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-12">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center      
  justify-center text-white font-bold instrument italic text-xl">
                        V
                    </div>
                    <span className="text-xl font-medium tracking-tight instrument italic">VoiceAI</span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold mb-2">Forgot password?</h1>
                <p className="text-muted-foreground mb-8">Enter your email and we'll send you a reset link.</p>

                {success ? (
                    <div>
                        <p className="text-green-500 text-sm mb-4">
                            If an account exists with this email, you will receive a password reset link.
                        </p>
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium mb-2 block">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full h-12 bg-green-500 hover:bg-green-600     
  text-white">
                                {loading ? "Sending..." : "Send reset link"}
                            </Button>
                        </form>

                        <p className="text-center text-sm mt-6">
                            Remember your password? <Link href="/login" className="text-primary hover:underline 
  font-medium">Sign in</Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}