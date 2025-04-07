// pages/settings.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-user')
    if (!stored) {
      router.push('/login')
      return
    }
    const user = JSON.parse(stored)
    setUser(user)
    setName(user.name)
    setEmail(user.email)
  }, [router])

  const handleSave = () => {
    if (!user) return

    const all = localStorage.getItem('mauktion-users')
    const users = all ? JSON.parse(all) : []

    const updatedUsers = users.map((u: any) =>
      u.email === user.email
        ? {
            ...u,
            name,
            email,
            password: newPassword ? newPassword : password || u.password
          }
        : u
    )

    const updatedUser = {
      ...user,
      name,
      email,
      password: newPassword ? newPassword : password || user.password
    }

    localStorage.setItem('mauktion-users', JSON.stringify(updatedUsers))
    localStorage.setItem('mauktion-user', JSON.stringify(updatedUser))
    setMessage('Tiedot päivitetty!')
    setPassword('')
    setNewPassword('')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Omat tiedot</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Nimi</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Sähköposti</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Nykyinen salasana (valinnainen)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Uusi salasana (valinnainen)</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tallenna muutokset
        </button>
      </div>
    </main>
  )
}
