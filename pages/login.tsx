// pages/login.tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('mauktion-user')
    if (currentUser) {
      router.push('/')
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('mauktion-users') || '[]')
    const found = users.find((u: any) => u.email === email && u.password === password)

    if (found) {
      localStorage.setItem('mauktion-user', JSON.stringify(found))
      router.push('/')
    } else {
      setError('Virheellinen sähköposti tai salasana')
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu sisään</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Sähköposti</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Salasana</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2 right-2 text-sm text-blue-600"
            >
              {showPassword ? 'Piilota' : 'Näytä'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kirjaudu
        </button>
      </form>

      <p className="mt-4 text-sm">
        Ei vielä käyttäjää?{' '}
        <a href="/register" className="text-blue-600 underline">
          Rekisteröidy
        </a>
      </p>
    </main>
  )
}
