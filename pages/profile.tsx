import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'
import { Review } from '../types'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const u = localStorage.getItem('mauktion-user')
    if (u) setUser(JSON.parse(u))

    const s = localStorage.getItem('mauktion-sales')
    if (s) setSales(JSON.parse(s))

    const p = localStorage.getItem('mauktion-purchases')
    if (p) setPurchases(JSON.parse(p))

    const r = localStorage.getItem('mauktion-reviews')
    if (r) setReviews(JSON.parse(r))
  }, [])

  const hasReviewed = (productId: number) =>
    reviews.some((r) => r.productId === productId && r.reviewer === user?.name)

  const givenReviews = reviews.filter((r) => r.reviewer === user?.name)
  const receivedReviews = reviews.filter((r) => r.target === user?.name)

  const avgRating = receivedReviews.length
    ? (
        receivedReviews.reduce((sum, r) => sum + r.rating, 0) /
        receivedReviews.length
      ).toFixed(1)
    : '-'

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>
      {user && (
        <p className="mb-6 text-gray-700">
          Tervetuloa, <strong>{user.name}</strong>! Keskiarvo: ⭐ {avgRating}/5
        </p>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Ostohistoria</h2>
        {purchases.length === 0 ? (
          <p className="text-gray-600">Ei ostoksia vielä.</p>
        ) : (
          <ul className="space-y-4">
            {purchases.map((p, i) => (
              <li key={i} className="border p-4 rounded shadow">
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-600">Ostettu: {new Date(p.purchasedAt).toLocaleString()}</p>
                <p>Hinta: {p.price}</p>
                {!hasReviewed(p.id) && (
                  <a
                    href={`/review/${p.id}`}
                    className="text-blue-600 underline mt-2 inline-block"
                  >
                    Kirjoita arvostelu
                  </a>
                )}
                <button
                  onClick={() => generateReceipt(p, user?.name || 'Asiakas')}
                  className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Lataa kuitti (PDF)
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Myyntihistoria</h2>
        {sales.length === 0 ? (
          <p className="text-gray-600">Ei myytyjä tuotteita.</p>
        ) : (
          <ul className="space-y-4">
            {sales.map((s, i) => (
              <li key={i} className="border p-4 rounded shadow">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-600">
                  Myyty: {s.soldAt ? new Date(s.soldAt).toLocaleString() : '-'}
                </p>
                <p>Hinta: {s.price}</p>
                <button
                  onClick={() => generateReceipt(s, s.buyer || 'Asiakas')}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Lataa kuitti (PDF)
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Antamasi arvostelut</h2>
        {givenReviews.length === 0 ? (
          <p className="text-gray-600">Et ole vielä arvostellut.</p>
        ) : (
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

      <section>
        <h2 className="text-xl font-semibold mb-2">Saadut arvostelut</h2>
        {receivedReviews.length === 0 ? (
          <p className="text-gray-600">Et ole saanut vielä arvosteluja.</p>
        ) : (
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
        )}
      </section>
    </main>
  )
}
