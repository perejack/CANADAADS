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
const PAYHERO_AUTH_TOKEN = 'Basic UXczMkpRa1h5YTJZQWxJMUZNSFk6VlJPZlo3NzJVMFZMNnB1REZqOGRkTmlvdnd2NnpuOVdrZTRwdVhHSQ==';

// Query payment status via PayHero callback/status endpoint
async function queryPayHeroPaymentStatus(checkoutId) {
  try {
    console.log(`Querying PayHero status for ${checkoutId}`);

    // Try the callback/status endpoint first (if hosted on same domain)
    const callbackUrl = 'https://www.canadavisajobs.site/api/payhero/callback';
    const baseUrl = callbackUrl.replace('/api/payhero/callback', '');
    if (baseUrl) {
      try {
        const response = await fetch(`${baseUrl}/api/payhero/callback?checkoutId=${encodeURIComponent(checkoutId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('PayHero callback status response:', JSON.stringify(data, null, 2));
          if (data && data.status && data.status !== 'pending') {
            return data;
          }
        }
      } catch (e) {
        console.log('Local PayHero status endpoint not available, falling back to Supabase only');
      }
    }

    return null;
  } catch (error) {
    console.error('Error querying PayHero status:', error.message);
    return null;
  }
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }
    
    console.log('Checking status for reference:', reference);

    const appSupabase = getApplicationsSupabaseClient();
    
    const { data: attempt, error: dbError } = await appSupabase
      .from('payment_attempts')
      .select('*')
      .eq('checkout_request_id', reference)
      .maybeSingle();
    
    if (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error checking payment status',
        error: dbError.message || String(dbError)
      });
    }
    
    if (attempt) {
      console.log(`Payment status found for ${reference}:`, attempt);
      
      let paymentStatus = 'PENDING';
      if (attempt.status === 'success') {
        paymentStatus = 'SUCCESS';
      } else if (attempt.status === 'failed' || attempt.status === 'cancelled') {
        paymentStatus = 'FAILED';
      }
      
      // If status is still pending, query PayHero status
      if (paymentStatus === 'PENDING') {
        console.log(`Status is pending, querying PayHero for ${attempt.checkout_request_id}`);
        try {
          const payheroResponse = await queryPayHeroPaymentStatus(attempt.checkout_request_id);

          if (payheroResponse && payheroResponse.status === 'completed') {
            console.log(`PayHero confirmed payment success for ${attempt.checkout_request_id}, updating database`);

            const { error: updateError } = await appSupabase
              .from('payment_attempts')
              .update({ status: 'success' })
              .eq('checkout_request_id', attempt.checkout_request_id);

            if (updateError) {
              console.error('Error updating transaction:', updateError);
            } else {
              paymentStatus = 'SUCCESS';
            }
          } else if (payheroResponse && payheroResponse.status === 'failed') {
            await appSupabase
              .from('payment_attempts')
              .update({ status: 'failed' })
              .eq('checkout_request_id', attempt.checkout_request_id);
            paymentStatus = 'FAILED';
            console.log(`PayHero confirmed payment failed for ${attempt.checkout_request_id}`);
          } else if (payheroResponse && payheroResponse.status === 'cancelled') {
            await appSupabase
              .from('payment_attempts')
              .update({ status: 'cancelled' })
              .eq('checkout_request_id', attempt.checkout_request_id);
            paymentStatus = 'FAILED';
          }
        } catch (payheroError) {
          console.error('Error querying PayHero status:', payheroError);
          // Continue with local status if PayHero query fails
        }
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          status: paymentStatus,
          amount: attempt.amount,
          phoneNumber: attempt.phone_number,
          timestamp: attempt.updated_at
        }
      });
    } else {
      console.log(`Payment status not found for ${reference}, still pending`);
      
      return res.status(200).json({
        success: true,
        payment: {
          status: 'PENDING',
          message: 'Payment is still being processed'
        }
      });
    }
  } catch (error) {
    console.error('Payment status check error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message || String(error)
    });
  }
};
