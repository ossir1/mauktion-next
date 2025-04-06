import { useState } from 'react'
import { useRouter } from 'next/router'

export default function AddProduct() {
  const router = useRouter()
  const [form, setForm] = useState({
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
    vatRate: '24'
  })

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const vatPercent = parseFloat(form.vatRate)
    const netto = parseFloat(form.price) / (1 + vatPercent / 100)
    const vatAmount = parseFloat(form.price) - netto

    const newProduct = {
      ...form,
      id: Date.now(),
      vatRate: `${vatPercent}%`,
      vatAmount: vatAmount.toFixed(2)
    }

    const existing = localStorage.getItem('mauktion-added-products')
    const list = existing ? JSON.parse(existing) : []
    list.push(newProduct)
    localStorage.setItem('mauktion-added-products', JSON.stringify(list))
    router.push('/')
  }

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lisää uusi tuote</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Tuotteen nimi" value={form.name} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="price" placeholder="Hinta (€)" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" required />

        <label className="block">ALV-prosentti</label>
        <select name="vatRate" value={form.vatRate} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="24">24%</option>
          <option value="14">14%</option>
          <option value="10">10%</option>
          <option value="0">0%</option>
        </select>

        <label><input type="checkbox" name="buyNow" checked={form.buyNow} onChange={handleChange} /> Buy Now</label>
        <label><input type="checkbox" name="auction" checked={form.auction} onChange={handleChange} /> Auction</label>

        {form.auction && (
          <input type="datetime-local" name="endsAt" value={form.endsAt} onChange={handleChange} className="w-full border p-2 rounded" />
        )}

        <label><input type="checkbox" name="pickupAvailable" checked={form.pickupAvailable} onChange={handleChange} /> Nouto mahdollinen</label>
        {form.pickupAvailable && (
          <input name="pickupLocation" placeholder="Noutopaikka" value={form.pickupLocation} onChange={handleChange} className="w-full border p-2 rounded" />
        )}

        <label><input type="checkbox" name="deliveryAvailable" checked={form.deliveryAvailable} onChange={handleChange} /> Toimitus mahdollinen</label>
        {form.deliveryAvailable && (
          <input name="deliveryCost" placeholder="Toimituskulut (€)" value={form.deliveryCost} onChange={handleChange} className="w-full border p-2 rounded" />
        )}

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">Lisää tuote</button>
      </form>
    </main>
  )
}
