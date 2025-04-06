import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-username')
    if (stored) {
      setUsername(stored)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mauktion-username')
    setUsername(null)
    window.location.href = '/'
  }

  const handleAddProductClick = (e: React.MouseEvent) => {
    if (!username) {
      e.preventDefault()
      window.location.href = '/login'
    }
  }

  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Mauktion
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-700">
            Etusivu
          </Link>
          <Link href="/add" className="text-gray-700 hover:text-blue-700" onClick={handleAddProductClick}>
            Lisää tuote
          </Link>
          {username && (
            <>
              <Link href="/my-products" className="text-gray-700 hover:text-blue-700">
                Omat tuotteet
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-700">
                Profiili
              </Link>
            </>
          )}
          {username ? (
            <button onClick={handleLogout} className="text-red-600 hover:underline">
              Kirjaudu ulos ({username})
            </button>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-blue-700">
              Kirjaudu sisään
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
