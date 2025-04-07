import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'
import { Review } from '../types'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('mauktion-user')
    const purchaseData = localStorage.getItem('mauktion-purchases')
    const addedData = localStorage.getItem('mauktion-added-products')
    const reviewData = localStorage.getItem('mauktion-reviews')

    if (userData) setUser(JSON.parse(userData))
    if (purchaseData) setPurchases(JSON.parse(purchaseData))
    if (addedData) setSales(JSON.parse(addedData).filter((p: any) => p.soldAt))
    if (reviewData) setReviews(JSON.parse(reviewData))
  }, [])

  const givenReviews = reviews.filter(r => r.reviewer === user?.name)
  const receivedReviews = reviews.filter(r => r.target === user?.name)
  const avgRating = receivedReviews.length
    ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
    : '-'

  const hasReviewed = (productId: number) => {
    return givenReviews.some(r => r.productId === productId)
  }

  const handleReview = (product: any) => {
    router.push(`/review/${product.id}`)
  }

  const downloadReceipt = (product: any, isBuyer = true) => {
    const name = isBuyer ? user?.name || 'Ostaja' : 'Myyjä'
    generateReceipt(product, name)
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profiili</h1>
      {user ? (
        <>
          <div className="bg-white rounded-xl shadow p-4 mb-6">
            <p className="text-lg font-semibold">Tervetuloa, {user.name}!</p>
            <p className="text-sm text-gray-600">Saadut arvostelut: {receivedReviews.length}</p>
            <p className="text-sm text-gray-600">Keskiarvo: ⭐ {avgRating} / 5</p>
          </div>

          {/* Ostot */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">🛒 Ostohistoria</h2>
            {purchases.length === 0 ? (
              <p className="text-gray-500">Ei ostettuja tuotteita.</p>
            ) : (
              <ul className="space-y-2">
                {purchases.map((item, idx) => (
                  <li key={idx} className="border rounded p-3">
                    <p className="font-medium">{item.name} – {item.price}</p>
                    <p className="text-sm text-gray-600">Ostettu: {new Date(item.purchasedAt).toLocaleString()}</p>
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {!hasReviewed(item.id) && (
                        <button
                          onClick={() => handleReview(item)}
                          className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Kirjoita arvostelu
                        </button>
                      )}
                      <button
                        onClick={() => downloadReceipt(item, true)}
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Lataa kuitti (PDF)
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Myynnit */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">📦 Myyntihistoria</h2>
            {sales.length === 0 ? (
              <p className="text-gray-500">Ei myytyjä tuotteita.</p>
            ) : (
              <ul className="space-y-2">
                {sales.map((item, idx) => (
                  <li key={idx} className="border rounded p-3">
                    <p className="font-medium">{item.name} – {item.price}</p>
                    <p className="text-sm text-gray-600">Myyty: {new Date(item.soldAt).toLocaleString()}</p>
                    <button
                      onClick={() => downloadReceipt(item, false)}
                      className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Lataa kuitti (PDF)
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Antamasi arvostelut */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">✍️ Antamasi arvostelut</h2>
            {givenReviews.length === 0 ? (
              <p className="text-gray-500">Et ole vielä antanut arvosteluja.</p>
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

          {/* Saadut arvostelut */}
          <section>
            <h2 className="text-xl font-semibold mb-2">⭐ Saamasi arvostelut</h2>
            {receivedReviews.length === 0 ? (
              <p className="text-gray-500">Et ole vielä saanut arvosteluja.</p>
            ) : (
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
        </>
      ) : (
        <p>Kirjaudu sisään nähdäksesi profiilisi.</p>
      )}
    </main>
  )
}
