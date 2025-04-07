import { useEffect, useState } from 'react'
import { Review } from '../types'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [sales, setSales] = useState<any[]>([])
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-user')
    if (stored) {
      const parsedUser = JSON.parse(stored)
      setUser(parsedUser)

      // Lataa myydyt tuotteet
      const all = localStorage.getItem('mauktion-added-products')
      if (all) {
        const parsed = JSON.parse(all)
        const mySales = parsed.filter((p: any) => p.soldAt && p.seller === parsedUser.name)
        setSales(mySales)
      }

      // Antamasi arvostelut
      const reviews = localStorage.getItem('mauktion-reviews')
      if (reviews) {
        const parsed = JSON.parse(reviews)
        const given = parsed.filter((r: Review) => r.buyer === parsedUser.name)
        const received = parsed.filter((r: Review) => r.seller === parsedUser.name)
        setGivenReviews(given)
        setReceivedReviews(received)

        if (received.length > 0) {
          const avg =
            received.reduce((sum, r) => sum + Number(r.rating), 0) / received.length
          setAverageRating(avg)
        }
      }
    }
  }, [])

  if (!user) return <div className="p-6">Et ole kirjautunut sisään.</div>

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold mb-4">Profiili – {user.name}</h1>

      {/* Myyntihistoria */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Myydyt tuotteesi</h2>
        {sales.length === 0 ? (
          <p className="text-gray-600">Ei vielä myytyjä tuotteita.</p>
        ) : (
          <ul className="space-y-2">
            {sales.map((p) => (
              <li key={p.id} className="border p-3 rounded">
                <strong>{p.name}</strong> – myyty {new Date(p.soldAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Antamasi arvostelut */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Antamasi arvostelut</h2>
        {givenReviews.length === 0 ? (
          <p className="text-gray-600">Et ole vielä antanut arvosteluja.</p>
        ) : (
          <ul className="space-y-2">
            {givenReviews.map((r, i) => (
              <li key={i} className="border p-3 rounded">
                <strong>{r.productName}</strong> – {r.rating}/5
                <p className="text-sm text-gray-700">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Saadut arvostelut */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Saamasi arvostelut</h2>
        {receivedReviews.length === 0 ? (
          <p className="text-gray-600">Et ole vielä saanut arvosteluja.</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-2">
              ⭐️ Keskiarvo: {averageRating?.toFixed(1)} / 5 ({receivedReviews.length} arvostelua)
            </p>
            <ul className="space-y-2">
              {receivedReviews.map((r, i) => (
                <li key={i} className="border p-3 rounded">
                  <strong>{r.productName}</strong> – {r.rating}/5
                  <p className="text-sm text-gray-700 italic">"{r.comment}"</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  )
}
