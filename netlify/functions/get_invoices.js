import fetch from "node-fetch";

export async function handler() {
  const SUPABASE_URL = "https://opfliukxurkarnpotexf.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZmxpdWt4dXJrYXJucG90ZXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDEyMjcsImV4cCI6MjA3NjQ3NzIyN30.QxiTE3F0jwQkV3ASNz5cfMRF__bctpkRYgCWPoeO-Y0";

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/invoices?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Supabase fetch failed: ${txt}`);
    }

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count: data.length,
        rows: data,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error("❌ get_invoices error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
}
