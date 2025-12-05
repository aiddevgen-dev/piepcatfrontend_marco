import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your email - VoiceAI",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Verify your email</h1>
          <p>Thank you for signing up for VoiceAI. Please click the button below to verify your email 
  address.</p>
          <a href="${verificationUrl}" style="display: inline-block; background-color: #22c55e; color: white;       
  padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">If you didn't create an account, you can safely ignore this      
  email.</p>
          <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
        </div>
      `,
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password - VoiceAI",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Reset your password</h1>
          <p>You requested to reset your password. Click the button below to create a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #22c55e; color: white; padding:     
  12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this 
  email.</p>
          <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
        </div>
      `,
  })
}