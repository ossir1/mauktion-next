import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegisterMode, setIsRegisterMode] = useState(false)

  useEffect(() => {
    const loggedUser = localStorage.getItem('mauktion-user')
    if (loggedUser) {
      router.push('/')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const usersRaw = localStorage.getItem('mauktion-users')
    const users = usersRaw ? JSON.parse(usersRaw) : []

    if (isRegisterMode) {
      // Rekisteröinti
      const exists = users.find((u: any) => u.username === username)
      if (exists) {
        setError('Käyttäjätunnus on jo olemassa.')
        return
      }
      const newUser = { username, password }
      const updated = [...users, newUser]
      localStorage.setItem('mauktion-users', JSON.stringify(updated))
      localStorage.setItem('mauktion-user', JSON.stringify(newUser))
      router.push('/')
    } else {
      // Kirjautuminen
      const found = users.find((u: any) => u.username === username && u.password === password)
      if (!found) {
        setError('Väärä käyttäjätunnus tai salasana.')
        return
      }
      localStorage.setItem('mauktion-user', JSON.stringify(found))
      router.push('/')
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isRegisterMode ? 'Rekisteröidy' : 'Kirjaudu sisään'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Käyttäjätunnus</label>
          <input
            className="w-full border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isRegisterMode ? 'Luo tunnus' : 'Kirjaudu'}
        </button>
      </form>

      <p className="mt-4 text-sm">
        {isRegisterMode ? (
          <>
            Onko sinulla jo tunnus?{' '}
            <button onClick={() => setIsRegisterMode(false)} className="text-blue-600 underline">
              Kirjaudu sisään
            </button>
          </>
        ) : (
          <>
            Ei tunnusta?{' '}
            <button onClick={() => setIsRegisterMode(true)} className="text-blue-600 underline">
              Rekisteröidy
            </button>
          </>
        )}
      </p>
    </main>
  )
}
