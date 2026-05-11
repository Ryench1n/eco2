import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface SupabaseProfile {
  id: string;
  email: string | null;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    type?: "user" | "owner";
  };
}

export function mapSupabaseUser(user: SupabaseProfile) {
  return {
    id: user.id,
    email: user.email ?? "",
    name:
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "ECO User",
    avatar: user.user_metadata?.avatar_url ?? undefined,
    type: user.user_metadata?.type === "owner" ? "owner" : "user",
  };
}
