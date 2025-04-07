// pages/login.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (user) router.push('/')
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stored = localStorage.getItem('mauktion-users')
    const users = stored ? JSON.parse(stored) : []

    if (mode === 'login') {
      const user = users.find((u: any) => u.email === email && u.password === password)
      if (!user) return setError('Virheellinen sähköposti tai salasana.')
      localStorage.setItem('mauktion-user', JSON.stringify(user))
      router.push('/')
    } else {
      const exists = users.find((u: any) => u.email === email)
      if (exists) return setError('Sähköposti on jo rekisteröity.')
      const newUser = { name, email, password }
      users.push(newUser)
      localStorage.setItem('mauktion-users', JSON.stringify(users))
      localStorage.setItem('mauktion-user', JSON.stringify(newUser))
      router.push('/')
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {mode === 'login' ? 'Kirjaudu sisään' : 'Rekisteröidy'}
      </h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block font-medium">Nimi</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block font-medium">Sähköposti</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Salasana</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {mode === 'login' ? 'Kirjaudu' : 'Rekisteröidy'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        {mode === 'login' ? (
          <>
            Ei vielä käyttäjää?{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => setMode('register')}
            >
              Rekisteröidy
            </button>
          </>
        ) : (
          <>
            Onko sinulla jo tili?{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => setMode('login')}
            >
              Kirjaudu
            </button>
          </>
        )}
      </p>
    </main>
  )
}
