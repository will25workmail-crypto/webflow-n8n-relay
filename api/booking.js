export default async function handler(req, res) {
// Only accept POST requests
if (req.method !== "POST") {
return res.status(405).json({ error: "Method Not Allowed" });
}

try {
const data = await req.json?.() || await new Response(req.body).json();
console.log("📩 Received booking:", data);

```
// Forward the data to your n8n webhook
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
```

} catch (err) {
console.error("❌ Relay error:", err);
return res.status(500).json({ error: "Relay failed", details: err.message });
}
}
