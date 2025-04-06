import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-user')
    setUsername(stored)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mauktion-user')
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Mauktion
        </Link>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-700">Etusivu</Link>
          {username && (
            <>
              <Link href="/add" className="text-gray-700 hover:text-blue-700">Lisää tuote</Link>
              <Link href="/my-products" className="text-gray-700 hover:text-blue-700">Omat tuotteet</Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-700">Profiili</Link>
            </>
          )}
          {!username ? (
            <Link href="/login" className="text-gray-700 hover:text-blue-700">Kirjaudu sisään</Link>
          ) : (
            <button onClick={handleLogout} className="text-red-600 hover:underline">Kirjaudu ulos</button>
          )}
        </nav>
      </div>
    </header>
  )
}
