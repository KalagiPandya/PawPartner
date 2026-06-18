/**
 * Safe email helper — works with or without SendGrid.
 * If not configured, returns the OTP directly (dev mode).
 */
export const sendOTPEmail = async (to, otp, subject = "PawPartner — Your OTP") => {
  if (!process.env.SENDGRID_API_KEY || !process.env.VERIFIED_SENDER_EMAIL) {
    console.log(`[DEV MAIL] OTP for ${to}: ${otp}`)
    return { sent: false, otp: String(otp) }
  }
  try {
    const sgMail = (await import("@sendgrid/mail")).default
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await sgMail.send({
      to,
      from: process.env.VERIFIED_SENDER_EMAIL,
      subject,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:16px;background:#FFF8F3;">
        <h2 style="color:#FF6B35;">🐾 PawPartner</h2>
        <p style="color:#555">${subject}</p>
        <div style="background:#FF6B35;color:white;font-size:32px;font-weight:900;letter-spacing:10px;text-align:center;padding:20px;border-radius:12px">${otp}</div>
        <p style="color:#999;font-size:13px;margin-top:20px">Valid for 10 minutes. Do not share this OTP.</p>
      </div>`
    })
    return { sent: true }
  } catch (err) {
    console.error("[MAIL ERROR]", err?.response?.body || err.message)
    return { sent: false, otp: String(otp) }
  }
}
