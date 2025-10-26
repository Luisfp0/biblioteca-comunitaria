"use client";

import Filtros from "@/components/Filtros";
import Header from "@/components/Header";
import LivroCard from "@/components/LivroCard";
import SetupInstrucoes from "@/components/SetupInstrucoes";
import { isSupabaseConfigured, Livro, supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Home() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [livrosFiltrados, setLivrosFiltrados] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("");
  const [tagsFiltro, setTagsFiltro] = useState<string[]>([]);
  const [generos, setGeneros] = useState<string[]>([]);
  const [todasTags, setTodasTags] = useState<string[]>([]);

  useEffect(() => {
    carregarLivros();
  }, []);

  useEffect(() => {
    filtrarLivros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livros, busca, generoFiltro, statusFiltro, tagsFiltro]);

  async function carregarLivros() {
    try {
      const { data, error } = await supabase
        .from("livros")
        .select("*")
        .order("data_adicionado", { ascending: false });

      if (error) throw error;

      setLivros(data || []);

      // Extrair gêneros únicos
      const generosUnicos = Array.from(
        new Set(data?.map((livro) => livro.genero).filter(Boolean)),
      ) as string[];
      setGeneros(generosUnicos);

      // Extrair todas as tags únicas
      const tagsUnicas = Array.from(
        new Set(data?.flatMap((livro) => livro.tags || []).filter(Boolean)),
      ) as string[];
      setTodasTags(tagsUnicas);
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      setLoading(false);
    }
  }

  function filtrarLivros() {
    let resultado = [...livros];

    // Filtro de busca
    if (busca) {
      resultado = resultado.filter(
        (livro) =>
          livro.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          livro.autor.toLowerCase().includes(busca.toLowerCase()),
      );
    }

    // Filtro de gênero
    if (generoFiltro) {
      resultado = resultado.filter((livro) => livro.genero === generoFiltro);
    }

    // Filtro de status
    if (statusFiltro) {
      resultado = resultado.filter((livro) => livro.status === statusFiltro);
    }

    // Filtro de tags (livro deve ter TODAS as tags selecionadas)
    if (tagsFiltro.length > 0) {
      resultado = resultado.filter((livro) =>
        tagsFiltro.every((tag) => livro.tags?.includes(tag)),
      );
    }

    setLivrosFiltrados(resultado);
  }

  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    return <SetupInstrucoes />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Livros Disponíveis
          </h2>
          <p className="text-gray-600">
            Explore nossa coleção de livros compartilhados pela comunidade
          </p>
        </div>

        <Filtros
          busca={busca}
          setBusca={setBusca}
          generoFiltro={generoFiltro}
          setGeneroFiltro={setGeneroFiltro}
          statusFiltro={statusFiltro}
          setStatusFiltro={setStatusFiltro}
          tagsFiltro={tagsFiltro}
          setTagsFiltro={setTagsFiltro}
          generos={generos}
          todasTags={todasTags}
        />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : livrosFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Nenhum livro encontrado
            </h3>
            <p className="mt-2 text-gray-500">
              {busca || generoFiltro || statusFiltro
                ? "Tente ajustar os filtros"
                : "Adicione livros no painel admin"}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {livrosFiltrados.length}{" "}
              {livrosFiltrados.length === 1
                ? "livro encontrado"
                : "livros encontrados"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {livrosFiltrados.map((livro) => (
                <LivroCard key={livro.id} livro={livro} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Biblioteca Comunitária - Compartilhando conhecimento
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Pegue um livro, deixe um livro
          </p>
        </div>
      </footer>
    </div>
  );
}
