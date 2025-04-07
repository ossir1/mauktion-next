import { useEffect, useState } from 'react'

type Purchase = {
  id: number
  name: string
  price: string
  purchasedAt: string
  review?: {
    rating: number
    comment: string
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [averageRating, setAverageRating] = useState<number | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('mauktion-user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const rawPurchases = localStorage.getItem('mauktion-purchases')
    if (rawPurchases) {
      setPurchases(JSON.parse(rawPurchases))
    }

    const rawReviews = localStorage.getItem('mauktion-reviews')
    if (rawReviews) {
      const parsed = JSON.parse(rawReviews)
      setReviews(parsed)

      if (parsed.length > 0) {
        const avg =
          parsed.reduce((acc: number, r: any) => acc + r.rating, 0) / parsed.length
        setAverageRating(avg)
      }
    }
  }, [])

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profiili</h1>

      {user && (
        <p className="mb-2 text-gray-700">
          👤 Käyttäjänimi: <span className="font-semibold">{user.name}</span>
        </p>
      )}

      {averageRating !== null && (
        <p className="mb-6 text-gray-700">
          ⭐️ Saatujen arvostelujen keskiarvo: {averageRating.toFixed(1)} / 5
        </p>
      )}

      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">🛒 Ostohistoria</h2>
        {purchases.length === 0 ? (
          <p className="text-sm text-gray-500">Ei ostoksia vielä.</p>
        ) : (
          <ul className="space-y-2">
            {purchases.map((p) => (
              <li key={p.id} className="border p-3 rounded">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">Hinta: {p.price}</div>
                <div className="text-sm text-gray-600">
                  Ostettu: {new Date(p.purchasedAt).toLocaleString()}
                </div>
                {p.review && (
                  <div className="mt-1 text-sm text-gray-600">
                    Arvostelu: {p.review.rating} / 5 – “{p.review.comment}”
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t pt-4 mt-6">
        <h2 className="text-lg font-semibold mb-2">✍️ Antamasi arvostelut</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">Et ole vielä antanut arvosteluja.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((r, i) => (
              <li key={i} className="text-sm text-gray-700">
                ⭐ {r.rating} / 5 – “{r.comment}”
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
