import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('mauktion-users') || '{}')
    if (users[username]) {
      alert('Käyttäjänimi on jo varattu')
      return
    }
    users[username] = { password }
    localStorage.setItem('mauktion-users', JSON.stringify(users))
    alert('Rekisteröityminen onnistui! Kirjaudu sisään.')
    router.push('/login')
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rekisteröidy</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block font-medium">Käyttäjänimi</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Salasana</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Luo käyttäjä</button>
      </form>
    </main>
  )
}
