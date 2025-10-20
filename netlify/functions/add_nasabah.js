// ✅ Gunakan ESM format (bukan require/exports)
import fetch from "node-fetch";

export async function handler(event, context) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  try {
    // Ambil body request
    const payload = JSON.parse(event.body);

    // Jika array → bulk insert
    const rows = Array.isArray(payload) ? payload : [payload];

    // Normalisasi data
    const inserts = rows.map(r => ({
      name: r.name,
      phone: r.phone,
      due_date: r.due_date,
      amount: r.amount || 0,
      message: r.message || "",
      status: r.status || "pending"
    }));

    // Kirim ke tabel "invoices" di Supabase
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(inserts)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Supabase error: ${errText}`);
    }

    const data = await resp.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        inserted: data.length,
        rows: data
      })
    };

  } catch (err) {
    console.error("❌ add_nasabah error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message
      })
    };
  }
}
