import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'

type Purchase = {
  id: number
  name: string
  price: string
  vatRate?: string
  vatAmount?: string
  purchasedAt: string
  buyer?: string
  deliveryChoice?: string
}

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('mauktion-purchases')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          setPurchases(parsed)
        } catch (err) {
          console.error('Ostohistorian lataus epäonnistui:', err)
        }
      }
    }
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ostohistoria</h1>

      {purchases.length === 0 ? (
        <p className="text-gray-600">Ei vielä ostoksia.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {purchases.map((item) => (
            <div key={item.id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
              <p className="text-gray-800 font-medium mb-1">Hinta: {item.price}</p>
              <p className="text-sm text-gray-600">
                ALV: {item.vatRate || '24%'} ({item.vatAmount || '0'} €)
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Ostettu: {new Date(item.purchasedAt).toLocaleString('fi-FI')}
              </p>
              <p className="text-sm text-gray-500">Ostaja: {item.buyer || 'Asiakas'}</p>
              <button
                onClick={() => generateReceipt(item, item.buyer || 'Asiakas')}
                className="mt-3 text-sm text-blue-600 underline"
              >
                Lataa kuitti PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
