import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [registering, setRegistering] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return

    const user = { name, email }
    localStorage.setItem('mauktion-user', JSON.stringify(user))
    router.push('/')
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {registering ? 'Rekisteröidy' : 'Kirjaudu sisään'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {registering ? 'Rekisteröidy' : 'Kirjaudu sisään'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {registering ? (
          <>
            Onko sinulla jo tili?{' '}
            <button
              onClick={() => setRegistering(false)}
              className="text-blue-600 underline"
            >
              Kirjaudu tästä
            </button>
          </>
        ) : (
          <>
            Eikö sinulla ole vielä tiliä?{' '}
            <button
              onClick={() => setRegistering(true)}
              className="text-blue-600 underline"
            >
              Rekisteröidy tästä
            </button>
          </>
        )}
      </p>
    </main>
  )
}
