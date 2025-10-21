// netlify/functions/send_whatsapp.js
import fetch from "node-fetch";

export async function handler(event, context) {
  // 🔹 Isi langsung di sini jika belum pakai environment variable di Netlify
  const TWILIO_ACCOUNT_SID = "ISI_DENGAN_ACCOUNT_SID_TWILIO_KAMU";
  const TWILIO_AUTH_TOKEN = "ISI_DENGAN_AUTH_TOKEN_TWILIO_KAMU";
  const TWILIO_WHATSAPP_FROM = "YOUR_TWILIO_WHATSAPP_NUMBER"; // contoh: "whatsapp:+14155238886"

  try {
    const { to, message } = JSON.parse(event.body || "{}");

    if (!to || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing 'to' or 'message' field",
        }),
        headers: { "Access-Control-Allow-Origin": "*" },
      };
    }

    // Kirim pesan melalui Twilio API
    const resp = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString(
              "base64"
            ),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
          To: `whatsapp:${to}`,
          Body: message,
        }),
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(`Twilio error: ${JSON.stringify(data)}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        sid: data.sid,
        message: "Pesan WhatsApp berhasil dikirim via Twilio ✅",
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (err) {
    console.error("❌ send_whatsapp error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }
}
