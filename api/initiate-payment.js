import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.APP_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for the Applications DB (or APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY).');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getApplicationsSupabaseClient() {
  if (process.env.APP_SUPABASE_URL && process.env.APP_SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(process.env.APP_SUPABASE_URL, process.env.APP_SUPABASE_SERVICE_ROLE_KEY);
  }
  return supabase;
}

// PayHero Configuration (HARDCODED FOR TESTING)
const PAYHERO_API_URL = 'https://backend.payhero.co.ke/api/v2/payments';
const PAYHERO_AUTH_TOKEN = 'Basic ckNWSFUwS2tMaG1DdTlDSmFybmo6SzN6NHZGN1NjY2N3Rk1MM2MzcllSekoyd0Fib2FsSHJQbGszWEhWQQ==';
const PAYHERO_CHANNEL_ID = 7916;
const PAYHERO_CALLBACK_URL = 'https://www.canadavisajobs.site/api/payhero/callback';

// Normalize phone number to 254 format
function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    if (!req.body) {
      console.error('Request body is missing or empty');
      return res.status(400).json({ success: false, message: 'Request body is missing or invalid' });
    }
    let {
      phoneNumber,
      amount = 250,
      description = 'Account Verification Fee',
      applicationId,
      interviewBookingId,
      purpose,
      userId,
      interviewCompany,
      interviewPosition,
      interviewType,
      interviewAt,
      interviewStatus,
    } = req.body;

    // TESTING: Hardcode amount to 10 KES
    amount = 10;

    console.log('Parsed request:', { phoneNumber, amount, description });

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX' });
    }

    const externalReference = req.body?.reference || `CANADAADS-${Date.now()}`;

    const payheroPayload = {
      amount: Math.round(Number(amount)),
      phone_number: normalizedPhone,
      channel_id: PAYHERO_CHANNEL_ID,
      provider: 'm-pesa',
      external_reference: externalReference,
      customer_name: req.body?.customer_name || '',
      callback_url: PAYHERO_CALLBACK_URL || undefined,
    };

    // Remove undefined callback_url if not set
    if (!payheroPayload.callback_url) {
      delete payheroPayload.callback_url;
    }

    console.log('Making API request to PayHero');

    const response = await fetch(PAYHERO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': PAYHERO_AUTH_TOKEN,
      },
      body: JSON.stringify(payheroPayload),
    });

    const responseText = await response.text();
    console.log('PayHero response status:', response.status);
    console.log('PayHero response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse PayHero response:', responseText);
      return res.status(502).json({
        success: false,
        message: 'Invalid response from payment service'
      });
    }

    if (response.ok && (data.success === true || String(data?.status ?? '').toLowerCase() === 'queued')) {
      const checkoutId = data?.CheckoutRequestID || data?.reference || data?.data?.checkout_id || data?.data?.request_id || externalReference;
      
      try {
        const appSupabase = getApplicationsSupabaseClient();

        const safeUserId = isUuid(userId) ? userId : null;
        let safeApplicationId = isUuid(applicationId) ? applicationId : null;
        let safeInterviewBookingId = isUuid(interviewBookingId) ? interviewBookingId : null;

        if (!safeInterviewBookingId && (purpose === 'interview_booking' || interviewCompany || interviewPosition)) {
          console.log('Attempting to create interview booking:', { interviewCompany, interviewPosition, interviewType, interviewAt, interviewStatus });

          if (!interviewAt) {
            console.error('interview_bookings insert error: interview_at is required for interview bookings');
          } else {
            try {
              const insertBooking = async (userIdToInsert) => {
                return await appSupabase
                  .from('interview_bookings')
                  .insert({
                    user_id: userIdToInsert,
                    company: interviewCompany || null,
                    position: interviewPosition || null,
                    interview_type: interviewType || 'video',
                    interview_at: interviewAt,
                    status: interviewStatus || 'pending',
                  })
                  .select('id')
                  .single();
              };

              let { data: createdBooking, error: bookingInsertError } = await insertBooking(safeUserId);

              if (bookingInsertError && bookingInsertError.code === '23503' && safeUserId) {
                console.warn('interview_bookings insert FK violation for user_id; retrying with null user_id');
                ({ data: createdBooking, error: bookingInsertError } = await insertBooking(null));
              }

              if (bookingInsertError) {
                console.error('interview_bookings insert error:', bookingInsertError);
              } else if (createdBooking?.id) {
                console.log('Interview booking created successfully:', createdBooking.id);
                safeInterviewBookingId = createdBooking.id;
              } else {
                console.error('interview_bookings insert: no data returned');
              }
            } catch (bookingErr) {
              console.error('Error creating interview booking:', bookingErr);
            }
          }
        }

        const inferredPurpose = purpose || (safeApplicationId ? 'application' : safeInterviewBookingId ? 'interview_booking' : 'unknown');
        console.log('Inserting payment attempt:', {
          user_id: safeUserId,
          application_id: safeApplicationId,
          interview_booking_id: safeInterviewBookingId,
          purpose: inferredPurpose,
          checkout_request_id: checkoutId,
          phone_number: normalizedPhone,
          amount: parseFloat(amount),
          status: 'pending',
        });

        const { error: dbError } = await appSupabase
          .from('payment_attempts')
          .insert({
            user_id: safeUserId,
            application_id: safeApplicationId,
            interview_booking_id: safeInterviewBookingId,
            purpose: inferredPurpose,
            checkout_request_id: checkoutId,
            phone_number: normalizedPhone,
            amount: parseFloat(amount),
            status: 'pending',
          });

        if (dbError) {
          console.error('Database insert error:', dbError);
        } else {
          console.log('Payment attempt stored in database:', checkoutId);
        }
      } catch (dbErr) {
        console.error('Database error:', dbErr);
      }

      return res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          requestId: checkoutId,
          checkoutRequestId: checkoutId,
          transactionRequestId: checkoutId
        }
      });
    } else {
      console.error('PayHero error:', data);
      return res.status(400).json({
        success: false,
        message: data?.message || data?.error || 'Payment initiation failed',
        error: data,
        raw: responseText,
        status: response.status,
      });
    }
  } catch (error) {
    console.error('Global error in initiate-payment:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred',
      error: error.message || String(error)
    });
  }
};
