import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const token = searchParams.get("token")

        if (!token) {
            return NextResponse.redirect(new URL("/login?error=missing-token", request.url))
        }

        const client = await clientPromise
        const db = client.db()
        const usersCollection = db.collection("users")

        const user = await usersCollection.findOne({
            verificationToken: token,
            verificationTokenExpiry: { $gt: new Date() },
        })

        if (!user) {
            return NextResponse.redirect(new URL("/login?error=invalid-token", request.url))
        }

        await usersCollection.updateOne(
            { _id: user._id },
            {
                $set: { verified: true },
                $unset: { verificationToken: "", verificationTokenExpiry: "" },
            }
        )

        return NextResponse.redirect(new URL("/login?verified=true", request.url))
    } catch (error) {
        console.error("Verify email error:", error)
        return NextResponse.redirect(new URL("/login?error=server-error", request.url))
    }
}
