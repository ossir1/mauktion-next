import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { v4 as uuidv4 } from 'uuid'
import { Product } from '../types'

export function generateReceipt(product: Product, buyerName = 'Asiakas') {
  const doc = new jsPDF()
  const receiptId = uuidv4().slice(0, 8).toUpperCase()
  const date = new Date().toLocaleString()

  // Otsikko
  doc.setFontSize(18)
  doc.text('Ostokuitti', 14, 20)

  // Perustiedot
  doc.setFontSize(12)
  doc.text(`Kuitti-ID: ${receiptId}`, 14, 30)
  doc.text(`Päivämäärä: ${date}`, 14, 37)
  doc.text(`Ostaja: ${buyerName}`, 14, 44)

  // Tuotetiedot taulukkona
  const tableY = 55
  autoTable(doc, {
    startY: tableY,
    head: [['Tuote', 'Hinta (€)', 'ALV (%)', 'ALV (€)', 'Yhteensä']],
    body: [
      [
        product.name,
        product.price,
        product.vatRate || '24%',
        product.vatAmount || '0',
        `${parseFloat(product.price).toFixed(2)} €`
      ]
    ]
  })

  const table = (doc as any).lastAutoTable // workaround: päästään finalY:hin

  // Viite ja kiitos
  const footerY = table?.finalY ? table.finalY + 10 : tableY + 30
  doc.setFontSize(12)
  doc.text(`Viitenumero: ${receiptId}`, 14, footerY)
  doc.setFontSize(10)
  doc.text('Kiitos ostoksestasi Mauktionissa!', 14, footerY + 10)

  doc.save(`kuitti_${receiptId}.pdf`)
}
