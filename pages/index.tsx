import Head from 'next/head'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useEffect, useState } from 'react'

export default function Home() {
  const [allProducts, setAllProducts] = useState(products)

  useEffect(() => {
    const added = localStorage.getItem('mauktion-added-products')
    if (added) {
      const parsed = JSON.parse(added)
      setAllProducts([...products, ...parsed])
    } else {
      setAllProducts(products)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Mauktion</title>
      </Head>
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <a href="/my-products" className="text-blue-600 underline">→ Omat tuotteet</a>
          <h1 className="text-3xl font-bold">Tervetuloa Mauktioniin</h1>
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
