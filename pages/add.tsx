import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type NewProduct = {
  id: number
  name: string
  price: string
  buyNow: boolean
  auction: boolean
  endsAt?: string
  pickupAvailable?: boolean
  pickupLocation?: string
  deliveryAvailable?: boolean
  deliveryCost?: string
  vatRate?: string
  vatAmount?: string
}

export default function AddProduct() {
  const router = useRouter()

  const [form, setForm] = useState<NewProduct>({
    id: Date.now(),
    name: '',
    price: '',
    buyNow: false,
    auction: false,
    endsAt: '',
    pickupAvailable: false,
    pickupLocation: '',
    deliveryAvailable: false,
    deliveryCost: '',
    vatRate: '24',
    vatAmount: '0'
  })

  // 🔐 Tarkistetaan onko käyttäjä kirjautunut
  useEffect(() => {
    const user = localStorage.getItem('mauktion-user')
    if (!user) {
      router.push('/login')
    }
  }, [])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()

    const vatRate = parseFloat(form.vatRate || '24')
    const priceNumber = parseFloat(form.price || '0')
    const priceExVat = priceNumber / (1 + vatRate / 100)
    const vatAmount = priceNumber - priceExVat

    const finalProduct = {
      ...form,
      vatRate: vatRate.toString(),
      vatAmount: vatAmount.toFixed(2)
    }

    const existing = localStorage.getItem('mauktion-added-products')
    const all = existing ? JSON.parse(existing) : []
    all.push(finalProduct)
    localStorage.setItem('mauktion-added-products', JSON.stringify(all))

    router.push('/')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lisää uusi tuote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Nimi</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div>
          <label className="block font-medium">Hinta (€)</label>
          <input name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" required />
        </div>

        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="buyNow" checked={form.buyNow} onChange={handleChange} />
            Buy Now
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="auction" checked={form.auction} onChange={handleChange} />
            Auction
          </label>
        </div>

        {form.auction && (
          <div>
            <label className="block font-medium">Päättymisaika</label>
            <input
              type="datetime-local"
              name="endsAt"
              value={form.endsAt}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        )}

        <div className="pt-4 border-t">
          <h2 className="font-semibold mb-2">Toimitus / Nouto</h2>

          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="pickupAvailable" checked={form.pickupAvailable} onChange={handleChange} />
            Nouto mahdollinen
          </label>

          {form.pickupAvailable && (
            <div className="mb-2">
              <label className="block text-sm font-medium">Noutopaikka</label>
              <input
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          )}

          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="deliveryAvailable" checked={form.deliveryAvailable} onChange={handleChange} />
            Toimitus mahdollinen
          </label>

          {form.deliveryAvailable && (
            <div>
              <label className="block text-sm font-medium">Toimituskulut (€)</label>
              <input
                name="deliveryCost"
                value={form.deliveryCost}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <label className="block font-medium">ALV-%</label>
          <input
            name="vatRate"
            value={form.vatRate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button className="bg-green-600 text-white px-6 py-2 rounded" type="submit">
          Lisää tuote
        </button>
      </form>
    </main>
  )
}
