import { useEffect, useState } from 'react'
import Header from '../components/Header'

type Product = {
  id: number
  name: string
  price: string
  buyNow?: boolean
  auction?: boolean
}

export default function SalesPage() {
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)
  const [soldIds, setSoldIds] = useState<number[]>([])
  const [deliveryChoices, setDeliveryChoices] = useState<Record<number, string>>({})
  const [messages, setMessages] = useState<Record<number, string[]>>({})
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const username = localStorage.getItem('mauktion-username')
    if (username) setUserName(username)

    const stored = localStorage.getItem('mauktion-added-product')
    if (stored) setAddedProduct(JSON.parse(stored))

    const sold = localStorage.getItem('mauktion-sold-products')
    if (sold) setSoldIds(JSON.parse(sold))

    const choices: Record<number, string> = {}
    const msgs: Record<number, string[]> = {}

    for (const key in localStorage) {
      if (key.startsWith('deliveryChoice-')) {
        const productId = Number(key.split('-')[1])
        choices[productId] = localStorage.getItem(key) || ''
      }
      if (key.startsWith('messages-')) {
        const productId = Number(key.split('-')[1])
        const storedMessages = localStorage.getItem(key)
        if (storedMessages) msgs[productId] = JSON.parse(storedMessages)
      }
    }

    setDeliveryChoices(choices)
    setMessages(msgs)
  }, [])

  return (
    <>
      <Header />
      <main className="p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Myyntihistoria</h1>

        {userName && (
          <p className="mb-4 text-gray-600">Käyttäjä: <strong>{userName}</strong></p>
        )}

        {!addedProduct ? (
          <p>Et ole lisännyt yhtään tuotetta.</p>
        ) : (
          <div className="border rounded-xl p-4 shadow mb-4">
            <h2 className="text-xl font-semibold">{addedProduct.name}</h2>
            <p className="text-gray-700 mb-2">Hinta: {addedProduct.price}</p>

            {soldIds.includes(addedProduct.id) ? (
              <div className="text-green-600 mb-2">✅ Tuote on myyty</div>
            ) : (
              <div className="text-yellow-600 mb-2">⏳ Tuote ei ole vielä myyty</div>
            )}

            {deliveryChoices[addedProduct.id] && (
              <p>🚚 Ostaja valitsi toimitustavaksi: <strong>{deliveryChoices[addedProduct.id] === 'delivery' ? 'Toimitus' : 'Nouto'}</strong></p>
            )}

            {messages[addedProduct.id] && (
              <div className="mt-4">
                <h3 className="font-semibold">📩 Viestit ostajalta:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {messages[addedProduct.id].map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  )
}
