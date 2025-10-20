import fetch from "node-fetch";

export async function handler(event, context) {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM;

  try {
    const { to, message } = JSON.parse(event.body);

    if (!to || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing 'to' or 'message' field" }),
      };
    }

    // Kirim via Twilio WhatsApp API
    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
        To: `whatsapp:${to}`,
        Body: message,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(`Twilio error: ${JSON.stringify(data)}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sid: data.sid }),
    };
  } catch (err) {
    console.error("❌ send_whatsapp error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
