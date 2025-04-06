import jsPDF from 'jspdf'

export function generateReceipt(product: any, buyerName: string = 'Asiakas') {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Mauktion - Kuitti', 20, 20)

  doc.setFontSize(12)
  doc.text(`Tuote: ${product.name}`, 20, 40)
  doc.text(`Hinta: ${product.price}`, 20, 50)
  doc.text(`Ostaja: ${buyerName}`, 20, 60)
  doc.text(`Päivämäärä: ${new Date().toLocaleString()}`, 20, 70)

  // ALV-käsittely
  const vatRate = product.vatRate || '24%'
  const vatAmount = product.vatAmount || 'Lasketaan hinnasta'

  doc.text(`ALV: ${vatRate} (${vatAmount} €)`, 20, 80)

  doc.save(`kuitti-${product.id}.pdf`)
}
