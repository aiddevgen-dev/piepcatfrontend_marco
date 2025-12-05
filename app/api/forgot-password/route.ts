import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { sendPasswordResetEmail } from "@/lib/email"
import { generatePasswordResetToken, getPasswordResetExpiry } from "@/lib/token"

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({ email })

        // Don't reveal if email exists or not (security)
        if (!user) {
            return NextResponse.json(
                { message: "If an account exists, a reset link has been sent" },
                { status: 200 }
            )
        }

        const resetToken = generatePasswordResetToken()
        const resetTokenExpiry = getPasswordResetExpiry()

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { resetToken, resetTokenExpiry },
            }
        )

        await sendPasswordResetEmail(email, resetToken)

        return NextResponse.json(
            { message: "If an account exists, a reset link has been sent" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Forgot password error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}