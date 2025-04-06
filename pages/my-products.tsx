import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { useRouter } from 'next/router'

export default function MyProducts() {
  const router = useRouter()
  const [username, setUsername] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (!user) {
      router.push('/login')
    } else {
      setUsername(user)

      const stored = localStorage.getItem('mauktion-added-products')
      if (stored) {
        const parsed = JSON.parse(stored)
        const filtered = parsed.filter((p: any) => p.seller === user)
        setProducts(filtered)
      }
    }
  }, [])

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Omat tuotteet</h1>

      {products.length === 0 ? (
        <p>Sinulla ei ole vielä lisättyjä tuotteita.</p>
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
