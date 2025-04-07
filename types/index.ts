export type Product = {
  id: number;
  name: string;
  price: string;
  buyNow: boolean;
  auction: boolean;
  endsAt?: string;
  pickupAvailable?: boolean;
  pickupLocation?: string;
  deliveryAvailable?: boolean;
  deliveryCost?: string;
  vatRate?: string;
  vatAmount?: string;
  soldAt?: string;
};

export type Review = {
  id: number;
  productId: number;
  productName: string; // ← tämä rivi puuttui!
  rating: number;
  comment: string;
  reviewer: string; // käyttäjän nimi, joka kirjoitti arvostelun
  target: string;   // käyttäjän nimi, jota arvostelu koskee
};

export type Purchase = Product & {
  buyer: string
  purchasedAt: string
}
