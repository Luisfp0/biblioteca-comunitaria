import Header from "@/components/Header";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Sobre a Biblioteca Comunitária
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                O que é?
              </h2>
              <p className="text-gray-700 mb-4">
                Esta é uma biblioteca comunitária de livros livres, onde você
                pode:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Pegar qualquer livro disponível</li>
                <li>Trazer livros que você já leu e quer compartilhar</li>
                <li>Contribuir para o acesso à leitura na comunidade</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Como funciona?
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Pegue um livro
                    </h3>
                    <p className="text-gray-700">
                      Viu um livro que te interessou? Pega e leva! Após a leitura, pode doar para alguém ou devolver para a estante. A
                      ideia é que os livros continuem circulando.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Doe quando puder
                    </h3>
                    <p className="text-gray-700">
                      Tem livros parados aí? Traga e deixe na estante para outra
                      pessoa aproveitar. A doação não é obrigatória, mas ajuda a
                      manter o projeto vivo!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">
                      Espalhe a ideia
                    </h3>
                    <p className="text-gray-700">
                      Conte para seus amigos e vizinhos sobre a biblioteca.
                      Quanto mais gente participar, mais livros circulam!
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Onde encontrar?
              </h2>
              <p className="text-gray-700 mb-4">
                A estante está localizada na porta de casa, acessível a todos.
                Você pode verificar os livros disponíveis aqui no site antes de
                ir buscar.
              </p>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">
                Regras simples
              </h3>
              <ul className="text-blue-800 space-y-2">
                <li>✓ Trate os livros com cuidado</li>
                <li>✓ Se puder, doe um livro quando pegar outro</li>
                <li>✓ Compartilhe com amigos e familiares</li>
                <li>✓ Ajude a manter a estante organizada</li>
              </ul>
            </section>

            <section className="mt-8 text-center">
              <p className="text-lg text-gray-700 italic">
                &ldquo;Um livro, uma pessoa, um lápis e um professor podem mudar
                o mundo.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">- Malala Yousafzai</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
