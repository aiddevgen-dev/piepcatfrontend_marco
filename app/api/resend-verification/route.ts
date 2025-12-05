import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { sendVerificationEmail } from "@/lib/email"
import { generateVerificationToken, getTokenExpiry } from "@/lib/token"

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

        if (!user) {
            return NextResponse.json(
                { error: "No account found with this email" },
                { status: 404 }
            )
        }

        if (user.verified) {
            return NextResponse.json(
                { error: "Email is already verified" },
                { status: 400 }
            )
        }

        const verificationToken = generateVerificationToken()
        const verificationTokenExpiry = getTokenExpiry()

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { verificationToken, verificationTokenExpiry },
            }
        )

        await sendVerificationEmail(email, verificationToken)

        return NextResponse.json(
            { message: "Verification email sent" },
            { status: 200 }
        )
    } catch (error) {
        console.error("Resend verification error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}