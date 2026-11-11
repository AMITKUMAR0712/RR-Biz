import nodemailer from "nodemailer";
import type { EnquiryInput } from "@/lib/validators";

export async function sendLeadEmails(enquiry: EnquiryInput): Promise<void> {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    LEAD_NOTIFY_EMAIL,
    RESEND_API_KEY,
  } = process.env;

  const plainText = [
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email || "Not provided"}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Service: ${enquiry.service}`,
    `Preferred contact: ${enquiry.contactMethod}`,
    `Preferred time: ${enquiry.preferredTime || "Not provided"}`,
    `Nationality: ${enquiry.nationality || "Not provided"}`,
    `Service detail: ${enquiry.serviceDetail || "Not provided"}`,
    `Message: ${enquiry.message}`,
    `Source: ${enquiry.source}`,
    `Page: ${enquiry.pagePath || "Not provided"}`,
  ].join("\n");

  const notifyRecipient = LEAD_NOTIFY_EMAIL || "leads@rrbiztech.example";

  // 1. Try Resend if configured
  if (RESEND_API_KEY) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "RRBizTech <onboarding@resend.dev>";
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [notifyRecipient],
          subject: `New enquiry: ${enquiry.service} - ${enquiry.name}`,
          text: plainText,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Resend API notification error:", errorText);
      }

      if (enquiry.email) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [enquiry.email],
            subject: "We received your enquiry | RRBizTech",
            text: `Hello ${enquiry.name},\n\nThank you for contacting RRBizTech regarding ${enquiry.service}. We have received your enquiry and our advisory team will follow up via your preferred contact method (${enquiry.contactMethod}).\n\nNotice: Please do not reply with passport copies, bank statements, or other sensitive documents. Our specialists will guide you securely.\n\nWarm regards,\nRRBizTech Team\nBusiness & Digital Solutions · UAE`,
          }),
        });
      }
      return;
    } catch (err) {
      console.error("Failed to deliver via Resend:", err);
      // Fall through to SMTP or simulation
    }
  }

  // 2. Try SMTP if configured
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    const smtpPort = Number(SMTP_PORT);
    if (Number.isInteger(smtpPort) && smtpPort >= 1 && smtpPort <= 65535) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: SMTP_USER,
        to: notifyRecipient,
        subject: `New website enquiry: ${enquiry.service} - ${enquiry.name}`,
        text: plainText,
      });

      if (enquiry.email) {
        await transporter.sendMail({
          from: SMTP_USER,
          to: enquiry.email,
          subject: "We received your enquiry | RRBizTech",
          text: `Hello ${enquiry.name},\n\nThank you for contacting RRBizTech regarding ${enquiry.service}. We have received your enquiry and our advisory team will follow up via your preferred contact method (${enquiry.contactMethod}).\n\nNotice: Please do not reply with passport copies, bank statements, or other sensitive documents. Our specialists will guide you securely.\n\nWarm regards,\nRRBizTech Team\nBusiness & Digital Solutions · UAE`,
        });
      }
      return;
    }
  }

  // 3. Fallback for development / pre-configuration:
  // Gracefully acknowledge receipt without crashing with 503
  if (process.env.NODE_ENV !== "production") {
    console.info(`[Lead Received - Simulated Delivery]: Enquiry for "${enquiry.service}" from client.`);
  }
}
