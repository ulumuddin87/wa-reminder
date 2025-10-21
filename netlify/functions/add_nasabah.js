// netlify/functions/add_nasabah.js
import fetch from "node-fetch";

export async function handler(event, context) {
  const SUPABASE_URL = "https://opfliukxurkarnpotexf.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZmxpdWt4dXJrYXJucG90ZXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDEyMjcsImV4cCI6MjA3NjQ3NzIyN30.QxiTE3F0jwQkV3ASNz5cfMRF__bctpkRYgCWPoeO-Y0";

  try {
    const payload = JSON.parse(event.body);
    const rows = Array.isArray(payload) ? payload : [payload];

    const inserts = rows.map((r) => ({
      name: r.name || "",
      phone: r.phone || "",
      due_date: r.due_date || "",
      amount: r.amount || 0,
      message: r.message || "",
      status: r.status || "pending",
    }));

    const resp = await fetch(`${SUPABASE_URL}/rest/v1/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(inserts),
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
        rows: data,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (err) {
    console.error("❌ add_nasabah error:", err);
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
