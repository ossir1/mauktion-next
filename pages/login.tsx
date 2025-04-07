import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const user = {
      name,
      email
    }

    localStorage.setItem('mauktion-user', JSON.stringify(user))
    router.push('/')
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu / Rekisteröidy</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nimi</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sähköposti</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Kirjaudu sisään
        </button>
      </form>
    </main>
  )
}
