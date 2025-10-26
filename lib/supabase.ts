import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== "" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== ""
  );
};

export type Livro = {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  ano: number;
  genero: string;
  tags: string[];
  foto_capa_url: string;
  status: "disponivel" | "retirado";
  data_adicionado: string;
  created_at: string;
};

export type Favorito = {
  id: string;
  livro_id: string;
  ip_address: string;
  created_at: string;
};
