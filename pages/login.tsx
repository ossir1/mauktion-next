import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (localStorage.getItem('mauktion-user')) {
      router.push('/')
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const users = JSON.parse(localStorage.getItem('mauktion-users') || '{}')

    if (isRegistering) {
      if (users[username]) {
        setMessage('Käyttäjänimi on jo varattu.')
      } else {
        users[username] = password
        localStorage.setItem('mauktion-users', JSON.stringify(users))
        localStorage.setItem('mauktion-user', username)
        router.push('/')
      }
    } else {
      if (!users[username]) {
        setMessage('Käyttäjää ei löydy.')
      } else if (users[username] !== password) {
        setMessage('Väärä salasana.')
      } else {
        localStorage.setItem('mauktion-user', username)
        router.push('/')
      }
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? 'Rekisteröidy' : 'Kirjaudu sisään'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Käyttäjänimi</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Salasana</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {message && <div className="text-red-600 text-sm">{message}</div>}
        <button className="bg-blue-600 text-white px-6 py-2 rounded w-full" type="submit">
          {isRegistering ? 'Luo tunnus' : 'Kirjaudu'}
        </button>
      </form>
      <button
        onClick={() => {
          setIsRegistering(!isRegistering)
          setMessage('')
        }}
        className="mt-4 text-sm text-blue-600 underline"
      >
        {isRegistering ? 'Onko sinulla jo tili? Kirjaudu' : 'Ei vielä tiliä? Rekisteröidy'}
      </button>
    </main>
  )
}
