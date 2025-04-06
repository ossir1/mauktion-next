import { useRouter } from 'next/router'
import { products } from '../../data/products'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query

  const product = products.find((p) => p.id === Number(id))

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <main className="p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        {/* Placeholder-kuva */}
        <div className="mb-4">
          <img
            src={`https://via.placeholder.com/600x400?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="rounded-lg shadow"
          />
        </div>

        <p className="text-xl text-gray-800 mb-2">{product.price}</p>

        {/* Placeholder-kuvaus */}
        <p className="text-gray-600 mb-4">
          Tämä on esittelyteksti tuotteelle {product.name}. Tänne voidaan lisätä tuotteen tarkempi kuvaus, kun käytössä on tietokanta tai käyttäjän syöttämä data.
        </p>

        <div className="flex gap-4 mb-6">
          {product.buyNow && (
            <button className="bg-blue-500 text-white px-6 py-2 rounded">
              Buy Now
            </button>
          )}
          {product.auction && (
            <button className="bg-yellow-500 text-white px-6 py-2 rounded">
              Bid
            </button>
          )}
        </div>

        <a href="/" className="text-blue-600 underline">
          ← Takaisin etusivulle
        </a>
      </div>
    </main>
  )
}
