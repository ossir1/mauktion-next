import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'

export default function MyProducts() {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const data = localStorage.getItem('mauktion-added-products')
    if (data) {
      const parsed = JSON.parse(data)
      const unsold = parsed.filter((p: any) => !p.soldAt)
      setProducts(unsold)
    }
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Omat lisäämäni tuotteet</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">Et ole vielä lisännyt tuotteita tai ne on myyty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              buyNow={product.buyNow}
              auction={product.auction}
              endsAt={product.endsAt}
              pickupAvailable={product.pickupAvailable}
              pickupLocation={product.pickupLocation}
              deliveryAvailable={product.deliveryAvailable}
              deliveryCost={product.deliveryCost}
              vatRate={product.vatRate}
              vatAmount={product.vatAmount}
            />
          ))}
        </div>
      )}
    </main>
  )
}
