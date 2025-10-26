import { Livro } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";

interface LivroCardProps {
  livro: Livro;
}

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

export function getColorForTag(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

export default function LivroCard({ livro }: LivroCardProps) {
  const isRetirado = livro.status === "retirado";

  return (
    <Link
      href={`/livro/${livro.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block"
    >
      <div className="relative h-64 w-full bg-gray-200">
        {livro.foto_capa_url ? (
          <Image
            src={livro.foto_capa_url}
            alt={`Capa do livro ${livro.titulo}`}
            fill
            className={`object-cover ${isRetirado ? "opacity-40" : ""}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
        )}

        {isRetirado && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-xl transform rotate-[-12deg] text-lg">
              RETIRADO
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {livro.titulo}
          </h3>
          <span
            className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
              livro.status === "disponivel"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {livro.status === "disponivel" ? "Disponível" : "Retirado"}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          <span className="font-medium">Autor:</span> {livro.autor}
        </p>

        {livro.genero && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Gênero:</span> {livro.genero}
          </p>
        )}

        {livro.ano && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Ano:</span> {livro.ano}
          </p>
        )}

        {livro.descricao && (
          <p className="text-sm text-gray-700 mt-3 line-clamp-3">
            {livro.descricao}
          </p>
        )}

        {livro.tags && livro.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
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
          </div>
        )}
      </div>
    </Link>
  );
}
