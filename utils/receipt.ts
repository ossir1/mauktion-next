import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { Product } from '../types'

export async function generateReceipt(product: Product, buyerName = 'Asiakas') {
  const doc = new jsPDF()
  const receiptId = uuidv4().slice(0, 8).toUpperCase()

  doc.setFontSize(16)
  doc.text('Ostokuitti', 14, 20)

  doc.setFontSize(12)
  doc.text(`Kuittinumero: ${receiptId}`, 14, 30)
  doc.text(`Ostaja: ${buyerName}`, 14, 38)
  doc.text(`Tuote: ${product.name}`, 14, 46)
  doc.text(`Hinta: ${product.price} €`, 14, 54)

  if (product.vatRate && product.vatAmount) {
    doc.text(`ALV (${product.vatRate}): ${product.vatAmount} €`, 14, 62)
  }

  // Lisää taulukko (ammattimainen tyyli)
  autoTable(doc, {
    startY: 70,
    head: [['Tuote', 'Hinta (sis. ALV)', 'ALV']],
    body: [
      [product.name, `${product.price} €`, `${product.vatRate || '24%'} (${product.vatAmount || '0'} €)`]
    ]
  })

  // Lisää viitenumero ja kiitosteksti QR-koodin alapuolelle
  const finalY = (doc as any).lastAutoTable?.finalY || 90
  doc.setFontSize(12)
  doc.text(`Viitenumero: ${receiptId}`, 14, finalY + 10)
  doc.setFontSize(10)
  doc.text('Kiitos ostoksestasi Mauktionissa!', 14, finalY + 18)

  // Luo QR-koodi verkkolinkillä tai tilaustiedoilla
  const qrContent = `Mauktion ostokuitti\nKuitti: ${receiptId}\nTuote: ${product.name}\nHinta: ${product.price} €`
  const qrImage = await QRCode.toDataURL(qrContent)
  doc.addImage(qrImage, 'PNG', 150, 20, 40, 40)

  doc.save(`kuitti_${receiptId}.pdf`)
}
