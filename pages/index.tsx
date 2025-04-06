import Head from 'next/head'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useEffect, useState } from 'react'

export default function Home() {
  const [allProducts, setAllProducts] = useState(products)

  useEffect(() => {
    const added = localStorage.getItem('mauktion-added-product')
    if (added) {
      const newProduct = JSON.parse(added)
      setAllProducts((prev) => [...prev, newProduct])
      localStorage.removeItem('mauktion-added-product')
    }
  }, [])

  return (
    <>
      <Head>
        <title>Mauktion Demo</title>
      </Head>
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <a href="/my-products" className="text-blue-600 underline mb-4 block">
            → Siirry omiin tuotteisiin
          </a>

          <h1 className="text-3xl font-bold">Welcome to Mauktion</h1>
          <a
            href="/add"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Lisää tuote
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              buyNow={product.buyNow}
              auction={product.auction}
            />
          ))}
        </div>
      </main>
    </>
  )
}
