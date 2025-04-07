import { useState } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const users = localStorage.getItem('mauktion-users')
    if (!users) return setError('Ei käyttäjiä rekisteröitynä.')

    const parsed = JSON.parse(users)
    const user = parsed.find((u: any) => u.email === form.email && u.password === form.password)
    if (!user) return setError('Virheellinen sähköposti tai salasana.')

    localStorage.setItem('mauktion-user', JSON.stringify(user))
    router.push('/')
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Kirjaudu sisään</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium">Sähköposti</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Salasana</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kirjaudu
        </button>
      </form>
      <p className="mt-4 text-sm">
        Eikö sinulla ole vielä tiliä?{' '}
        <a href="/register" className="text-blue-600 underline">
          Luo käyttäjä
        </a>
      </p>
    </main>
  )
}
