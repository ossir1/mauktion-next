import Head from 'next/head'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'
import { useEffect, useState } from 'react'

export default function Home() {
  const [allProducts, setAllProducts] = useState(products)

  useEffect(() => {
    const added = localStorage.getItem('mauktion-added-products')
    if (added) {
      const newProducts = JSON.parse(added)
      setAllProducts([...products, ...newProducts])
    }
  }, [])

  return (
    <>
      <Head>
        <title>Mauktion</title>
      </Head>
      <Header />
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
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
