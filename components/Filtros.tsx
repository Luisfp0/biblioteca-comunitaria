"use client";

import Input from "./Input";
import Select from "./Select";

interface FiltrosProps {
  busca: string;
  setBusca: (busca: string) => void;
  generoFiltro: string;
  setGeneroFiltro: (genero: string) => void;
  statusFiltro: string;
  setStatusFiltro: (status: string) => void;
  tagsFiltro: string[];
  setTagsFiltro: (tags: string[]) => void;
  generos: string[];
  todasTags: string[];
}

const TAG_COLORS = [
  "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  "bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200",
  "bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200",
  "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
  "bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200",
  "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
  "bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200",
];

function getColorForTag(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function Filtros({
  busca,
  setBusca,
  generoFiltro,
  setGeneroFiltro,
  statusFiltro,
  setStatusFiltro,
  tagsFiltro,
  setTagsFiltro,
  generos,
  todasTags,
}: FiltrosProps) {
  const toggleTag = (tag: string) => {
    if (tagsFiltro.includes(tag)) {
      setTagsFiltro(tagsFiltro.filter((t) => t !== tag));
    } else {
      setTagsFiltro([...tagsFiltro, tag]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Buscar livro ou autor"
          type="text"
          id="busca"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite para buscar..."
        />

        <Select
          label="Gênero"
          id="genero"
          value={generoFiltro}
          onChange={(e) => setGeneroFiltro(e.target.value)}
        >
          <option value="">Todos os gêneros</option>
          {generos.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </Select>

        <Select
          label="Disponibilidade"
          id="status"
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="disponivel">Disponíveis</option>
          <option value="retirado">Retirados</option>
        </Select>
      </div>

      {todasTags.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Filtrar por tags
          </label>
          <div className="flex flex-wrap gap-2">
            {todasTags.map((tag) => {
              const isSelected = tagsFiltro.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    isSelected
                      ? getColorForTag(tag) +
                        " ring-2 ring-offset-1 ring-gray-400"
                      : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                  {isSelected && <span className="ml-1.5 font-bold">✓</span>}
                </button>
              );
            })}
          </div>
          {tagsFiltro.length > 0 && (
            <button
              onClick={() => setTagsFiltro([])}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Limpar filtros de tags
            </button>
          )}
        </div>
      )}
    </div>
  );
}
