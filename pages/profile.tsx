// pages/profile.tsx
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    company: '',
    businessId: '',
    logoUrl: '',
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify(user))
    alert('Tiedot tallennettu')
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>

      <div className="grid grid-cols-1 gap-4">
        <input
          className="border p-2 rounded"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Nimi"
        />
        <input
          className="border p-2 rounded"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Sähköposti"
        />
        <input
          className="border p-2 rounded"
          name="address"
          value={user.address}
          onChange={handleChange}
          placeholder="Osoite"
        />
        <input
          className="border p-2 rounded"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          placeholder="Puhelinnumero"
        />
        <input
          className="border p-2 rounded"
          name="company"
          value={user.company}
          onChange={handleChange}
          placeholder="Yrityksen nimi (valinnainen)"
        />
        <input
          className="border p-2 rounded"
          name="businessId"
          value={user.businessId}
          onChange={handleChange}
          placeholder="Y-tunnus (valinnainen)"
        />
        <input
          className="border p-2 rounded"
          name="logoUrl"
          value={user.logoUrl}
          onChange={handleChange}
          placeholder="Yrityksen logon URL (valinnainen)"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Tallenna tiedot
        </button>
      </div>
    </div>
  )
}
