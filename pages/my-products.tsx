import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function MyProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])

  // 🔐 Estä pääsy ilman kirjautumista
  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (!user) {
      router.push('/login')
      return
    }

    const saved = localStorage.getItem('mauktion-added-products')
    if (saved) {
      setProducts(JSON.parse(saved))
    }
  }, [])

  return (
    <>
      <Head>
        <title>Omat tuotteet</title>
      </Head>
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Omat tuotteesi</h1>

        {products.length === 0 ? (
          <p>Et ole vielä lisännyt tuotteita.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, idx) => (
              <ProductCard
                key={idx}
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
    </>
  )
}
