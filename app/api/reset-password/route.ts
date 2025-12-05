import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() },
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired reset link" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { password: hashedPassword },
                $unset: { resetToken: "", resetTokenExpiry: "" },
            }
        )

        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Reset password error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}