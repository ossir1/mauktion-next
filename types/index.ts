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
  rating: number;
  comment: string;
  reviewer: string; // käyttäjän nimi, joka kirjoitti arvostelun
  target: string;   // käyttäjän nimi, jota arvostelu koskee
};
