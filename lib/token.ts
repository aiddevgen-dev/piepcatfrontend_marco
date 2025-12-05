import crypto from "crypto"

export function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex")
}

export function getTokenExpiry(): Date {
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 24)
    return expiry
}

export function generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString("hex")
}

export function getPasswordResetExpiry(): Date {
    const expiry = new Date()
    expiry.setHours(expiry.getHours() + 1) // 1 hour
    return expiry
}
