import { useEffect, useState } from 'react'
import Header from '../components/Header'

type Product = {
  id: number
  name: string
  price: string
  buyNow?: boolean
  auction?: boolean
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Product[]>([])
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Hae käyttäjänimi
    const name = localStorage.getItem('mauktion-username')
    if (name) setUserName(name)

    // Hae ostetut tuotteet
    const purchaseData = localStorage.getItem('mauktion-purchases')
    if (purchaseData) {
      setPurchases(JSON.parse(purchaseData))
    }
  }, [])

  return (
    <>
      <Header />
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ostohistoria</h1>

        {userName && (
          <p className="mb-4 text-gray-600">
            Ostot käyttäjälle: <strong>{userName}</strong>
          </p>
        )}

        {purchases.length === 0 ? (
          <p>Et ole vielä ostanut mitään.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((product) => (
              <div key={product.id} className="border rounded-xl p-4 shadow">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-700">{product.price}</p>
                {product.buyNow && <span className="text-green-600 text-sm">Ostettu heti</span>}
                {product.auction && <span className="text-yellow-600 text-sm">Voitettu huutokaupassa</span>}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
