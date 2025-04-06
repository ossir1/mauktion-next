import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { products } from '../../data/products'
import Header from '../../components/Header'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [currentBid, setCurrentBid] = useState(0)
  const [bidMessage, setBidMessage] = useState('')
  const [hasPurchased, setHasPurchased] = useState(false)
  const [deliveryChoice, setDeliveryChoice] = useState('')
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState<string[]>([])

  useEffect(() => {
    if (!id) return

    // Hae tuote ID:n perusteella
    const staticProduct = products.find((p) => p.id === Number(id))
    let loadedProduct = staticProduct

    if (!staticProduct && typeof window !== 'undefined') {
      const all = localStorage.getItem('mauktion-added-products')
      if (all) {
        const parsed = JSON.parse(all)
        loadedProduct = parsed.find((p: any) => p.id === Number(id))
      }
    }

    if (loadedProduct) {
      setProduct(loadedProduct)
      setCurrentBid(loadedProduct.currentBid || 0)
    }

    if (typeof window !== 'undefined') {
      const msgData = localStorage.getItem(`messages-${id}`)
      if (msgData) {
        setSentMessages(JSON.parse(msgData))
      }

      const soldIds = JSON.parse(localStorage.getItem('mauktion-sold-products') || '[]')
      if (soldIds.includes(Number(id))) {
        setHasPurchased(true)
      }
    }
  }, [id])

  // Countdown ajastin
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
        const h = Math.floor(diff / (1000 * 60 * 60))
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const s = Math.floor((diff % (1000 * 60)) / 1000)
        setTimeLeft(`${h}h ${m}min ${s}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [product?.endsAt])

  const handleBid = () => {
    const newBid = currentBid + 5
    setCurrentBid(newBid)
    setBidMessage(`Tarjouksesi ${newBid} € on hyväksytty!`)
    setTimeout(() => setBidMessage(''), 3000)
    // Simuloidaan että voitti huutokaupan
    setHasPurchased(true)
    markAsSold()
  }

  const handleBuyNow = () => {
    if (!product) return

    const existing = localStorage.getItem('mauktion-purchases')
    const purchases = existing ? JSON.parse(existing) : []
    purchases.push(product)
    localStorage.setItem('mauktion-purchases', JSON.stringify(purchases))

    markAsSold()
    setHasPurchased(true)
  }

  const markAsSold = () => {
    const sold = localStorage.getItem('mauktion-sold-products')
    const soldIds = sold ? JSON.parse(sold) : []
    if (!soldIds.includes(product.id)) {
      soldIds.push(product.id)
      localStorage.setItem('mauktion-sold-products', JSON.stringify(soldIds))
    }
  }

  const handleDeliveryChoice = (value: string) => {
    setDeliveryChoice(value)
    const msg =
      value === 'delivery'
        ? 'Hei! Ostin tuotteen ja valitsin toimituksen. Voitko vahvistaa aikataulun?'
        : 'Hei! Ostin tuotteen ja valitsin noudon. Voimmeko sopia ajan ja paikan?'
    setMessage(msg)
    localStorage.setItem(`deliveryChoice-${id}`, value)
  }

  const handleSendMessage = () => {
    const newMessages = [...sentMessages, message]
    setSentMessages(newMessages)
    localStorage.setItem(`messages-${id}`, JSON.stringify(newMessages))
    setMessage('')
  }

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <>
      <Header />
      <main className="p-6 max-w-3xl mx-auto">
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

        {bidMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
            {bidMessage}
          </div>
        )}

        {!hasPurchased && (
          <div className="flex gap-4 mb-6">
            {product.buyNow && (
              <button
                onClick={handleBuyNow}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
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
        )}

        {hasPurchased && (
          <>
            {/* Toimitusvalinta */}
            <div className="mb-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Valitse toimitustapa:</h3>
              {product.pickupAvailable && (
                <label className="block mb-2">
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    onChange={() => handleDeliveryChoice('pickup')}
                    checked={deliveryChoice === 'pickup'}
                    className="mr-2"
                  />
                  Nouto ({product.pickupLocation || 'osoite ilmoitetaan myöhemmin'})
                </label>
              )}
              {product.deliveryAvailable && (
                <label className="block mb-2">
                  <input
                    type="radio"
                    name="delivery"
                    value="delivery"
                    onChange={() => handleDeliveryChoice('delivery')}
                    checked={deliveryChoice === 'delivery'}
                    className="mr-2"
                  />
                  Toimitus ({product.deliveryCost || 'kulut ilmoitetaan'} €)
                </label>
              )}
            </div>

            {/* Viestit */}
            {deliveryChoice && (
              <div className="mb-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Lähetä viesti myyjälle</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Lähetä viesti
                </button>
              </div>
            )}

            {sentMessages.length > 0 && (
              <div className="mb-6 border-t pt-4">
                <h3 className="font-semibold mb-2">Viestihistoria</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {sentMessages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <a href="/" className="text-blue-600 underline block mt-6">
          ← Takaisin etusivulle
        </a>
      </main>
    </>
  )
}
