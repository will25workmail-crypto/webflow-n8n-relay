export default async function handler(req, res) {
  const WEBHOOK_URL = "https://ai2325.app.n8n.cloud/webhook/8a493048-7266-49b9-b653-742499a337e5";

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { time_slot } = req.body;
    if (!time_slot) {
      return res.status(400).json({ error: "Missing time_slot in request body" });
    }

    console.log("Sending to n8n:", { time_slot });

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time_slot }),
    });

    const text = await response.text();
    console.log("n8n response:", text);

    res.status(200).json({ message: `Booking sent for ${time_slot}`, n8nResponse: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
