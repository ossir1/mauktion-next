// utils/receipt.ts
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import QRCode from 'qrcode'
import { v4 as uuidv4 } from 'uuid'

interface ReceiptData {
  date: string
  product: string
  price: string
  buyer: string
  email?: string
  address?: string
  phone?: string
  company?: string
  businessId?: string
  logoUrl?: string
}

export async function generateReceipt(data: ReceiptData) {
  const doc = new jsPDF()
  const receiptId = uuidv4().split('-')[0]

  // Logo (optional)
  if (data.logoUrl) {
    try {
      const imageData = await loadImageAsBase64(data.logoUrl)
      doc.addImage(imageData, 'PNG', 140, 10, 50, 20)
    } catch (error) {
      console.error('Logon lataus epäonnistui:', error)
    }
  }

  doc.setFontSize(16)
  doc.text('KUITTI', 14, 20)

  doc.setFontSize(12)
  doc.text(`Kuittinumero: ${receiptId}`, 14, 30)
  doc.text(`Päivämäärä: ${data.date}`, 14, 36)

  autoTable(doc, {
    startY: 50,
    head: [['Tuote', 'Hinta']],
    body: [[data.product, data.price]],
    theme: 'striped'
  })

  let y = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(12)
  doc.text('Ostajan tiedot:', 14, y)

  const lines = [
    `Nimi: ${data.buyer}`,
    data.email ? `Sähköposti: ${data.email}` : null,
    data.address ? `Osoite: ${data.address}` : null,
    data.phone ? `Puhelin: ${data.phone}` : null,
    data.company ? `Yritys: ${data.company}` : null,
    data.businessId ? `Y-tunnus: ${data.businessId}` : null
  ].filter(Boolean) as string[]

  lines.forEach((line, i) => doc.text(line, 14, y + 8 + i * 6))

  // QR-koodi
  const qrText = `Kuitti #${receiptId} - ${data.product} - ${data.price}`
  const qrImage = await QRCode.toDataURL(qrText)
  doc.addImage(qrImage, 'PNG', 150, y, 40, 40)

  doc.save(`kuitti_${receiptId}.pdf`)
}

async function loadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject('Invalid image format')
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
