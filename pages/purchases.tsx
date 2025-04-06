import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    const data = localStorage.getItem('mauktion-purchases')
    if (data) {
      setPurchases(JSON.parse(data))
    }

    const reviewData = localStorage.getItem('mauktion-reviews')
    if (reviewData) {
      const parsed = JSON.parse(reviewData).filter(
        (r: any) => r && typeof r.rating === 'number' && r.productId
      )
      setReviews(parsed)
    }
  }, [])

  const handleReview = (id: number) => {
    if (hasReviewed(id)) {
      alert('Olet jo arvostellut tämän tuotteen.')
      return
    }

    const input = prompt('Anna arvosana (1–5):')
    if (!input) return

    const rating = parseInt(input)
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert('Arvosanan täytyy olla numero välillä 1–5.')
      return
    }

    const comment = prompt('Kirjoita arvostelu (vapaaehtoinen):') || ''

    const newReview = {
      productId: id,
      rating,
      comment,
      date: new Date().toISOString()
    }

    const all = [...reviews, newReview]
    localStorage.setItem('mauktion-reviews', JSON.stringify(all))
    setReviews(all)
  }

  const hasReviewed = (id: number) => reviews.some((r: any) => r.productId === id)
  const getReview = (id: number) =>
    reviews.find((r: any) => r.productId === id && typeof r.rating === 'number')

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ostohistoriasi</h1>
      {purchases.length === 0 && <p>Ei ostoksia vielä.</p>}
      <ul className="space-y-4">
        {purchases.map((purchase) => {
          const review = getReview(purchase.id)
          return (
            <li key={purchase.id} className="border rounded p-4">
              <p className="font-semibold">{purchase.name}</p>
              <p>Hinta: {purchase.price}</p>
              <p>Ostettu: {new Date(purchase.purchasedAt).toLocaleString()}</p>
              <p>ALV: {purchase.vatRate || '24%'} ({purchase.vatAmount || '0'} €)</p>
              <p>Toimitustapa: {purchase.deliveryAvailable ? 'Toimitus' : 'Nouto'}</p>

              <div className="flex flex-wrap gap-4 mt-2">
                <button
                  onClick={() => generateReceipt(purchase, 'Asiakas')}
                  className="text-sm text-blue-600 underline"
                >
                  Lataa kuitti PDF:nä
                </button>

                {!review && (
                  <button
                    onClick={() => handleReview(purchase.id)}
                    className="text-sm text-green-600 underline"
                  >
                    Arvostele tuote
                  </button>
                )}
              </div>

              {review && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>⭐️ Arvosana: {review.rating}/5</p>
                  <p>💬 “{review.comment}”</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </main>
  )
}
