import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { products } from '../data/products'
import { generateReceipt } from '../utils/receipt'

export default function ConfirmationPage() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const staticProduct = products.find((p) => p.id === Number(id))
    let found = staticProduct

    if (!staticProduct && typeof window !== 'undefined') {
      const added = localStorage.getItem('mauktion-added-products')
      if (added) {
        const parsed = JSON.parse(added)
        found = parsed.find((p: any) => p.id === Number(id))
      }
    }

    if (found) setProduct(found)
  }, [id])

  return (
    <>
      <Header />
      <main className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Kiitos ostoksestasi!</h1>
        <p className="mb-6">Tuote on lisätty ostohistoriaasi.</p>

        {product && (
          <div className="border rounded-xl p-4 shadow text-left">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-700">Hinta: {product.price}</p>
            <p className="text-sm text-gray-500">ID: {product.id}</p>

            <button
              onClick={() => generateReceipt(product)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Lataa ostokuitti (PDF)
            </button>
          </div>
        )}

        <a href="/" className="mt-6 inline-block text-blue-600 underline">
          ← Palaa etusivulle
        </a>
      </main>
    </>
  )
}
