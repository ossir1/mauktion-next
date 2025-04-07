import { useEffect, useState } from 'react'
import { Purchase, Review, Product } from '../types'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [sales, setSales] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      setForm({ name: parsed.name, email: parsed.email, password: '' })
    }

    const purchasesData = localStorage.getItem('mauktion-purchases')
    if (purchasesData) {
      setPurchases(JSON.parse(purchasesData))
    }

    const salesData = localStorage.getItem('mauktion-added-products')
    if (salesData) {
      const items = JSON.parse(salesData)
      const filtered = items.filter((p: any) => p.soldAt)
      setSales(filtered)
    }

    const reviewsData = localStorage.getItem('mauktion-reviews')
    if (reviewsData) {
      setReviews(JSON.parse(reviewsData))
    }
  }, [])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    const updated = { ...user, name: form.name, email: form.email }
    localStorage.setItem('mauktion-user', JSON.stringify(updated))
    setUser(updated)
    alert('Tiedot päivitetty!')
  }

  const givenReviews = reviews.filter(r => r.reviewer === user?.name)
  const receivedReviews = reviews.filter(r => r.target === user?.name)
  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
    : '-'

  if (!user) return <main className="p-6">Et ole kirjautunut sisään.</main>

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Käyttäjätiedot</h2>
        <p><strong>Nimi:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Arvosana:</strong> ⭐ {avgRating} / 5</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Muokkaa tietoja</h2>
        <div className="space-y-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nimi"
            className="border rounded p-2 w-full"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded p-2 w-full"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Uusi salasana (ei pakollinen)"
            className="border rounded p-2 w-full"
          />
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Tallenna muutokset
          </button>
        </div>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Ostohistoria</h2>
        {purchases.length === 0 && <p>Ei ostoksia.</p>}
        <ul className="space-y-2">
          {purchases.map((p, idx) => (
            <li key={idx} className="border rounded p-3">
              <p><strong>{p.name}</strong></p>
              <p>Ostettu: {new Date(p.purchasedAt).toLocaleString()}</p>
              <p>Hinta: {p.price} ({p.vatRate || '24%'} alv)</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Myyntihistoria</h2>
        {sales.length === 0 && <p>Ei myytyjä tuotteita.</p>}
        <ul className="space-y-2">
          {sales.map((s, idx) => (
            <li key={idx} className="border rounded p-3">
              <p><strong>{s.name}</strong></p>
              <p>Myyty: {new Date(s.soldAt).toLocaleString()}</p>
              <p>Hinta: {s.price} ({s.vatRate || '24%'} alv)</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Antamasi arvostelut</h2>
        {givenReviews.length === 0 && <p>Ei vielä arvosteluja.</p>}
        <ul className="space-y-2">
          {givenReviews.map((r, idx) => (
            <li key={idx} className="border rounded p-3">
              <p>Tuote: <strong>{r.productName}</strong></p>
              <p>Myyjä: {r.target}</p>
              <p>Arvosana: ⭐ {r.rating} / 5</p>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Saamasi arvostelut</h2>
        {receivedReviews.length === 0 && <p>Et ole saanut arvosteluja.</p>}
        <ul className="space-y-2">
          {receivedReviews.map((r, idx) => (
            <li key={idx} className="border rounded p-3">
              <p>Tuote: <strong>{r.productName}</strong></p>
              <p>Arvostelija: {r.reviewer}</p>
              <p>Arvosana: ⭐ {r.rating} / 5</p>
              <p className="text-sm text-gray-600">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
