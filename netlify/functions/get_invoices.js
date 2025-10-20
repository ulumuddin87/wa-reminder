// netlify/functions/get_invoices.js
import fetch from "node-fetch";

export async function handler(event, context) {
  const SUPABASE_URL = process.env.SUPABASE_URL; // contoh: https://xyzcompany.supabase.co
  const SUPABASE_KEY = process.env.SUPABASE_KEY; // bisa ANON_KEY atau SERVICE_ROLE_KEY

  try {
    // Ambil semua data dari tabel invoices
    const response = await fetch(`${SUPABASE_URL}/rest/v1/invoices?select=*`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase error: ${errText}`);
    }

    const rows = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count: rows.length,
        rows: rows,
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
