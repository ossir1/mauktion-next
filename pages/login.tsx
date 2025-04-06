import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const existingUser = localStorage.getItem('mauktion-username')
    if (existingUser) {
      setLoggedIn(true)
      router.push('/')
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('mauktion-users') || '{}')
    const user = users[username]

    if (!user || user.password !== password) {
      alert('Virheellinen käyttäjänimi tai salasana')
      return
    }

    localStorage.setItem('mauktion-username', username)
    alert('Kirjautuminen onnistui!')
    router.push('/')
  }

  if (loggedIn) {
    return <p className="p-6">Olet jo kirjautunut sisään.</p>
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu sisään</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium">Käyttäjänimi</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Salasana</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Kirjaudu sisään
        </button>
      </form>
    </main>
  )
}
