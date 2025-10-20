// ✅ Gunakan ESM module (bukan require/exports)
import fetch from "node-fetch";

export async function handler(event, context) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY; // bisa anon key, service role, atau sesuai kebutuhan

  try {
    // Ambil semua data dari tabel invoices
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/invoices?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
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
        count: data.length,
        rows: data,
      }),
    };
  } catch (err) {
    console.error("❌ get_invoices error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
      }),
    };
  }
}
