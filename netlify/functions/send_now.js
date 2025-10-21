import fetch from "node-fetch";

export async function handler(event, context) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  // URL Netlify kamu
  const BASE_URL = "https://resplendent-crumble-f9076b.netlify.app";

  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing invoice ID" }),
      };
    }

    // ✅ Ambil data invoice dari Supabase
    const getResp = await fetch(`${SUPABASE_URL}/rest/v1/invoices?id=eq.${id}&select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const invoices = await getResp.json();
    const invoice = invoices[0];

    if (!invoice) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Invoice not found" }),
      };
    }

    // ✅ Kirim pesan WA via function send_whatsapp
    const messageText = `Halo ${invoice.name}, tagihan Anda sebesar Rp${Number(
      invoice.amount
    ).toLocaleString("id-ID")} jatuh tempo pada ${invoice.due_date}.`;

    const waResp = await fetch(`${BASE_URL}/.netlify/functions/send_whatsapp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: invoice.phone,
        message: messageText,
      }),
    });

    const waResult = await waResp.json();

    if (!waResp.ok) {
      throw new Error(waResult.error || "Gagal kirim WhatsApp");
    }

    // ✅ Update status jadi "sent" di Supabase
    await fetch(`${SUPABASE_URL}/rest/v1/invoices?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "sent" }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "WhatsApp sent and invoice status updated",
        sid: waResult.sid,
      }),
    };
  } catch (err) {
    console.error("❌ send_now error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
}
