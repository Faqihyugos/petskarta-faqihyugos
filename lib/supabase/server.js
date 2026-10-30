import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi Supabase untuk server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (Server Component) di sisi server.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY harus diatur di environment variable."
    );
  }

  return createSupabaseClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Membuat koneksi Supabase Auth untuk server menggunakan @supabase/ssr dan cookies.
 * Menggunakan SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.
 * Digunakan untuk autentikasi admin, sesi login, logout, dan Server Actions.
 */
export async function createAuthServerClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY harus diatur di environment variable."
    );
  }

  return createSSRClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dapat diabaikan jika dipanggil dari Server Component
        }
      },
    },
  });
}

export const createClient = createServerClient;
export default createServerClient;
