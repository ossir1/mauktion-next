import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'

export default function Sales() {
  const [myProducts, setMyProducts] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])

  useEffect(() => {
    const added = localStorage.getItem('mauktion-added-products')
    const bought = localStorage.getItem('mauktion-purchases')

    setMyProducts(added ? JSON.parse(added) : [])
    setPurchases(bought ? JSON.parse(bought) : [])
  }, [])

  const isSold = (productId: number) => {
    return purchases.some((p) => p.id === productId)
  }

  const getBuyerName = (productId: number) => {
    const item = purchases.find((p) => p.id === productId)
    return item?.buyerName || 'Asiakas'
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Myyntihistoria</h1>

      {myProducts.length === 0 ? (
        <p>Et ole vielä lisännyt tuotteita.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-700 mb-2">{product.price}</p>
                {isSold(product.id) ? (
                  <p className="text-green-700 font-medium mb-2">✅ Myyty ostajalle: {getBuyerName(product.id)}</p>
                ) : (
                  <p className="text-yellow-600 mb-2">⏳ Ei vielä myyty</p>
                )}
              </div>

              {isSold(product.id) && (
                <button
                  onClick={() => generateReceipt(product, getBuyerName(product.id), 'seller')}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  📄 Lataa myyntikuitti
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
