import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: string
  soldAt?: string
  buyer: string
}

type Review = {
  productId: number
  reviewer: string
  rating: number
  comment: string
  date: string
}

export default function Sales() {
  const [sales, setSales] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [activeReview, setActiveReview] = useState<number | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const data = localStorage.getItem('mauktion-added-products')
    if (data) {
      const parsed = JSON.parse(data)
      const sold = parsed.filter((p: Product) => p.soldAt)
      setSales(sold)
    }

    const reviewData = localStorage.getItem('mauktion-reviews')
    if (reviewData) {
      setReviews(JSON.parse(reviewData))
    }
  }, [])

  const hasReviewed = (productId: number) => {
    return reviews.some(r => r.productId === productId && r.reviewer === 'Myyjä')
  }

  const handleReviewSubmit = (productId: number) => {
    const newReview: Review = {
      productId,
      reviewer: 'Myyjä',
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
      <h1 className="text-2xl font-bold mb-6">Myyntihistoria</h1>

      {sales.length === 0 ? (
        <p>Ei myytyjä tuotteita.</p>
      ) : (
        <ul className="space-y-6">
          {sales.map((sale) => (
            <li key={sale.id} className="border rounded p-4 shadow">
              <h2 className="text-xl font-semibold">{sale.name}</h2>
              <p>Hinta: {sale.price}</p>
              <p>Ostaja: {sale.buyer || 'N/A'}</p>
              <p>Myyty: {sale.soldAt ? new Date(sale.soldAt).toLocaleString() : '–'}</p>

              {hasReviewed(sale.id) ? (
                <p className="text-green-700 mt-2">✔️ Arvostelu annettu</p>
              ) : activeReview === sale.id ? (
                <div className="mt-4 space-y-2">
                  <label className="block font-medium">Arvostele ostaja:</label>
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
                    onClick={() => handleReviewSubmit(sale.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Lähetä arvostelu
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveReview(sale.id)}
                  className="mt-4 text-sm text-blue-600 underline"
                >
                  → Arvostele ostaja
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
