import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { Product } from '@/types';

export async function generateReceipt(product: Product, buyerName: string = 'Asiakas') {
  const doc = new jsPDF();
  const receiptId = uuidv4().slice(0, 8); // Lyhyempi kuittinumero
  const purchaseDate = new Date().toLocaleString();

  // Otsikko
  doc.setFontSize(16);
  doc.text('Ostokuitti', 14, 20);

  // Perustiedot
  doc.setFontSize(12);
  doc.text(`Kuittinumero: ${receiptId}`, 14, 30);
  doc.text(`Ostaja: ${buyerName}`, 14, 38);
  doc.text(`Päivämäärä: ${purchaseDate}`, 14, 46);

  // Tuotetiedot rivitaulukkona
  autoTable(doc, {
    head: [['Tuote', 'Hinta (sis. ALV)', 'ALV-%', 'ALV (€)']],
    body: [
      [
        product.name,
        product.price,
        product.vatRate || '24%',
        product.vatAmount || '0 €',
      ],
    ],
    startY: 55,
  });

  // Maksutiedot
  const finalY = (doc as any).lastAutoTable.finalY || 70;
  doc.setFontSize(12);
  doc.text('Maksutiedot:', 14, finalY + 10);
  doc.setFontSize(10);
  doc.text('Tilinumero: FI12 3456 7890 1234 56', 14, finalY + 16);
  doc.text('Saaja: Mauktion Oy', 14, finalY + 22);
  doc.text(`Viitenumero: 1234567890`, 14, finalY + 28);

  // Linkki kuittiin
  doc.setFontSize(10);
  doc.textWithLink('Kuittilinkki: https://mauktion.com/kuitti/' + receiptId, 14, finalY + 36, {
    url: `https://mauktion.com/kuitti/${receiptId}`,
  });

  // Kiitosviesti
  doc.setFontSize(11);
  doc.text('Kiitos ostoksestasi Mauktionissa!', 14, finalY + 46);

  // QR-koodi (sisältää tiivistettynä tuotteen, hinnan ja kuittinumeron)
  const qrText = `Tuote: ${product.name}\nHinta: ${product.price}\nKuittinumero: ${receiptId}`;
  const qrDataUrl = await QRCode.toDataURL(qrText);
  doc.addImage(qrDataUrl, 'PNG', 140, 20, 50, 50);

  // Tallenna tiedosto
  doc.save(`kuitti-${receiptId}.pdf`);
}
