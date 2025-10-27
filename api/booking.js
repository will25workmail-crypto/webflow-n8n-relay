export default async function handler(req, res) {
  const WEBHOOK_URL = "https://ai2325.app.n8n.cloud/webhook/8a493048-7266-49b9-b653-742499a337e5";

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // You can restrict this to your Webflow domain
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { time_slot } = req.body;
    if (!time_slot) {
      return res.status(400).json({ error: "Missing time_slot in request body" });
    }

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time_slot }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: "n8n webhook error", details: text });
    }

    res.status(200).json({ message: `Booking sent for ${time_slot}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
