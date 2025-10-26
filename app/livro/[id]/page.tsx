"use client";

import Header from "@/components/Header";
import SetupInstrucoes from "@/components/SetupInstrucoes";
import { isSupabaseConfigured, Livro, supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const TAG_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-300",
  "bg-green-100 text-green-800 border-green-300",
  "bg-purple-100 text-purple-800 border-purple-300",
  "bg-pink-100 text-pink-800 border-pink-300",
  "bg-yellow-100 text-yellow-800 border-yellow-300",
  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "bg-red-100 text-red-800 border-red-300",
  "bg-orange-100 text-orange-800 border-orange-300",
];

function getColorForTag(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function LivroPage() {
  const params = useParams();
  const id = params.id as string;

  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarLivro();
      verificarFavorito();
      carregarFavoritoCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarLivro() {
    try {
      const { data, error } = await supabase
        .from("livros")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setLivro(data);
    } catch (error) {
      console.error("Erro ao carregar livro:", error);
    } finally {
      setLoading(false);
    }
  }

  async function verificarFavorito() {
    try {
      const ipAddress = await obterIP();
      const {error } = await supabase
        .from("favoritos")
        .select("id")
        .eq("livro_id", id)
        .eq("ip_address", ipAddress)
        .single();

      if (error && error.code !== "PGRST116") throw error;
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  }

  async function carregarFavoritoCount() {
    try {
      const {error } = await supabase
        .from("favoritos")
        .select("*", { count: "exact", head: true })
        .eq("livro_id", id);

      if (error) throw error;
    } catch (error) {
      console.error("Erro ao carregar contagem de favoritos:", error);
    }
  }

  async function obterIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return "unknown";
    }
  }

  if (!isSupabaseConfigured()) {
    return <SetupInstrucoes />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!livro) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Livro não encontrado
            </h2>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Voltar para a página inicial
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isRetirado = livro.status === "retirado";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Imagem do livro */}
            <div className="relative">
              <div className="relative h-96 w-full bg-gray-200 rounded-lg overflow-hidden">
                {livro.foto_capa_url ? (
                  <Image
                    src={livro.foto_capa_url}
                    alt={`Capa do livro ${livro.titulo}`}
                    fill
                    className={`object-contain ${isRetirado ? "opacity-40" : ""}`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-24 h-24"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                )}

                {isRetirado && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold shadow-xl transform -rotate-12 text-2xl">
                      RETIRADO
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do livro */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {livro.titulo}
                </h1>
                <span
                  className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${
                    livro.status === "disponivel"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {livro.status === "disponivel" ? "Disponível" : "Retirado"}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase">
                    Autor
                  </h3>
                  <p className="text-lg text-gray-900">{livro.autor}</p>
                </div>

                {livro.genero && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase">
                      Gênero
                    </h3>
                    <p className="text-lg text-gray-900">{livro.genero}</p>
                  </div>
                )}

                {livro.ano && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase">
                      Ano de Publicação
                    </h3>
                    <p className="text-lg text-gray-900">{livro.ano}</p>
                  </div>
                )}

                {livro.tags && livro.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {livro.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getColorForTag(
                            tag,
                          )}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {livro.descricao && (
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
                    Descrição
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {livro.descricao}
                  </p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200 mt-6">
                <p className="text-sm text-gray-500">
                  Adicionado em{" "}
                  {new Date(livro.data_adicionado).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
