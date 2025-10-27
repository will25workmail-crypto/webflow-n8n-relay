export default async function handler(req, res) {
  // Allow requests from your Webflow site
  res.setHeader("Access-Control-Allow-Origin", "https://leadscheduler.webflow.io"); // replace with your actual Webflow domain
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end(); // handle preflight

  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const data = await req.json();
    console.log("📩 Received booking:", data);

    // Forward to n8n
    const n8nResponse = await fetch(
      "https://ai2325.app.n8n.cloud/webhook/8a493048-7266-49b9-b653-742499a337e5",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const n8nResult = await n8nResponse.text();
    console.log("✅ n8n response:", n8nResult);

    return res.status(200).json({ success: true, forwarded: true, n8nResult });
  } catch (err) {
    console.error("❌ Relay error:", err);
    return res.status(500).json({ error: "Relay failed", details: err.message });
  }
}
