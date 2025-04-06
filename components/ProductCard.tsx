type Props = {
  id: number
  name: string
  price: string
  buyNow?: boolean
  auction?: boolean
  endsAt?: string
  pickupAvailable?: boolean
  pickupLocation?: string
  deliveryAvailable?: boolean
  deliveryCost?: string
  vatRate?: string
  vatAmount?: string
}

export default function ProductCard({
  id,
  name,
  price,
  buyNow,
  auction
}: Props) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-700 mb-2">{price}</p>
      {buyNow && (
        <a
          href={`/product/${id}`}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 inline-block"
        >
          Buy Now
        </a>
      )}
      {auction && (
        <a
          href={`/product/${id}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded inline-block"
        >
          Bid
        </a>
      )}
    </div>
  )
}
