'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [user, setUser] = useState<{ name: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-user')
    if (stored) {
      setUser(JSON.parse(stored))
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
        <nav className="space-x-4 text-sm sm:text-base">
          <Link href="/" className="text-gray-700 hover:text-blue-700">
            Etusivu
          </Link>
          {user && (
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
          )}
          {!user && (
            <Link href="/login" className="text-gray-700 hover:text-blue-700">
              Kirjaudu / Rekisteröidy
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
