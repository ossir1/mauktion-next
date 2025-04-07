// pages/auth.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const existing = localStorage.getItem('mauktion-user')
    if (existing) router.push('/')
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('mauktion-users') || '[]')

    if (isLogin) {
      const user = users.find((u: any) => u.email === email && u.password === password)
      if (user) {
        localStorage.setItem('mauktion-user', JSON.stringify(user))
        router.push('/')
      } else {
        setError('Virheellinen sähköposti tai salasana')
      }
    } else {
      const exists = users.find((u: any) => u.email === email)
      if (exists) {
        setError('Sähköposti on jo rekisteröity')
      } else {
        const newUser = { name, email, password }
        const updatedUsers = [...users, newUser]
        localStorage.setItem('mauktion-users', JSON.stringify(updatedUsers))
        localStorage.setItem('mauktion-user', JSON.stringify(newUser))
        router.push('/')
      }
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isLogin ? 'Kirjaudu sisään' : 'Luo tunnus'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block font-medium">Nimi</label>
            <input
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

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {isLogin ? 'Kirjaudu' : 'Rekisteröidy'}
        </button>
      </form>

      <button
        onClick={() => {
          setIsLogin(!isLogin)
          setError('')
        }}
        className="mt-4 text-blue-600 underline"
      >
        {isLogin ? 'Luo uusi tunnus' : 'Palaa kirjautumiseen'}
      </button>
    </main>
  )
}
