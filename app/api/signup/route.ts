import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { sendVerificationEmail } from "@/lib/email"
import { generateVerificationToken, getTokenExpiry } from "@/lib/token"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const verificationToken = generateVerificationToken()
    const verificationTokenExpiry = getTokenExpiry()

    await usersCollection.insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      verificationTokenExpiry,
      createdAt: new Date(),
    })

    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json(
      { message: "Please check your email to verify your account" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}