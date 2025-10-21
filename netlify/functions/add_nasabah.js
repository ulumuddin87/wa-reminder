const fetch = require("node-fetch");

exports.handler = async function (event) {
  const SUPABASE_URL = "https://opfliukxurkarnpotexf.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZmxpdWt4dXJrYXJucG90ZXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MDEyMjcsImV4cCI6MjA3NjQ3NzIyN30.QxiTE3F0jwQkV3ASNz5cfMRF__bctpkRYgCWPoeO-Y0";

  try {
    if (!event.body) throw new Error("Request body kosong!");
    const payload = JSON.parse(event.body);

    const data = Array.isArray(payload) ? payload : [payload];

    const res = await fetch(`${SUPABASE_URL}/rest/v1/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Supabase insert failed: ${errText}`);
    }

    const result = await res.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("❌ add_nasabah error:", err.message);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
