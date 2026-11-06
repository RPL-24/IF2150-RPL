import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Mengambil konfigurasi dari Supabase Function Secrets
const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim();
const publishableKey = Deno.env.get('PROSS_PUBLISHABLE_KEY')?.trim();
const secretKey = Deno.env.get('PROSS_SECRET_KEY')?.trim();

// Memeriksa ketersediaan environment variables
console.log('Supabase environment check:', {
  hasUrl: Boolean(supabaseUrl),
  hasPublishableKey: Boolean(publishableKey),
  hasSecretKey: Boolean(secretKey),
});

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is missing');
}

if (!publishableKey) {
  throw new Error('PROSS_PUBLISHABLE_KEY is missing');
}

if (!secretKey) {
  throw new Error('PROSS_SECRET_KEY is missing');
}

const adminClient = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const authClient = createClient(supabaseUrl, publishableKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse(
      {
        ok: false,
        code: 'METHOD_NOT_ALLOWED',
      },
      405
    );
  }

  try {
    const body = await req.json();

    const username = String(body?.username ?? '')
      .trim()
      .toLowerCase();

    const password = String(body?.password ?? '');

    if (!username || !password) {
      return jsonResponse({
        ok: false,
        code: 'INVALID_INPUT',
      });
    }

    console.log('Login request received');

    const {
      data: profile,
      error: lookupError,
    } = await adminClient
      .from('tbl_pemilik_usaha')
      .select('email')
      .eq('username', username)
      .maybeSingle();

    if (lookupError) {
      console.error('Username lookup failed:', {
        code: lookupError.code,
        message: lookupError.message,
        details: lookupError.details,
        hint: lookupError.hint,
      });

      return jsonResponse(
        {
          ok: false,
          code: 'SERVER_ERROR',
        },
        500
      );
    }

    console.log('Username lookup result:', {
      found: Boolean(profile),
    });

    if (!profile) {
      return jsonResponse({
        ok: false,
        code: 'ACCOUNT_NOT_FOUND',
      });
    }

    const {
      data,
      error: authError,
    } = await authClient.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (authError || !data.session) {
      console.error('Authentication failed:', {
        message: authError?.message,
        status: authError?.status,
        hasSession: Boolean(data.session),
      });

      return jsonResponse({
        ok: false,
        code: 'INVALID_CREDENTIALS',
      });
    }

    console.log('Authentication successful');

    return jsonResponse({
      ok: true,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

  } catch (error) {
    console.error('Login function exception:', error);

    return jsonResponse(
      {
        ok: false,
        code: 'SERVER_ERROR',
      },
      500
    );
  }
});
