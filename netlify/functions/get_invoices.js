// netlify/functions/get_invoices.js
import fetch from "node-fetch";

export async function handler(event, context) {
  // Hardcode Supabase URL dan ANON_KEY
  const SUPABASE_URL = "https://opfliukxurkarnpotexf.supabase.co";
  const SUPABASE_KEY = "PASTE_ANeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZmxpdWt4dXJrYXJucG90ZXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDEyMjcsImV4cCI6MjA3NjQ3NzIyN30.QxiTE3F0jwQkV3ASNz5cfMRF__bctpkRYgCWPoeO-Y0ON_KEY_DI_SINI"; // Ganti dengan ANON_KEY Supabase-mu

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
