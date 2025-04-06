type Props = {
  name: string;
  price: string;
  buyNow?: boolean;
  auction?: boolean;
};

export default function ProductCard({ name, price, buyNow, auction }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-700 mb-2">{price}</p>
      {buyNow && <button className="bg-blue-500 text-white px-4 py-2 rounded">Buy Now</button>}
      {auction && <button className="bg-yellow-500 text-white px-4 py-2 rounded">Bid</button>}
    </div>
  );
}
