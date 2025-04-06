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
        <h1 className="text-3xl font-bold mb-4">Welcome to Mauktion</h1>
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
