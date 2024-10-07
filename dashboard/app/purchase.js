/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Upload Purchase
async function uploadPurchase(cedula, amountSpentNow) {

    const clients =  await getAll('clients')
    const client = getClientByCedula(clients, cedula)

    if (client) {
        
        const amountSpentNowNum = parseFloat(amountSpentNow)
        if (isNaN(amountSpentNowNum)) {
            console.error('Invalid amount spent:', amountSpentNow)
            return
        }

        const totalExpenditure = client.totalSpent + amountSpentNowNum
        // const discountsClaimed = client.discountsClaimed + 1

        const currentBillies = client.currentBillies + 1
        const totalBillies = client.totalBillies + 1

        let averageExpenditure

        if (totalBillies != 0) {
            averageExpenditure = totalExpenditure / totalBillies
        } else {
            averageExpenditure = 0
        }

        const updates = {}

        if (currentBillies == 5) {
            alert('El cliente tiene 10% de descuento')
        } else if (currentBillies == 10) {
            updates.claimedBillies = client.claimedBillies + 1
            alert('El cliente tiene una burger de regalo')
        } else {
            alert(`Se ha agregado una billie: ${currentBillies}/10`)
        }

        updates.currentBillies = currentBillies
        updates.totalBillies = totalBillies
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(cedula, updates)
        console.log('Se ha cargado la compra con exito!')

    } else {
        alert('No se ha encontrado el cliente.')
    }

}