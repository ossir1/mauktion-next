import { useEffect, useState } from 'react'
import { Review, Product, Purchase } from '@/types'
import { generateReceipt } from '@/utils/receipt'
import { useRouter } from 'next/router'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [sales, setSales] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const router = useRouter()

  useEffect(() => {
    const loggedInUser = localStorage.getItem('mauktion-user')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }

    const storedPurchases = localStorage.getItem('mauktion-purchases')
    const storedSales = localStorage.getItem('mauktion-added-products')
    const storedReviews = localStorage.getItem('mauktion-reviews')

    if (storedPurchases) setPurchases(JSON.parse(storedPurchases))
    if (storedSales) {
      const sales = JSON.parse(storedSales)
      const mySales = sales.filter((p: Product) => p.soldAt)
      setSales(mySales)
    }
    if (storedReviews) setReviews(JSON.parse(storedReviews))
  }, [])

  const handleProfileUpdate = () => {
    localStorage.setItem('mauktion-user', JSON.stringify(user))
    alert('Tiedot päivitetty!')
  }

  const handleDownloadReceipt = async (product: Product) => {
    await generateReceipt(product, user?.name || 'Asiakas')
  }

  const handleLogout = () => {
    localStorage.removeItem('mauktion-user')
    router.push('/')
  }

  const givenReviews = reviews.filter((r) => r.reviewer === user?.name)
  const receivedReviews = reviews.filter((r) => r.target === user?.name)
  const avgRating =
    receivedReviews.length > 0
      ? (receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length).toFixed(1)
      : '-'

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profiili</h1>
        <button onClick={handleLogout} className="text-red-600 underline text-sm">
          Kirjaudu ulos
        </button>
      </div>

      {/* Profiilin muokkaus */}
      <section className="mb-8 border rounded p-4">
        <h2 className="font-semibold text-lg mb-3">Omat tiedot</h2>
        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            value={user?.name || ''}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            placeholder="Nimi"
            className="border p-2 rounded"
          />
          <input
            type="email"
            value={user?.email || ''}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Sähköposti"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={user?.phone || ''}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            placeholder="Puhelinnumero"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={user?.address || ''}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            placeholder="Osoite"
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={user?.businessId || ''}
            onChange={(e) => setUser({ ...user, businessId: e.target.value })}
            placeholder="Y-tunnus (jos yritys)"
            className="border p-2 rounded"
          />
          <select
            value={user?.type || ''}
            onChange={(e) => setUser({ ...user, type: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="">Valitse käyttäjätyyppi</option>
            <option value="individual">Yksityishenkilö</option>
            <option value="company">Yritys</option>
          </select>
          <button onClick={handleProfileUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
            Päivitä tiedot
          </button>
        </div>
      </section>

      {/* Ostohistoria */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Ostohistoria</h2>
        {purchases.length === 0 ? (
          <p>Ei ostoksia vielä.</p>
        ) : (
          <ul className="space-y-3">
            {purchases.map((p, idx) => (
              <li key={idx} className="border rounded p-3">
                <p>
                  <strong>{p.name}</strong> – {p.price}
                </p>
                <p>Ostettu: {p.purchasedAt ? new Date(p.purchasedAt).toLocaleString() : '-'}</p>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => handleDownloadReceipt(p)}
                    className="text-blue-600 underline text-sm"
                  >
                    Lataa kuitti PDF
                  </button>
                  {!reviews.find((r) => r.productId === p.id && r.reviewer === user?.name) && (
                    <button
                      onClick={() => router.push(`/review/${p.id}`)}
                      className="text-blue-600 underline text-sm"
                    >
                      Kirjoita arvostelu
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Myyntihistoria */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Myyntihistoria</h2>
        {sales.length === 0 ? (
          <p>Ei myyntejä vielä.</p>
        ) : (
          <ul className="space-y-3">
            {sales.map((p, idx) => (
              <li key={idx} className="border rounded p-3">
                <p>
                  <strong>{p.name}</strong> – {p.price}
                </p>
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
      </section>

      {/* Antamasi arvostelut */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Antamasi arvostelut</h2>
        {givenReviews.length === 0 ? (
          <p>Et ole vielä kirjoittanut arvosteluja.</p>
        ) : (
          <ul className="space-y-3">
            {givenReviews.map((r, idx) => (
              <li key={idx} className="border rounded p-3">
                <p>
                  Tuote: <strong>{r.productName}</strong>
                </p>
                <p>Myyjä: {r.target}</p>
                <p>Arvosana: ⭐ {r.rating} / 5</p>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Saamasi arvostelut */}
      <section className="mb-8">
        <h2 className="font-semibold text-lg mb-3">Saamasi arvostelut</h2>
        <p className="text-sm mb-2">Keskiarvo: ⭐ {avgRating} / 5</p>
        {receivedReviews.length === 0 ? (
          <p>Et ole vielä saanut arvosteluja.</p>
        ) : (
          <ul className="space-y-3">
            {receivedReviews.map((r, idx) => (
              <li key={idx} className="border rounded p-3">
                <p>
                  Tuote: <strong>{r.productName}</strong>
                </p>
                <p>Ostaja: {r.reviewer}</p>
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
