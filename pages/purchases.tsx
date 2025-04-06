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
      setReviews(JSON.parse(reviewData))
    }
  }, [])

  const handleReview = (id: number) => {
    const rating = prompt('Anna arvosana (1-5):')
    const comment = prompt('Kirjoita arvostelu:')
    if (!rating) return

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
  const getReview = (id: number) => reviews.find((r: any) => r.productId === id)

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ostohistoriasi</h1>
      {purchases.length === 0 && <p>Ei ostoksia vielä.</p>}
      <ul className="space-y-4">
        {purchases.map((purchase) => (
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

              {!hasReviewed(purchase.id) && (
                <button
                  onClick={() => handleReview(purchase.id)}
                  className="text-sm text-green-600 underline"
                >
                  Arvostele tuote
                </button>
              )}
            </div>

            {hasReviewed(purchase.id) && (
              <div className="mt-2 text-sm text-gray-700">
                <p>⭐️ Arvosana: {getReview(purchase.id)?.rating}/5</p>
                <p>💬 “{getReview(purchase.id)?.comment}”</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
