import { createClient } from "@supabase/supabase-js";
import { environment } from "@/config/environment";

export function createAdminClient() {
  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = environment;

  return createClient(SUPABASE_URL!, SUPABASE_SECRET_KEY!);
}
