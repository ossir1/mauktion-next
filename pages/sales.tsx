import { useEffect, useState } from 'react'
import { generateReceipt } from '../utils/receipt'

export default function Sales() {
  const [sales, setSales] = useState<any[]>([])

  useEffect(() => {
    const data = localStorage.getItem('mauktion-added-products')
    if (data) {
      const all = JSON.parse(data)
      const soldOnly = all.filter((p: any) => p.soldAt)
      setSales(soldOnly)
    }
  }, [])

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Myyntihistoria</h1>
      {sales.length === 0 && <p>Ei vielä myytyjä tuotteita.</p>}
      <ul className="space-y-4">
        {sales.map((item) => (
          <li key={item.id} className="border rounded p-4">
            <p className="font-semibold">{item.name}</p>
            <p>Hinta: {item.price}</p>
            <p>Myyty: {new Date(item.soldAt).toLocaleString()}</p>
            <p>ALV: {item.vatRate || '24%'} ({item.vatAmount || '0'} €)</p>
            <p>Toimitus: {item.deliveryAvailable ? 'Kyllä' : 'Ei'}, Nouto: {item.pickupAvailable ? 'Kyllä' : 'Ei'}</p>

            <button
              onClick={() => generateReceipt(item, 'Asiakas')}
              className="text-sm text-blue-600 underline mt-2"
            >
              Lataa kuitti PDF:nä
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
