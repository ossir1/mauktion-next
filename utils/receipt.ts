import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Product } from '../types'
import { v4 as uuidv4 } from 'uuid'

export function generateReceipt(product: Product, buyerName: string = 'Asiakas') {
  const doc = new jsPDF()
  const receiptId = uuidv4().split('-')[0].toUpperCase()
  const date = new Date().toLocaleString()

  const vatAmount = parseFloat(product.vatAmount || '0')
  const basePrice = parseFloat(product.price) - vatAmount
  const totalPrice = parseFloat(product.price)

  // Otsikko ja perustiedot
  doc.setFontSize(18)
  doc.text('Mauktion – Myyntikuitti', 14, 20)

  doc.setFontSize(11)
  doc.text(`Kuittinumero: ${receiptId}`, 14, 30)
  doc.text(`Ostaja: ${buyerName}`, 14, 36)
  doc.text(`Päivämäärä: ${date}`, 14, 42)

  // Tuotetaulukko
  autoTable(doc, {
    startY: 50,
    head: [['Tuote', 'Määrä', 'Yksikköhinta', 'ALV %', 'ALV €', 'Yhteensä']],
    body: [
      [
        product.name,
        '1',
        `${basePrice.toFixed(2)} €`,
        product.vatRate || '24%',
        `${vatAmount.toFixed(2)} €`,
        `${totalPrice.toFixed(2)} €`
      ]
    ]
  })

  // Viite ja kiitos
  doc.text(`Viitenumero: ${receiptId}`, 14, doc.lastAutoTable.finalY + 10)
  doc.setFontSize(10)
  doc.text('Kiitos ostoksestasi Mauktionissa!', 14, doc.lastAutoTable.finalY + 20)

  // Lataa PDF
  doc.save('kuitti_mauktion.pdf')
}
