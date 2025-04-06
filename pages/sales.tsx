import { useEffect, useState } from 'react'

export default function SalesPage() {
  const [soldProducts, setSoldProducts] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('mauktion-added-products')
    if (stored) {
      const parsed = JSON.parse(stored)
      const sold = parsed.filter((p: any) => p.soldAt)
      setSoldProducts(sold)
    }
  }, [])

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Myyntihistoria</h1>

      {soldProducts.length === 0 ? (
        <p className="text-gray-600">Ei vielä myytyjä tuotteita.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {soldProducts.map((product) => (
            <div key={product.id} className="border rounded-xl p-4 shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
              <p className="text-gray-800 font-medium mb-1">Hinta: {product.price}</p>
              <p className="text-sm text-gray-600">
                ALV: {product.vatRate || '24%'} ({product.vatAmount || '0'} €)
              </p>
              {product.soldAt && (
                <p className="text-sm text-gray-600 mt-2">
                  Myyty: {new Date(product.soldAt).toLocaleString('fi-FI')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
