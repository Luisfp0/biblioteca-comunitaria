"use client";

import Header from "@/components/Header";
import Input from "@/components/Input";
import { getColorForTag } from "@/components/LivroCard";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import Select from "@/components/Select";
import SetupInstrucoes from "@/components/SetupInstrucoes";
import TagSelector from "@/components/TagSelector";
import TextArea from "@/components/TextArea";
import UploadFoto from "@/components/UploadFoto";
import { isSupabaseConfigured, Livro, supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Admin() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [livros, setLivros] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [qrCodeLivro, setQrCodeLivro] = useState<Livro | null>(null);

  // Formulário de novo livro
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    descricao: "",
    ano: "",
    genero: "",
    tags: [] as string[],
    foto_capa_url: "",
    status: "disponivel" as "disponivel" | "retirado",
  });

  // Formulário de edição
  const [livroEditando, setLivroEditando] = useState({
    titulo: "",
    autor: "",
    descricao: "",
    ano: "",
    genero: "",
    tags: [] as string[],
    foto_capa_url: "",
    status: "disponivel" as "disponivel" | "retirado",
  });

  useEffect(() => {
    const senhaAdmin = localStorage.getItem("admin_auth");
    if (
      senhaAdmin === process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      senhaAdmin === "admin123"
    ) {
      setAutenticado(true);
      carregarLivros();
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (
      senha === process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      senha === "admin123"
    ) {
      localStorage.setItem("admin_auth", senha);
      setAutenticado(true);
      carregarLivros();
      setErro("");
    } else {
      setErro("Senha incorreta");
    }
  }

  async function carregarLivros() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("livros")
        .select("*")
        .order("data_adicionado", { ascending: false });

      if (error) throw error;
      setLivros(data || []);
      console.log({data})
    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      setLoading(false);
    }
  }

  async function adicionarLivro(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("livros").insert([
        {
          ...novoLivro,
          ano: novoLivro.ano ? parseInt(novoLivro.ano) : null,
        },
      ]);

      if (error) throw error;

      // Resetar formulário
      setNovoLivro({
        titulo: "",
        autor: "",
        descricao: "",
        ano: "",
        genero: "",
        tags: [],
        foto_capa_url: "",
        status: "disponivel",
      });

      await carregarLivros();
      alert("Livro adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar livro:", error);
      alert("Erro ao adicionar livro");
    } finally {
      setLoading(false);
    }
  }

  async function atualizarStatus(
    id: string,
    novoStatus: "disponivel" | "retirado",
  ) {
    try {
      const { error } = await supabase
        .from("livros")
        .update({ status: novoStatus })
        .eq("id", id);

      if (error) throw error;
      await carregarLivros();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status");
    }
  }

  async function deletarLivro(id: string) {
    if (!confirm("Tem certeza que deseja deletar este livro?")) return;

    try {
      const { error } = await supabase.from("livros").delete().eq("id", id);

      if (error) throw error;
      await carregarLivros();
    } catch (error) {
      console.error("Erro ao deletar livro:", error);
      alert("Erro ao deletar livro");
    }
  }

  function abrirEdicao(livro: Livro) {
    setEditando(livro.id);
    console.log({livro})
    setLivroEditando({
      titulo: livro.titulo,
      autor: livro.autor,
      descricao: livro.descricao || "",
      ano: livro.ano ? livro.ano.toString() : "",
      genero: livro.genero || "",
      tags: livro.tags || [],
      foto_capa_url: livro.foto_capa_url || "",
      status: livro.status,
    });
  }

  async function salvarEdicao() {
    if (!editando) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("livros")
        .update({
          ...livroEditando,
          ano: livroEditando.ano ? parseInt(livroEditando.ano) : null,
        })
        .eq("id", editando);

      if (error) throw error;

      setEditando(null);
      await carregarLivros();
      alert("Livro atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar livro:", error);
      alert("Erro ao atualizar livro");
    } finally {
      setLoading(false);
    }
  }

  // Verificar se o Supabase está configurado
  if (!isSupabaseConfigured()) {
    return <SetupInstrucoes />;
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Painel Admin
            </h2>
            <form onSubmit={handleLogin}>
              <Input
                label="Senha"
                type="password"
                id="senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                error={erro}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6 font-medium"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Painel Admin</h2>
          <button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              setAutenticado(false);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Formulário de adicionar livro */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Adicionar Novo Livro
          </h3>
          <form
            onSubmit={adicionarLivro}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Input
              label="Título *"
              type="text"
              value={novoLivro.titulo}
              onChange={(e) =>
                setNovoLivro({ ...novoLivro, titulo: e.target.value })
              }
              required
            />

            <Input
              label="Autor *"
              type="text"
              value={novoLivro.autor}
              onChange={(e) =>
                setNovoLivro({ ...novoLivro, autor: e.target.value })
              }
              required
            />

            <Input
              label="Gênero"
              type="text"
              value={novoLivro.genero}
              onChange={(e) =>
                setNovoLivro({ ...novoLivro, genero: e.target.value })
              }
            />

            <Input
              label="Ano"
              type="number"
              value={novoLivro.ano}
              onChange={(e) =>
                setNovoLivro({ ...novoLivro, ano: e.target.value })
              }
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <TagSelector
                value={novoLivro.tags}
                onChange={(tags) => setNovoLivro({ ...novoLivro, tags })}
              />
            </div>

            <div className="md:col-span-2">
              <UploadFoto
                urlAtual={novoLivro.foto_capa_url}
                onUploadComplete={(url) =>
                  setNovoLivro({ ...novoLivro, foto_capa_url: url })
                }
              />
            </div>

            <div className="md:col-span-2">
              <TextArea
                label="Descrição"
                value={novoLivro.descricao}
                onChange={(e) =>
                  setNovoLivro({ ...novoLivro, descricao: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Adicionando..." : "Adicionar Livro"}
              </button>
            </div>
          </form>
        </div>

        {/* Lista de livros */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Livros Cadastrados ({livros.length})
          </h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Título
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Autor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Gênero
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tags
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      QR Retirada
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {livros.map((livro) => (
                    <tr key={livro.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {livro.titulo}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {livro.autor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {livro.genero || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {livro.tags && livro.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {livro.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getColorForTag(
                                    tag,
                                  )}`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select
                          value={livro.status}
                          onChange={(e) =>
                            atualizarStatus(
                              livro.id,
                              e.target.value as "disponivel" | "retirado",
                            )
                          }
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            livro.status === "disponivel"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <option value="disponivel">Disponível</option>
                          <option value="retirado">Retirado</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setQrCodeLivro(livro)}
                          className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1 text-xs font-medium"
                          title="Ver QR Code de Retirada"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                            />
                          </svg>
                          QR
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => abrirEdicao(livro)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deletarLivro(livro.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Deletar"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Edição */}
        {editando && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border-2 border-gray-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Editar Livro
                  </h3>
                  <button
                    onClick={() => setEditando(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Título *"
                    type="text"
                    value={livroEditando.titulo}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        titulo: e.target.value,
                      })
                    }
                    required
                  />

                  <Input
                    label="Autor *"
                    type="text"
                    value={livroEditando.autor}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        autor: e.target.value,
                      })
                    }
                    required
                  />

                  <Input
                    label="Gênero"
                    type="text"
                    value={livroEditando.genero}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        genero: e.target.value,
                      })
                    }
                  />

                  <Input
                    label="Ano"
                    type="number"
                    value={livroEditando.ano}
                    onChange={(e) =>
                      setLivroEditando({
                        ...livroEditando,
                        ano: e.target.value,
                      })
                    }
                  />

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <TagSelector
                      value={livroEditando.tags}
                      onChange={(tags) =>
                        setLivroEditando({ ...livroEditando, tags })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <UploadFoto
                      urlAtual={livroEditando.foto_capa_url}
                      onUploadComplete={(url) =>
                        setLivroEditando({
                          ...livroEditando,
                          foto_capa_url: url,
                        })
                      }
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TextArea
                      label="Descrição"
                      value={livroEditando.descricao}
                      onChange={(e) =>
                        setLivroEditando({
                          ...livroEditando,
                          descricao: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Select
                      label="Status"
                      value={livroEditando.status}
                      onChange={(e) =>
                        setLivroEditando({
                          ...livroEditando,
                          status: e.target.value as "disponivel" | "retirado",
                        })
                      }
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="retirado">Retirado</option>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={salvarEdicao}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                  <button
                    onClick={() => setEditando(null)}
                    className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de QR Code para Retirada */}
        {qrCodeLivro && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    QR Code de Retirada
                  </h3>
                  <button
                    onClick={() => setQrCodeLivro(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">
                    {qrCodeLivro.titulo}
                  </h4>
                  <p className="text-gray-600">por: {qrCodeLivro.autor}</p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-900 text-center">
                    <strong>📱 Como usar:</strong> Imprima este QR Code e cole
                    no livro. Quando alguém escanear, o livro será
                    automaticamente marcado como retirado.
                  </p>
                </div>

                <div className="flex justify-center mb-6">
                  <QRCodeGenerator
                    url={`${typeof window !== "undefined" ? window.location.origin : ""}/retirar/${qrCodeLivro.id}`}
                    size={300}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Imprimir
                  </button>
                  <button
                    onClick={() => setQrCodeLivro(null)}
                    className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
