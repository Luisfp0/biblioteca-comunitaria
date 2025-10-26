"use client";

import Header from "@/components/Header";
import SetupInstrucoes from "@/components/SetupInstrucoes";
import { isSupabaseConfigured, Livro, supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RetirarLivroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [livro, setLivro] = useState<Livro | null>(null);
  const [loading, setLoading] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (id) {
      carregarLivro();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function carregarLivro() {
    try {
      const { data, error} = await supabase
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

  async function confirmarRetirada() {
    setProcessando(true);

    try {
      const response = await fetch("/api/livro/retirar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ livroId: id }),
      });

      if (!response.ok) {
        throw new Error("Erro ao processar retirada");
      }

      setSucesso(true);

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Erro ao confirmar retirada:", error);
      alert("Erro ao confirmar retirada. Tente novamente.");
    } finally {
      setProcessando(false);
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

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Livro Retirado com Sucesso!
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              O livro &ldquo;{livro.titulo}&rdquo; foi marcado como retirado.
            </p>
            <p className="text-gray-500 mb-6">
              Aproveite a leitura! 📚
            </p>
            <p className="text-sm text-gray-400">
              Você será redirecionado em alguns segundos...
            </p>
          </div>
        </main>
      </div>
    );
  }

  const jaRetirado = livro.status === "retirado";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {jaRetirado ? "Livro Já Retirado" : "Confirmar Retirada do Livro"}
          </h1>

          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <div className="relative h-64 w-full bg-gray-200 rounded-lg overflow-hidden">
                {livro.foto_capa_url ? (
                  <Image
                    src={livro.foto_capa_url}
                    alt={`Capa do livro ${livro.titulo}`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {livro.titulo}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-medium">Autor:</span> {livro.autor}
              </p>
              {livro.genero && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Gênero:</span> {livro.genero}
                </p>
              )}
              {livro.ano && (
                <p className="text-gray-600 mb-2">
                  <span className="font-medium">Ano:</span> {livro.ano}
                </p>
              )}
              {livro.descricao && (
                <p className="text-gray-700 mt-4 line-clamp-4">
                  {livro.descricao}
                </p>
              )}
            </div>
          </div>

          {jaRetirado ? (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
              <svg
                className="w-16 h-16 mx-auto text-yellow-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-xl font-bold text-yellow-800 mb-2">
                Este livro já foi retirado
              </h3>
              <p className="text-yellow-700">
                Parece que alguém já pegou este livro antes de você.
              </p>
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Ver outros livros disponíveis
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📚 Quer levar este livro?
                </h3>
                <p className="text-blue-800">
                  Ao confirmar, o livro será marcado como retirado no site.
                  Sinta-se à vontade para levar e aproveitar a leitura!
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={confirmarRetirada}
                  disabled={processando}
                  className="flex-1 bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
                >
                  {processando ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    "✓ Sim, quero levar este livro"
                  )}
                </button>
                <Link
                  href="/"
                  className="px-8 bg-gray-300 text-gray-700 py-4 rounded-lg hover:bg-gray-400 transition-colors font-medium flex items-center justify-center"
                >
                  Cancelar
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
