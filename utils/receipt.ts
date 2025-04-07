import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types';
import QRCode from 'qrcode';

export async function generateReceipt(product: Product, buyerName = 'Asiakas') {
  const doc = new jsPDF();
  const receiptId = uuidv4().slice(0, 8).toUpperCase();
  const date = product.purchasedAt
    ? new Date(product.purchasedAt).toLocaleString()
    : new Date().toLocaleString();

  doc.setFontSize(18);
  doc.text('MAUKTION - Kuitti', 14, 20);

  doc.setFontSize(12);
  doc.text(`Kuitti-ID: ${receiptId}`, 14, 30);
  doc.text(`Ostopäivämäärä: ${date}`, 14, 38);

  // Myyjä
  doc.text('Myyjä:', 14, 48);
  doc.text(`${product.sellerName || 'Myyjä'}`, 14, 55);
  if (product.businessId) doc.text(`Y-tunnus: ${product.businessId}`, 14, 62);

  // Ostaja
  doc.text('Ostaja:', 120, 48);
  doc.text(`${buyerName}`, 120, 55);

  doc.text('Maksutapa: Verkkopankki', 14, 75);

  // Tuotetaulukko
  autoTable(doc, {
    startY: 85,
    head: [['Tuote', 'Hinta (€)', 'ALV-%', 'ALV (€)']],
    body: [
      [
        product.name,
        product.price,
        product.vatRate || '24',
        product.vatAmount || '-'
      ]
    ]
  });

  const finalY = (doc as any).lastAutoTable.finalY;

  // Profiililinkki
  if (product.sellerProfileLink) {
    doc.text('Katso myyjän profiili:', 14, finalY + 10);
    doc.textWithLink(product.sellerProfileLink, 14, finalY + 16, {
      url: product.sellerProfileLink
    });
  }

  // QR-koodi (sisältää esim. kuitti-ID:n tai URLin)
  const qrData = `Kuitti: ${receiptId}`;
  const qrImageUrl = await QRCode.toDataURL(qrData);
  doc.addImage(qrImageUrl, 'PNG', 140, finalY + 5, 40, 40);

  // Allekirjoitus ja kiitos
  doc.text('________________________', 14, finalY + 35);
  doc.text('Allekirjoitus (jos tulostetaan)', 14, finalY + 41);
  doc.setFontSize(10);
  doc.text('Kiitos ostoksestasi Mauktionissa!', 14, finalY + 55);

  // PDF tallennus nimellä
  doc.save(`kuitti_${receiptId}.pdf`);
}
