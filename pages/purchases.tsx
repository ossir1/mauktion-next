import { useEffect, useState } from 'react'

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([])

  useEffect(() => {
    const data = localStorage.getItem('mauktion-purchases')
    if (data) {
      setPurchases(JSON.parse(data))
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
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
