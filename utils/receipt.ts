import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { v4 as uuidv4 } from 'uuid'
import QRCode from 'qrcode'
import { Product } from '../types'

export async function generateReceipt(product: Product, buyerName: string = 'Asiakas') {
  const doc = new jsPDF()
  const receiptId = uuidv4().slice(0, 8).toUpperCase()
  const date = new Date().toLocaleDateString()

  // Otsikko
  doc.setFontSize(18)
  doc.text('Myyntikuitti', 14, 20)

  // Ostajan ja tuotteen tiedot
  doc.setFontSize(12)
  doc.text(`Ostaja: ${buyerName}`, 14, 30)
  doc.text(`Päivämäärä: ${date}`, 14, 37)
  doc.text(`Tuote: ${product.name}`, 14, 44)
  doc.text(`Viitenumero: ${receiptId}`, 14, 51)

  // Ammattimainen taulukko
  const price = parseFloat(product.price)
  const vatRate = parseFloat(product.vatRate || '24')
  const vatAmount = price - price / (1 + vatRate / 100)
  const netPrice = price - vatAmount

  autoTable(doc, {
    startY: 60,
    head: [['Tuote', 'Veroton', 'ALV', 'Yhteensä']],
    body: [[
      product.name,
      `${netPrice.toFixed(2)} €`,
      `${vatAmount.toFixed(2)} €`,
      `${price.toFixed(2)} €`
    ]],
    theme: 'grid',
    headStyles: { fillColor: [22, 122, 255] },
  })

  const tableY = (doc as any).lastAutoTable.finalY || 80

  // Kiitosviesti
  doc.setFontSize(10)
  doc.text('Kiitos ostoksestasi Mauktionissa!', 14, tableY + 10)

  // QR-koodi linkille (esim. etusivulle tai tuotesivulle)
  const qrText = `https://mauktion.com/tuote/${product.id}`
  const qrDataUrl = await QRCode.toDataURL(qrText)

  doc.addImage(qrDataUrl, 'PNG', 150, tableY + 2, 40, 40)

  doc.save(`kuitti_${receiptId}.pdf`)
}
