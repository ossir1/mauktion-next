import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)

  useEffect(() => {
    const existing = localStorage.getItem('mauktion-user')
    if (existing) {
      setAlreadyLoggedIn(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email) {
      setError('Nimi ja sähköposti vaaditaan')
      return
    }

    const user = { name, email }
    localStorage.setItem('mauktion-user', JSON.stringify(user))
    router.push('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('mauktion-user')
    window.location.reload()
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu / Rekisteröidy</h1>

      {alreadyLoggedIn ? (
        <div>
          <p className="mb-4 text-green-700">Olet jo kirjautunut sisään.</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Kirjaudu ulos
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label className="block font-medium">Nimi</label>
            <input
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium">Sähköposti</label>
            <input
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Kirjaudu sisään
          </button>
        </form>
      )}
    </main>
  )
}
