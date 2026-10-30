import { createClient as createSupabaseClient } from "@supabase/supabase-js";

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

export const createClient = createServerClient;
export default createServerClient;

