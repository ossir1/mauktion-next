import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: string
  buyer: string
  purchasedAt: string
}

type Review = {
  productId: number
  reviewer: string
  rating: number
  comment: string
  date: string
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeReview, setActiveReview] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

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

  const hasReviewed = (productId: number) => {
    return reviews.some(r => r.productId === productId && r.reviewer === 'Ostaja')
  }

  const handleReviewSubmit = (productId: number) => {
    const newReview: Review = {
      productId,
      reviewer: 'Ostaja',
      rating,
      comment,
      date: new Date().toISOString()
    }

    const updatedReviews = [...reviews, newReview]
    setReviews(updatedReviews)
    localStorage.setItem('mauktion-reviews', JSON.stringify(updatedReviews))

    setActiveReview(null)
    setRating(0)
    setComment('')
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ostohistoria</h1>

      {purchases.length === 0 ? (
        <p>Ei ostoksia vielä.</p>
      ) : (
        <ul className="space-y-6">
          {purchases.map((purchase) => (
            <li key={purchase.id} className="border rounded p-4 shadow">
              <h2 className="text-xl font-semibold">{purchase.name}</h2>
              <p>Hinta: {purchase.price}</p>
              <p>Ostettu: {new Date(purchase.purchasedAt).toLocaleString()}</p>

              {hasReviewed(purchase.id) ? (
                <p className="text-green-700 mt-2">✔️ Arvostelu annettu</p>
              ) : activeReview === purchase.id ? (
                <div className="mt-4 space-y-2">
                  <label className="block font-medium">Arvostelu:</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border rounded p-2"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`px-3 py-1 border rounded ${
                          rating === star ? 'bg-yellow-300' : ''
                        }`}
                      >
                        {star} ⭐
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleReviewSubmit(purchase.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Lähetä arvostelu
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReview(purchase.id)}
                  className="mt-4 text-sm text-blue-600 underline"
                >
                  → Arvostele tuote
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
