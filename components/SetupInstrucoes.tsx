export default function SetupInstrucoes() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuração Necessária
          </h1>
          <p className="text-gray-600">
            O Supabase ainda não foi configurado. Siga os passos abaixo:
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <h2 className="font-semibold text-blue-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm mr-2">
                1
              </span>
              Criar projeto no Supabase
            </h2>
            <ol className="list-disc list-inside text-blue-800 space-y-2 ml-8">
              <li>
                Acesse{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  supabase.com
                </a>
              </li>
              <li>Crie uma conta (gratuita)</li>
              <li>Clique em &ldquo;New Project&rdquo;</li>
              <li>Preencha os dados e aguarde a criação</li>
            </ol>
          </div>

          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <h2 className="font-semibold text-green-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-full text-sm mr-2">
                2
              </span>
              Criar o banco de dados
            </h2>
            <ol className="list-disc list-inside text-green-800 space-y-2 ml-8">
              <li>No painel do Supabase, vá em &ldquo;SQL Editor&rdquo;</li>
              <li>
                Abra o arquivo{" "}
                <code className="bg-green-100 px-2 py-1 rounded">
                  supabase-schema.sql
                </code>{" "}
                na raiz do projeto
              </li>
              <li>Copie todo o conteúdo e cole no SQL Editor</li>
              <li>Clique em &ldquo;Run&rdquo; para executar</li>
            </ol>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
            <h2 className="font-semibold text-purple-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm mr-2">
                3
              </span>
              Obter as credenciais
            </h2>
            <ol className="list-disc list-inside text-purple-800 space-y-2 ml-8">
              <li>
                No Supabase, vá em &ldquo;Project Settings&rdquo; (ícone de
                engrenagem)
              </li>
              <li>Clique em &ldquo;API&rdquo; no menu lateral</li>
              <li>Copie a &ldquo;Project URL&rdquo;</li>
              <li>Copie a chave &ldquo;anon public&rdquo;</li>
            </ol>
          </div>

          <div className="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
            <h2 className="font-semibold text-orange-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-600 text-white rounded-full text-sm mr-2">
                4
              </span>
              Configurar variáveis de ambiente
            </h2>
            <ol className="list-disc list-inside text-orange-800 space-y-2 ml-8">
              <li>
                Edite o arquivo{" "}
                <code className="bg-orange-100 px-2 py-1 rounded">
                  .env.local
                </code>
              </li>
              <li>Cole suas credenciais do Supabase:</li>
            </ol>
            <div className="mt-3 bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
              <pre>{`NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
ADMIN_PASSWORD=sua-senha-admin`}</pre>
            </div>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <h2 className="font-semibold text-red-900 mb-3 flex items-center">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-600 text-white rounded-full text-sm mr-2">
                5
              </span>
              Reiniciar o servidor
            </h2>
            <ol className="list-disc list-inside text-red-800 space-y-2 ml-8">
              <li>Pare o servidor (Ctrl+C no terminal)</li>
              <li>
                Execute novamente:{" "}
                <code className="bg-red-100 px-2 py-1 rounded">
                  npm run dev
                </code>
              </li>
              <li>Atualize a página</li>
            </ol>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Precisa de ajuda?</strong> Consulte o arquivo{" "}
            <code className="bg-gray-200 px-2 py-1 rounded">README.md</code>{" "}
            para instruções detalhadas.
          </p>
        </div>
      </div>
    </div>
  );
}
