import jsPDF from 'jspdf'

export function generateReceipt(product: any, buyerName: string = 'Asiakas') {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text('Ostokuitti', 20, 20)

  doc.setFontSize(12)
  doc.text(`Tuotteen nimi: ${product.name}`, 20, 40)
  doc.text(`Hinta: ${product.price}`, 20, 50)
  doc.text(`Tuotetunniste: ${product.id}`, 20, 60)
  doc.text(`Päivämäärä: ${new Date().toLocaleDateString()}`, 20, 70)

  if (product.pickupAvailable || product.deliveryAvailable) {
    doc.text('Toimitustapa:', 20, 85)
    if (product.pickupAvailable)
      doc.text(`- Nouto (${product.pickupLocation || 'ei ilmoitettu'})`, 25, 95)
    if (product.deliveryAvailable)
      doc.text(`- Toimitus (${product.deliveryCost || 'kulut ei ilmoitettu'} €)`, 25, 105)
  }

  doc.text(`Asiakas: ${buyerName}`, 20, 125)

  doc.save(`kuitti_${product.id}.pdf`)
}
