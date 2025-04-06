import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: string
  buyNow?: boolean
  auction?: boolean
  pickupAvailable?: boolean
  deliveryAvailable?: boolean
  pickupLocation?: string
  deliveryCost?: string
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [soldIds, setSoldIds] = useState<number[]>([])
  const [deliveryChoices, setDeliveryChoices] = useState<Record<number, string>>({})
  const [messages, setMessages] = useState<Record<number, string[]>>({})

  useEffect(() => {
    // Ladataan myyjän lisäämät tuotteet localStoragesta
    const productStr = localStorage.getItem('mauktion-added-product')
    if (productStr) {
      const product = JSON.parse(productStr)
      setProducts([product]) // tällä hetkellä yksi tuote kerrallaan
    }

    // Ladataan ostetut tuotteet (simuloitu)
    const sold = localStorage.getItem('mauktion-sold-products')
    if (sold) {
      setSoldIds(JSON.parse(sold))
    }

    // Ladataan toimitusvalinnat
    const savedChoices: Record<number, string> = {}
    for (let key in localStorage) {
      if (key.startsWith('deliveryChoice-')) {
        const productId = Number(key.split('-')[1])
        savedChoices[productId] = localStorage.getItem(key) || ''
      }
    }
    setDeliveryChoices(savedChoices)

    // Ladataan viestit
    const msgData: Record<number, string[]> = {}
    for (let key in localStorage) {
      if (key.startsWith('messages-')) {
        const productId = Number(key.split('-')[1])
        const msgs = localStorage.getItem(key)
        if (msgs) msgData[productId] = JSON.parse(msgs)
      }
    }
    setMessages(msgData)
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Omat tuotteet</h1>

      {products.length === 0 ? (
        <p>Et ole vielä lisännyt tuotteita.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="border rounded-xl p-4 shadow mb-6">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700 mb-1">Hinta: {product.price}</p>

            {soldIds.includes(product.id) ? (
              <div className="mt-2 text-green-700 font-semibold">✅ Myyty</div>
            ) : (
              <div className="mt-2 text-yellow-700">⏳ Ei vielä myyty</div>
            )}

            {deliveryChoices[product.id] && (
              <p className="mt-2">
                🧾 Ostaja valitsi: <strong>{deliveryChoices[product.id] === 'delivery' ? 'Toimitus' : 'Nouto'}</strong>
              </p>
            )}

            {messages[product.id] && messages[product.id].length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold">📩 Viestit ostajalta:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {messages[product.id].map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))
      )}
    </main>
  )
}
