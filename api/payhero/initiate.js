const PAYHERO_API_URL = "https://backend.payhero.co.ke/api/v2/payments";
const PAYHERO_AUTH_TOKEN = "Basic ckNWSFUwS2tMaG1DdTlDSmFybmo6SzN6NHZGN1NjY2N3Rk1MM2MzcllSekoyd0Fib2FsSHJQbGszWEhWQQ==";
const PAYHERO_CHANNEL_ID = 7916;
const CALLBACK_URL = process.env.PAYHERO_CALLBACK_URL || "https://www.canadavisajobs.site/api/payhero/callback";

// Import paymentStore from callback handler
import { paymentStore } from "./callback.js";

export { paymentStore };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  // GET endpoint to check payment status from callback storage
  if (req.method === "GET") {
    const { checkoutId } = req.query;
    if (!checkoutId) {
      res.status(400).json({ status: "error", message: "Missing checkoutId" });
      return;
    }

    const status = paymentStore.get(checkoutId);
    if (!status) {
      res.status(200).json({ status: 'pending' });
      return;
    }

    res.status(200).json(status);
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const rawPhone = String(body?.phone ?? body?.phone_number ?? "");
    const cleaned = rawPhone.replace(/\D/g, "");
    let normalizedPhone = null;

    if (cleaned.startsWith("0")) normalizedPhone = `254${cleaned.slice(1)}`;
    else if (cleaned.startsWith("254")) normalizedPhone = cleaned;

    if (!normalizedPhone || normalizedPhone.length !== 12) {
      res.status(400).json({ success: false, message: "Invalid phone number format. Use 07XX... or 254..." });
      return;
    }

    const amount = Number(body?.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ success: false, message: "Invalid amount" });
      return;
    }

    const payload = {
      amount: Math.round(amount),
      phone_number: normalizedPhone,
      channel_id: PAYHERO_CHANNEL_ID,
      provider: "m-pesa",
      external_reference: body?.reference ?? `NYT-${Date.now()}`,
      customer_name: body?.customer_name ?? "",
      callback_url: CALLBACK_URL,
    };

    console.log('Sending to PayHero:', payload);

    const payheroRes = await fetch(PAYHERO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": PAYHERO_AUTH_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await payheroRes.text();
    console.log('PayHero raw response:', responseText);
    console.log('PayHero status:', payheroRes.status);
    
    let data = null;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PayHero response as JSON');
    }

    if (!payheroRes.ok || !data) {
      res.status(payheroRes.status || 500).json({
        success: false,
        message: data?.message ?? data?.error ?? `PayHero error: ${payheroRes.status}`,
        raw: responseText,
        status: payheroRes.status,
      });
      return;
    }

    const checkoutId = data?.CheckoutRequestID ?? data?.reference ?? null;

    res.status(200).json({
      success: data?.success === true || String(data?.status ?? "").toLowerCase() === "queued",
      checkoutId,
      reference: data?.reference,
      message: data?.status,
      raw: data,
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
