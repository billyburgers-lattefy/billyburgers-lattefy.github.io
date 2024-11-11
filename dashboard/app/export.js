/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- DOWNLOAD DATA ------------------------------------------ */
/* --------------------------------------------------------------------------------------------------*/

// Convert clients data to PDF format including insights
function convertToPDF(clients) {

    // Calculate insights
    const clientCount = clients.length
    const currentBillies = clients.reduce((sum, client) => sum + client.currentBillies, 0)
    const claimedBillies = clients.reduce((sum, client) => sum + client.claimedBillies, 0)
    const totalProfit = clients.reduce((sum, client) => sum + client.totalSpent, 0).toFixed(2)
    const overallAverageExpenditure = (clients.reduce((sum, client) => sum + client.averageExpenditure, 0) / clientCount).toFixed(2)
  
    // Initialize jsPDF
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()
  
    // Add title
    doc.setFontSize(18)
    doc.text('Info. Billy Burgers', 105, 20, null, null, 'center')
  
    // Add insights
    doc.setFontSize(12)
    doc.text('Estadisticas - clientes', 20, 30)
    doc.text(`Cantidad de clientes: ${clientCount}`, 20, 40)
    doc.text(`Billies en circulacion: ${currentBillies}`, 20, 50)
    doc.text(`Tarjetas reclamadas: ${claimedBillies}`, 20, 60)
    doc.text(`Facturacion: $${totalProfit}`, 20, 70)
    doc.text(`Consumo Promedio: $${overallAverageExpenditure}`, 20, 90)
  
    // Return the PDF document
    return doc
}
  
// Convert clients data to CSV format
function convertToCSV(clients) {
    const headers = [
        'Nombre', 'Email', 'Celular', 'Fecha de Emision', 'Inicios de sesion',
        'Descuento disponible', 'Regalo disponible', 'Billies actuales',
        'Billies totales', 'Tarjetas completas', 'Consumo promedio', 'Consumo total'
    ]

    const csvRows = [headers.join(',')]

    clients.forEach(client => {
    const row = [
        client.name, client.email, client.phoneNumber, client.startDate, 
        client.logCount, client.discountAvailable, client.giftAvailable,
        client.currentBillies, client.totalBillies, client.claimedBillies, 
        client.averageExpenditure, client.totalSpent
    ].join(',')

    csvRows.push(row)
    })

    return csvRows.join('\n')
}
  
// Function to trigger download of PDF file
function downloadPDF(clients) {
    const doc = convertToPDF(clients)
    doc.save('clients_insights.pdf')
}

// Function to trigger download of CSV file
function downloadCSV(clients) {
    const csvContent = convertToCSV(clients)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'clients_data.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
  
// Function to trigger download of PDF file
function downloadPDF(clients) {
    const doc = convertToPDF(clients)
    const blob = doc.output('blob') // Convert the PDF to a Blob
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'clients_insights.pdf')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up the URL object after the download
}
  