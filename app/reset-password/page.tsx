"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters")
            return
        }

        setLoading(true)

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
            } else {
                setError(data.error)
            }
        } catch (err) {
            setError("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    if (!token) {
        return (
            <div className="w-full max-w-md p-8">
                <p className="text-red-500">Invalid reset link. Please request a new one.</p>
                <Link href="/forgot-password" className="text-primary hover:underline font-medium">
                    Request new link
                </Link>
            </div>
        )
    }

    return (
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
            <h1 className="text-3xl font-bold mb-2">Reset password</h1>
            <p className="text-muted-foreground mb-8">Enter your new password below.</p>

            {success ? (
                <div>
                    <p className="text-green-500 text-sm mb-4">
                        Password reset successfully!
                    </p>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in with new password
                    </Link>
                </div>
            ) : (
                <>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium mb-2 block">New password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground
  hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword" className="text-sm font-medium mb-2 block">Confirm
                                password</Label>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-12 bg-green-500 hover:bg-green-600       
  text-white">
                            {loading ? "Resetting..." : "Reset password"}
                        </Button>
                    </form>
                </>
            )}
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}