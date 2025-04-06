import { useRouter } from 'next/router'
import { products } from '../../data/products'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query

  const [product, setProduct] = useState<any>(null)
  const [hasPurchased, setHasPurchased] = useState(false)
  const [deliveryChoice, setDeliveryChoice] = useState('')
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState<string[]>([])

  useEffect(() => {
    if (!id) return

    const staticProduct = products.find((p) => p.id === Number(id))
    let loadedProduct = staticProduct

    if (!staticProduct && typeof window !== 'undefined') {
      const added = localStorage.getItem('mauktion-added-products')
      if (added) {
        const parsed = JSON.parse(added)
        loadedProduct = parsed.find((p: any) => p.id === Number(id))
      }
    }

    if (loadedProduct) {
      setProduct(loadedProduct)
    }

    if (typeof window !== 'undefined') {
      const msgData = localStorage.getItem(`messages-${id}`)
      if (msgData) {
        setSentMessages(JSON.parse(msgData))
      }
    }
  }, [id])

  const handleBuyNow = () => {
    if (!product) return
    setHasPurchased(true)

    const soldAt = new Date().toISOString()
    const updatedProduct = { ...product, soldAt }

    const existing = localStorage.getItem('mauktion-purchases')
    const history = existing ? JSON.parse(existing) : []
    history.push({ ...updatedProduct, buyer: 'Asiakas', purchasedAt: soldAt })
    localStorage.setItem('mauktion-purchases', JSON.stringify(history))

    const all = localStorage.getItem('mauktion-added-products')
    if (all) {
      const parsed = JSON.parse(all)
      const updatedList = parsed.map((p: any) =>
        p.id === product.id ? { ...p, soldAt } : p
      )
      localStorage.setItem('mauktion-added-products', JSON.stringify(updatedList))
    }
  }

  const handleDeliveryChoice = (value: string) => {
    setDeliveryChoice(value)
    setMessage(
      value === 'delivery'
        ? 'Hei! Ostin tuotteen ja valitsin toimituksen.'
        : 'Hei! Ostin tuotteen ja valitsin noudon.'
    )
  }

  const handleSendMessage = () => {
    const newMessages = [...sentMessages, message]
    setSentMessages(newMessages)
    localStorage.setItem(`messages-${id}`, JSON.stringify(newMessages))
    setMessage('')
  }

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <main className="p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl text-gray-800 mb-2">Hinta: {product.price}</p>
        <p className="text-sm text-gray-600">ALV: {product.vatRate || '24%'} ({product.vatAmount || '0'} €)</p>

        {!hasPurchased && product.buyNow && (
          <button
            onClick={handleBuyNow}
            className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
          >
            Osta heti
          </button>
        )}

        {hasPurchased && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-2">Valitse toimitustapa:</h3>
            {product.pickupAvailable && (
              <label className="block">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryChoice === 'pickup'}
                  onChange={() => handleDeliveryChoice('pickup')}
                  className="mr-2"
                />
                Nouto – {product.pickupLocation || 'sovitaan erikseen'}
              </label>
            )}
            {product.deliveryAvailable && (
              <label className="block">
                <input
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={deliveryChoice === 'delivery'}
                  onChange={() => handleDeliveryChoice('delivery')}
                  className="mr-2"
                />
                Toimitus – {product.deliveryCost || 'kulut sovitaan'} €
              </label>
            )}
          </div>
        )}

        {hasPurchased && deliveryChoice && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Lähetä viesti myyjälle</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
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

        <a href="/" className="block mt-6 text-blue-600 underline">
          ← Takaisin etusivulle
        </a>
      </div>
    </main>
  )
}
