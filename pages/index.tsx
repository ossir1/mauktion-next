import Head from 'next/head'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function Home() {
  return (
    <>
      <Head>
        <title>Mauktion Demo</title>
      </Head>
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to Mauktion</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
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
