import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Product, Purchase, Review } from '../types';
import { generateReceipt } from '../utils/receipt';

export default function ProfilePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [company, setCompany] = useState('');
  const [lockedFields, setLockedFields] = useState<{ [key: string]: boolean }>({});

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sales, setSales] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored) {
      const parsed = JSON.parse(stored);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setPhone(parsed.phone || '');
      setAddress(parsed.address || '');
      setCompany(parsed.company || '');
      setLockedFields(parsed.lockedFields || {});
    }

    const dummyPurchases: Purchase[] = [
      { id: '1', productId: '123', productName: 'Demo-tuote', price: 49.9, date: '2024-01-01' },
    ];
    setPurchases(dummyPurchases);

    const dummyReviews: Review[] = [
      { productId: '123', rating: 5, comment: 'Loistava tuote!' },
    ];
    setReviews(dummyReviews);

    const dummySales: Product[] = [
      { id: '1', name: 'Myyty tuote', price: 59.9, description: 'Kuvaus', condition: 'Käytetty', image: '', sellerName: 'Sinä' },
    ];
    setSales(dummySales);
  }, []);

  const handleSave = () => {
    const profile = { name, email, phone, address, company, lockedFields };
    localStorage.setItem('profile', JSON.stringify(profile));
    alert('Tiedot tallennettu!');
  };

  const lockField = (field: string) => {
    setLockedFields((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profiili</h1>

      <div className="space-y-4">
        <div>
          <label className="block font-medium">Nimi</label>
          <input
            disabled={lockedFields.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {!lockedFields.name && (
            <button onClick={() => lockField('name')} className="text-sm text-blue-600">Lukitse</button>
          )}
        </div>
        <div>
          <label className="block font-medium">Sähköposti</label>
          <input
            disabled={lockedFields.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {!lockedFields.email && (
            <button onClick={() => lockField('email')} className="text-sm text-blue-600">Lukitse</button>
          )}
        </div>
        <div>
          <label className="block font-medium">Puhelin</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Osoite</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Yritys (jos soveltuu)</label>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">
          Tallenna tiedot
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-2">Ostohistoria</h2>
        <ul className="list-disc pl-5">
          {purchases.map((purchase) => (
            <li key={purchase.id}>{purchase.productName} – {purchase.price}€ ({purchase.date})</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-2">Arvostelut</h2>
        <ul className="list-disc pl-5">
          {reviews.map((review, idx) => (
            <li key={idx}>Tuote {review.productId}: {review.rating} tähteä – "{review.comment}"</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-2">Myynnit</h2>
        <ul className="list-disc pl-5">
          {sales.map((sale) => (
            <li key={sale.id}>{sale.name} – {sale.price}€</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
