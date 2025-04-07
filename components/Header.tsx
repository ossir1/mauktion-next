'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Header() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const router = useRouter()

  // Päivitä käyttäjätiedot aina reitin vaihtuessa
  useEffect(() => {
    const storedUser = localStorage.getItem('mauktion-user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        if (parsed && parsed.name) {
          setUser(parsed)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [router.asPath])

  const handleLogout = () => {
    localStorage.removeItem('mauktion-user')
    setUser(null)
    router.push('/')
  }

  return (
    <header className="bg-white shadow-md p-4 mb-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Mauktion
        </Link>
        <nav className="space-x-4 text-sm sm:text-base flex items-center">
          <Link href="/" className="text-gray-700 hover:text-blue-700">
            Etusivu
          </Link>

          {user ? (
            <>
              <Link href="/add" className="text-gray-700 hover:text-blue-700">
                Lisää tuote
              </Link>
              <Link href="/my-products" className="text-gray-700 hover:text-blue-700">
                Omat tuotteet
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-700">
                Profiili
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600"
              >
                Kirjaudu ulos
              </button>
              <span className="ml-2 text-blue-700 font-semibold hidden sm:inline">
                Tervetuloa, {user.name}!
              </span>
            </>
          ) : (
            <Link href="/login" className="text-gray-700 hover:text-blue-700">
              Kirjaudu / Rekisteröidy
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
