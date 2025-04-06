import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem('mauktion-username')
    if (savedName) {
      setUserName(savedName)
    }
  }, [])

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
          {userName && (
            <span className="text-sm text-gray-500 ml-4">Tervetuloa, <strong>{userName}</strong></span>
          )}
        </nav>
      </div>
    </header>
  )
}
