import { useEffect, useState } from 'react'
import { Review, Product, Purchase } from '../types'
import { generateReceipt } from '../utils/receipt'
import { useRouter } from 'next/router'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [sales, setSales] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('mauktion-user')
    if (userData) {
      const parsed = JSON.parse(userData)
      setUser(parsed)
    }

    const pur = localStorage.getItem('mauktion-purchases')
    if (pur) {
      setPurchases(JSON.parse(pur))
    }

    const added = localStorage.getItem('mauktion-added-products')
    if (added) {
      const parsed = JSON.parse(added)
      const sold = parsed.filter((p: Product) => p.soldAt)
      setSales(sold)
    }

    const rev = localStorage.getItem('mauktion-reviews')
    if (rev) {
      setReviews(JSON.parse(rev))
    }
  }, [])

  const handleDownloadReceipt = async (product: Product) => {
    await generateReceipt(product, user?.name || 'Asiakas')
  }

  const givenReviews = reviews.filter(r => r.reviewer === user?.name)
  const receivedReviews = reviews.filter(r => r.target === user?.name)

  const avgRating =
    receivedReviews.length > 0
      ? (
          receivedReviews.reduce((sum, r) => sum + r.rating, 0) /
          receivedReviews.length
        ).toFixed(1)
      : '-'

  if (!user) return <div className="p-6">Kirjaudu sisään nähdäksesi profiilisi.</div>

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profiili</h1>

      <div className="mb-6 border p-4 rounded shadow bg-white">
        <h2 className="text-xl font-semibold mb-2">Omat tiedot</h2>
        <p><strong>Nimi:</strong> {user.name}</p>
        <p><strong>Sähköposti:</strong> {user.email}</p>
        <p><strong>Puhelinnumero:</strong> {user.phone || '-'}</p>
        <p><strong>Osoite:</strong> {user.address || '-'}</p>
        <p><strong>Käyttäjätyyppi:</strong> {user.userType || 'Yksityishenkilö'}</p>
        {user.userType === 'Yritys' && <p><strong>Y-tunnus:</strong> {user.businessId || '-'}</p>}
        <button
          onClick={() => router.push('/settings')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Muokkaa tietoja
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Saadut arvostelut (Keskiarvo: ⭐ {avgRating})</h2>
        {receivedReviews.length === 0 ? (
          <p>Ei vielä arvosteluja.</p>
        ) : (
          <ul className="space-y-2">
            {receivedReviews.map((r, idx) => (
              <li key={idx} className="border rounded p-3 bg-white shadow">
                <p><strong>Tuote:</strong> {r.productName}</p>
                <p><strong>Arvosana:</strong> ⭐ {r.rating} / 5</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Antamasi arvostelut</h2>
        {givenReviews.length === 0 ? (
          <p>Et ole vielä antanut arvosteluja.</p>
        ) : (
          <ul className="space-y-2">
            {givenReviews.map((r, idx) => (
              <li key={idx} className="border rounded p-3 bg-white shadow">
                <p><strong>Tuote:</strong> {r.productName}</p>
                <p><strong>Myyjä:</strong> {r.target}</p>
                <p><strong>Arvosana:</strong> ⭐ {r.rating} / 5</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ostohistoria</h2>
        {purchases.length === 0 ? (
          <p>Ei ostoksia.</p>
        ) : (
          <ul className="space-y-2">
            {purchases.map((p, idx) => (
              <li key={idx} className="border rounded p-3 bg-white shadow">
                <p><strong>{p.name}</strong> – {p.price} €</p>
                <p>Ostettu: {p.purchasedAt ? new Date(p.purchasedAt).toLocaleString() : '-'}</p>
                <button
                  onClick={() => handleDownloadReceipt(p)}
                  className="text-blue-600 underline text-sm mt-1"
                >
                  Lataa kuitti PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Myydyt tuotteet</h2>
        {sales.length === 0 ? (
          <p>Ei myyntejä.</p>
        ) : (
          <ul className="space-y-2">
            {sales.map((p, idx) => (
              <li key={idx} className="border rounded p-3 bg-white shadow">
                <p><strong>{p.name}</strong> – {p.price} €</p>
                <p>Myyty: {p.soldAt ? new Date(p.soldAt).toLocaleString() : '-'}</p>
                <button
                  onClick={() => handleDownloadReceipt(p)}
                  className="text-blue-600 underline text-sm mt-1"
                >
                  Lataa kuitti PDF
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
