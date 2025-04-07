import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (user) {
      setLoggedIn(true)
      setUsername(JSON.parse(user)?.name || '')
    }
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

          {loggedIn && (
            <>
              <Link href="/add" className="text-gray-700 hover:text-blue-700">Lisää tuote</Link>
              <Link href="/my-products" className="text-gray-700 hover:text-blue-700">Omat tuotteet</Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-700">Profiili</Link>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Kirjaudu ulos</button>
            </>
          )}

          {!loggedIn && (
            <Link href="/login" className="text-gray-700 hover:text-blue-700">Kirjaudu</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
