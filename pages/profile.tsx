import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'
import { Review, Product } from '../types'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState<any>({
    name: '',
    email: '',
    accountType: 'individual',
    businessId: '',
    companyLogo: ''
  })
  const [sales, setSales] = useState<Product[]>([])
  const [purchases, setPurchases] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem('mauktion-user')
    const storedSales = localStorage.getItem('mauktion-sales')
    const storedPurchases = localStorage.getItem('mauktion-purchases')
    const storedReviews = localStorage.getItem('mauktion-reviews')

    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      setForm(parsed)
    }

    if (storedSales) setSales(JSON.parse(storedSales))
    if (storedPurchases) setPurchases(JSON.parse(storedPurchases))
    if (storedReviews) setReviews(JSON.parse(storedReviews))
  }, [])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev: any) => ({ ...prev, [name]: val }))
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    setUser(form)
    localStorage.setItem('mauktion-user', JSON.stringify(form))
    alert('Tiedot tallennettu!')
  }

  const handleDownloadReceipt = (product: Product) => {
    generateReceipt(product, user?.name || 'Asiakas')
  }

  const givenReviews = reviews.filter(r => r.reviewer === user?.name)
  const receivedReviews = reviews.filter(r => r.target === user?.name)
  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
    : '-'

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Profiili</h1>

        <form onSubmit={handleSave} className="space-y-4 mb-10">
          <div>
            <label className="block font-medium">Nimi</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Sähköposti</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accountType"
                value="individual"
                checked={form.accountType === 'individual'}
                onChange={handleChange}
              />
              Yksityishenkilö
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="accountType"
                value="company"
                checked={form.accountType === 'company'}
                onChange={handleChange}
              />
              Yritys
            </label>
          </div>

          {form.accountType === 'company' && (
            <>
              <div>
                <label className="block font-medium">Y-tunnus</label>
                <input
                  type="text"
                  name="businessId"
                  value={form.businessId || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Yrityksen logo (URL tai tiedostopolku)</label>
                <input
                  type="text"
                  name="companyLogo"
                  value={form.companyLogo || ''}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                />
              </div>
            </>
          )}

          <button className="bg-blue-600 text-white px-6 py-2 rounded">Tallenna tiedot</button>
        </form>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Saadut arvostelut</h2>
          <p className="mb-2">Keskimääräinen arvosana: ⭐ {avgRating} / 5</p>
          <ul className="space-y-2">
            {receivedReviews.map((r, idx) => (
              <li key={idx} className="border rounded p-3">
                <p>Tuote: <strong>{r.productName}</strong></p>
                <p>Arvosana: ⭐ {r.rating} / 5</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Antamasi arvostelut</h2>
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

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Myyntihistoria</h2>
          <ul className="space-y-2">
            {sales.map((s, idx) => (
              <li key={idx} className="border rounded p-3">
                <p><strong>{s.name}</strong> – {s.price}</p>
                <p>Myyty: {s.soldAt ? new Date(s.soldAt).toLocaleString() : '-'}</p>
                <button
                  onClick={() => handleDownloadReceipt(s)}
                  className="text-blue-600 underline text-sm mt-1"
                >
                  Lataa kuitti (PDF)
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Ostohistoria</h2>
          <ul className="space-y-2">
            {purchases.map((p, idx) => (
              <li key={idx} className="border rounded p-3">
                <p><strong>{p.name}</strong> – {p.price}</p>
                <p>Ostettu: {p.purchasedAt ? new Date(p.purchasedAt).toLocaleString() : '-'}</p>
                <button
                  onClick={() => handleDownloadReceipt(p)}
                  className="text-blue-600 underline text-sm mt-1"
                >
                  Lataa kuitti (PDF)
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
