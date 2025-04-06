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

  // Arvostelu
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

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

    if (loadedProduct) setProduct(loadedProduct)

    const msgData = localStorage.getItem(`messages-${id}`)
    if (msgData) setSentMessages(JSON.parse(msgData))
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

  const handleSubmitReview = () => {
    const review = {
      productId: product.id,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString()
    }

    const existing = localStorage.getItem('mauktion-reviews')
    const reviews = existing ? JSON.parse(existing) : []
    reviews.push(review)
    localStorage.setItem('mauktion-reviews', JSON.stringify(reviews))
    setReviewSubmitted(true)
  }

  if (!product) return <div className="p-6">Tuotetta ei löytynyt.</div>

  return (
    <main className="p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl mb-2">Hinta: {product.price}</p>

        {!hasPurchased && product.buyNow && (
          <button
            onClick={handleBuyNow}
            className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
          >
            Osta heti
          </button>
        )}

        {hasPurchased && (
          <div className="mt-6 space-y-6 border-t pt-4">
            <div>
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
                  Nouto ({product.pickupLocation || 'sovitaan erikseen'})
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
                  Toimitus ({product.deliveryCost || 'kulut sovitaan'} €)
                </label>
              )}
            </div>

            {deliveryChoice && (
              <div>
                <h3 className="font-semibold mb-2">Viestisi myyjälle</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Lähetä viesti
                </button>
              </div>
            )}

            {/* Arvostelulomake */}
            {!reviewSubmitted && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Anna arvostelu tuotteesta</h3>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                  placeholder="Kirjoita kommentti..."
                />
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`px-3 py-1 border rounded ${
                        reviewRating === star ? 'bg-yellow-300' : ''
                      }`}
                    >
                      {star} ⭐
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitReview}
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                  Lähetä arvostelu
                </button>
              </div>
            )}

            {reviewSubmitted && (
              <p className="text-green-700 font-medium">
                Kiitos arvostelustasi!
              </p>
            )}
          </div>
        )}

        <a href="/" className="block mt-6 text-blue-600 underline">
          ← Takaisin etusivulle
        </a>
      </div>
    </main>
  )
}
