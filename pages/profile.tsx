import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'
import { Review } from '../types'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    const u = localStorage.getItem('mauktion-user')
    if (u) {
      const parsed = JSON.parse(u)
      setUser(parsed)
      setForm(parsed)
    }

    const pur = localStorage.getItem('mauktion-purchases')
    const sal = localStorage.getItem('mauktion-added-products')
    const rev = localStorage.getItem('mauktion-reviews')

    if (pur) setPurchases(JSON.parse(pur))
    if (sal) setSales(JSON.parse(sal).filter((p: any) => p.soldAt))
    if (rev) setReviews(JSON.parse(rev))
  }, [])

  const handleFormChange = (e: any) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdate = () => {
    localStorage.setItem('mauktion-user', JSON.stringify(form))
    alert('Tiedot päivitetty')
  }

  const givenReviews = reviews.filter(r => r.reviewer === user?.name)
  const receivedReviews = reviews.filter(r => r.target === user?.name)
  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
    : '-'

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-12">
      <h1 className="text-2xl font-bold">Profiili</h1>

      <section>
        <h2 className="font-semibold mb-2">Omat tiedot</h2>
        <div className="space-y-2">
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Nimi" className="border rounded w-full p-2" />
          <input name="email" value={form.email} onChange={handleFormChange} placeholder="Sähköposti" className="border rounded w-full p-2" />
          <input name="password" value={form.password} onChange={handleFormChange} type="password" placeholder="Salasana" className="border rounded w-full p-2" />
          <button onClick={handleUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">Tallenna</button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Ostohistoria</h2>
        {purchases.length === 0 ? <p>Ei ostoksia.</p> : (
          <ul className="space-y-2">
            {purchases.map((p, idx) => {
              const alreadyReviewed = reviews.some(r => r.productId === p.id && r.reviewer === user?.name)
              return (
                <li key={idx} className="border rounded p-3">
                  <p><strong>{p.name}</strong> – {p.price}</p>
                  <button
                    onClick={() => generateReceipt(p, user?.name)}
                    className="text-sm text-blue-600 underline mt-1"
                  >
                    Lataa kuitti (PDF)
                  </button>
                  {!alreadyReviewed && (
                    <a
                      href={`/review/${p.id}`}
                      className="block text-sm text-green-600 underline mt-1"
                    >
                      Kirjoita arvostelu
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Myyntihistoria</h2>
        {sales.length === 0 ? <p>Ei myyntejä.</p> : (
          <ul className="space-y-2">
            {sales.map((p, idx) => (
              <li key={idx} className="border rounded p-3">
                <p><strong>{p.name}</strong> – {p.price}</p>
                <p className="text-sm text-gray-600">Myyty: {new Date(p.soldAt).toLocaleString()}</p>
                <button
                  onClick={() => generateReceipt(p, 'Ostaja')}
                  className="text-sm text-blue-600 underline mt-1"
                >
                  Lataa kuitti (PDF)
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Saadut arvostelut (keskiarvo: ⭐ {avgRating})</h2>
        {receivedReviews.length === 0 ? <p>Ei arvosteluja.</p> : (
          <ul className="space-y-2">
            {receivedReviews.map((r, idx) => (
              <li key={idx} className="border rounded p-3">
                <p>Tuote: <strong>{r.productName}</strong></p>
                <p>Ostaja: {r.reviewer}</p>
                <p>Arvosana: ⭐ {r.rating} / 5</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-semibold mb-2">Antamasi arvostelut</h2>
        {givenReviews.length === 0 ? <p>Et ole vielä antanut arvosteluja.</p> : (
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
        )}
      </section>
    </main>
  )
}
