/* ------------------------------------------------------------------------------------------------- */
/* ---------------------------------------- UPLOAD PURCHASE ---------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Display Function
const functionHeader = document.getElementById('function-header')
const functionSelector = document.getElementById('function-selector')
const addInputs = document.getElementById('add-billy-inputs')
const claimInputs = document.getElementById('claim-gift-inputs')

function toggleInputs() {
    const selectedFunction = functionSelector.value
    console.log(selectedFunction)
    
    if (selectedFunction === 'add-billy') {
        functionHeader.innerHTML = 'Sumar Billy'
        addInputs.style.display = 'flex'
        claimInputs.style.display = 'none'
    } else if (selectedFunction === 'claim-gift') {
        functionHeader.innerHTML = 'Reclamar Regalo'
        addInputs.style.display = 'none'
        claimInputs.style.display = 'flex'
    }
}

functionSelector.addEventListener('change', toggleInputs)

toggleInputs()

function checkSelector () {
    return functionSelector.value
}

// Upload Purchase
async function uploadPurchase (phoneNumber, amountSpentNow) {

    const client = await getClientByPhoneNumber(phoneNumber)

    if (client) {
        
        const amountSpentNowNum = parseFloat(amountSpentNow)
        if (isNaN(amountSpentNowNum)) {
            console.error('Invalid amount spent:', amountSpentNow)
            return
        }

        const totalExpenditure = client.totalSpent + amountSpentNowNum

        let currentBillies = client.currentBillies + 1
        const totalBillies = client.totalBillies + 1

        let averageExpenditure

        if (totalBillies != 0) {
            averageExpenditure = totalExpenditure / totalBillies
        } else {
            averageExpenditure = 0
        }

        const updates = {}

        if (currentBillies == 4) {
            updates.discountAvailable = true
            sendFileEmail(client, 'discount')
        } else if (currentBillies == 9) {
            updates.giftAvailable = true
            sendFileEmail(client, 'gift')
        }
        alert(`Se ha agregado una billie: ${currentBillies}/10`)

        updates.currentBillies = currentBillies
        updates.totalBillies = totalBillies
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(phoneNumber, updates)
        console.log('Se ha cargado la compra con exito!')

    } else {
        alert('No se ha encontrado el cliente.')
    }

}

// Claim Gift
async function claimGift (phoneNumber) {

    phoneNumber = phoneNumber.trim()

    const client = await getClientByPhoneNumber(phoneNumber)

    console.log(client)

    if (client) {

        const updates = {}

        if (client.currentBillies >= 4 && client.discountAvailable == true) {
            updates.discountAvailable = false
            alert(`${client.currentBillies}/9: El cliente reclamo un 10% de descuento`)

        } else if (client.currentBillies == 9 && client.giftAvailable == true) {
            updates.currentBillies = client.currentBillies - 9
            updates.giftAvailable = false
            updates.claimedBillies = client.claimedBillies + 1
            alert(`${client.currentBillies}/9: El cliente reclamo una burger gratis`)

        } else {
            alert(`El cliente no tiene ningun regalo: ${client.currentBillies}/9`)
        }

        await updateClient(phoneNumber, updates)
        console.log('Se ha reclamado el regalo con exito!')

    } else {
        alert('No se ha encontrado el cliente.')
    }

}