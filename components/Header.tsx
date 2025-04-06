import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Header() {
  const [username, setUsername] = useState('')
  const router = useRouter()

  useEffect(() => {
    const name = localStorage.getItem('mauktion-username')
    if (name) setUsername(name)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('mauktion-username')
    router.push('/login')
  }

  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Mauktion
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-700">Etusivu</Link>
          <Link href="/add" className="text-gray-700 hover:text-blue-700">Lisää tuote</Link>
          <Link href="/my-products" className="text-gray-700 hover:text-blue-700">Omat tuotteet</Link>
          <Link href="/profile" className="text-gray-700 hover:text-blue-700">Profiili</Link>

          {username ? (
            <>
              <span className="text-sm text-gray-600">Tervetuloa, {username}!</span>
              <button onClick={handleLogout} className="text-red-600 underline text-sm ml-2">
                Kirjaudu ulos
              </button>
            </>
          ) : (
            <Link href="/login" className="text-blue-600 underline text-sm">Kirjaudu sisään</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
