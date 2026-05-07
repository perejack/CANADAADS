// PayHero Callback Handler for NYOTA Seba
// This endpoint receives payment confirmations from PayHero

// Simple in-memory storage for payment status (resets on server restart)
const paymentStore = new Map();

// Export for use by status endpoint
export { paymentStore };

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method === "GET") {
    // Status check endpoint
    const { checkoutId } = req.query;
    if (!checkoutId) {
      return res.status(400).json({ message: "checkoutId required" });
    }
    
    const status = paymentStore.get(checkoutId);
    if (!status) {
      return res.status(200).json({ status: 'pending' });
    }
    
    return res.status(200).json(status);
  }

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { status, response } = req.body;
    
    console.log('PayHero callback received:', { status, response });

    // Extract response data
    const {
      CheckoutRequestID,
      ResultCode,
      MpesaReceiptNumber,
      Phone,
      Amount,
      Status,
      ResultDesc,
      ExternalReference
    } = response || {};

    // Determine if payment was successful
    const isSuccess = ResultCode === 0 && Status?.toLowerCase() === 'success';
    
    // Store payment status
    const checkoutId = CheckoutRequestID || ExternalReference;
    if (checkoutId) {
      paymentStore.set(checkoutId, {
        status: isSuccess ? 'completed' : 'failed',
        mpesaReceipt: MpesaReceiptNumber,
        resultCode: ResultCode,
        resultDesc: ResultDesc,
        phone: Phone,
        amount: Amount,
        timestamp: new Date().toISOString()
      });
      console.log('Payment status stored:', checkoutId, isSuccess ? 'completed' : 'failed');
    }
    
    console.log('Payment status:', { isSuccess, CheckoutRequestID, ResultCode, Status });

    // Return success response to PayHero
    return res.status(200).json({ 
      success: true, 
      message: 'Callback received',
      paymentStatus: isSuccess ? 'completed' : 'failed'
    });

  } catch (error) {
    console.error('Callback error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
}
