import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
            <h1 className="text-2xl font-bold">Biblioteca Comunitária</h1>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-blue-200 transition-colors"
            >
              Livros
            </Link>
            <Link
              href="/sobre"
              className="hover:text-blue-200 transition-colors"
            >
              Sobre
            </Link>
            <Link
              href="/admin"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
