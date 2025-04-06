import { useRouter } from 'next/router'
import { products } from '../../data/products'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [currentBid, setCurrentBid] = useState(0)
  const [bidMessage, setBidMessage] = useState('')

  useEffect(() => {
    if (!id) return

    const staticProduct = products.find((p) => p.id === Number(id))
    let loadedProduct = staticProduct

    if (!staticProduct && typeof window !== 'undefined') {
      const fromStorage = localStorage.getItem('mauktion-added-product')
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage)
        if (parsed.id === Number(id)) {
          loadedProduct = parsed
        }
      }
    }

    if (loadedProduct) {
      setProduct(loadedProduct)
      setCurrentBid(loadedProduct.currentBid || 0)
    }
  }, [id])

  useEffect(() => {
    if (!product?.endsAt) return

    const interval = setInterval(() => {
      const end = new Date(product.endsAt).getTime()
      const now = new Date().getTime()
      const diff = end - now

      if (diff <= 0) {
        setTimeLeft('Auction ended')
        clearInterval(interval)
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${hours}h ${minutes}min ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [product?.endsAt])

  const handleBid = () => {
    const newBid = currentBid + 5
    setCurrentBid(newBid)
    setBidMessage(`Tarjouksesi ${newBid} € on hyväksytty!`)
    setTimeout(() => setBidMessage(''), 3000)
  }

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <main className="p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <div className="mb-4">
          <img
            src={`https://via.placeholder.com/600x400?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="rounded-lg shadow"
          />
        </div>

        <p className="text-xl text-gray-800 mb-2">{product.price}</p>

        {product.auction && (
          <>
            <p className="text-sm text-gray-600 mb-1">
              ⏱ Time left: <span className="font-semibold">{timeLeft}</span>
            </p>
            <p className="text-sm text-gray-800 mb-4">
              💰 Current bid: <span className="font-semibold">{currentBid} €</span>
            </p>
          </>
        )}

        <p className="text-gray-600 mb-4">
          Tämä on esittelyteksti tuotteelle {product.name}. Tänne voidaan lisätä tuotteen tarkempi kuvaus.
        </p>

        {bidMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {bidMessage}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {product.buyNow && (
            <button className="bg-blue-500 text-white px-6 py-2 rounded">
              Buy Now
            </button>
          )}
          {product.auction && timeLeft !== 'Auction ended' && (
            <button
              onClick={handleBid}
              className="bg-yellow-500 text-white px-6 py-2 rounded"
            >
              Bid +5 €
            </button>
          )}
        </div>

        {(product.pickupAvailable || product.deliveryAvailable) && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Toimitus / Nouto</h3>

            {product.pickupAvailable && (
              <p className="mb-1">📍 Nouto: {product.pickupLocation || 'Paikka ilmoitetaan myöhemmin'}</p>
            )}

            {product.deliveryAvailable && (
              <p className="mb-1">📦 Toimitus: {product.deliveryCost || 'Toimituskulu ilmoitetaan'} €</p>
            )}
          </div>
        )}

        <a href="/" className="text-blue-600 underline block mt-6">
          ← Takaisin etusivulle
        </a>
      </div>
    </main>
  )
}
