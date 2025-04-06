import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { generateReceipt } from '../utils/receipt'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([])

  useEffect(() => {
    const data = localStorage.getItem('mauktion-purchases')
    if (data) {
      setPurchases(JSON.parse(data))
    }
  }, [])

  return (
    <>
      <Header />
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ostohistoria</h1>

        {purchases.length === 0 ? (
          <p>Ei vielä ostoksia.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((product) => (
              <div key={product.id} className="border rounded-xl p-4 shadow">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-700 mb-1">Hinta: {product.price}</p>
                <p className="text-sm text-gray-500">ID: {product.id}</p>
                <button
                  onClick={() => generateReceipt(product)}
                  className="text-sm text-blue-600 underline mt-2"
                >
                  Lataa kuitti (PDF)
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
