import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function ReviewPage() {
  const router = useRouter()
  const { id } = router.query
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [product, setProduct] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const products = localStorage.getItem('mauktion-purchases')
      const userData = localStorage.getItem('mauktion-user')
      if (products && id) {
        const parsed = JSON.parse(products)
        const found = parsed.find((p: any) => p.id === Number(id))
        setProduct(found)
      }
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [id])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const existing = localStorage.getItem('mauktion-reviews')
    const all = existing ? JSON.parse(existing) : []

    const review = {
      productId: Number(id),
      productName: product?.name || '',
      reviewer: user?.name || 'Asiakas',
      target: product?.seller || 'Myyjä',
      rating,
      comment
    }

    all.push(review)
    localStorage.setItem('mauktion-reviews', JSON.stringify(all))
    router.push('/profile')
  }

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Arvostele tuote: {product.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Arvosana (1–5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border p-2 rounded w-full"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Kommentti</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Lähetä arvostelu
        </button>
      </form>
    </main>
  )
}
