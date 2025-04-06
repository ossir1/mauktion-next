import { useRouter } from 'next/router'
import { products } from '../../data/products'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query

  const product = products.find((p) => p.id === Number(id))

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-xl mb-2">{product.price}</p>

      {product.buyNow && (
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Buy Now
        </button>
      )}
      {product.auction && (
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          Bid
        </button>
      )}

      <div className="mt-6">
        <a href="/" className="text-blue-600 underline">
          ← Takaisin etusivulle
        </a>
      </div>
    </main>
  )
}
