import jsPDF from 'jspdf'

export function generateReceipt(product: any, buyerName: string = 'Asiakas', role: 'buyer' | 'seller' = 'buyer') {
  const doc = new jsPDF()
  const date = new Date().toLocaleString()

  const isSeller = role === 'seller'

  doc.setFontSize(16)
  doc.text(isSeller ? 'Myyntikuitti' : 'Ostokuitti', 20, 20)

  doc.setFontSize(12)
  doc.text(`Tuote: ${product.name}`, 20, 40)
  doc.text(`Hinta: ${product.price}`, 20, 50)
  doc.text(isSeller ? `Ostaja: ${buyerName}` : `Ostettu: ${date}`, 20, 60)
  doc.text(isSeller ? `Myyty: ${date}` : `Ostaja: ${buyerName}`, 20, 70)

  doc.save(`${isSeller ? 'myyntikuitti' : 'kuitti'}-${product.name}.pdf`)
}
