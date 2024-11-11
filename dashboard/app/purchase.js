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


// Validate Inputs 

function validatePhoneNumber (phoneNumber) {

    let phoneInput
    if (document.getElementById('phone-add')) {
        phoneInput = document.getElementById('phone-add')
    } else if (document.getElementById('phone-gift')) {
        phoneInput = document.getElementById('phone-add')
    } else {
        phoneInput = document.getElementById('phoneNumber')
    }
   
    const phonePattern = /^0\d{8}$/ // starts with 0 and is 9 digits
    if (!phonePattern.test(phoneNumber)) {
        phoneInput.style.borderColor = 'red'
        alert('El celular debe comenzar con 0 y tener 9 dígitos')
        valid = false
    } else {
        phoneInput.style.borderColor = ''
    }
  
}

// Upload Purchase
async function uploadPurchase (phoneNumber, amountSpentNow) {

    const client = await getClientByPhoneNumber(phoneNumber)

    if (client && client.currentBillies < 9) {
        
        validatePhoneNumber(phoneNumber)
        const amountSpentNowNum = parseFloat(amountSpentNow)
        if (isNaN(amountSpentNowNum)) {
            alert('Importe invalido:', amountSpentNow)
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
        alert(`Se ha agregado una billie: ${currentBillies}/9`)

        updates.currentBillies = currentBillies
        updates.totalBillies = totalBillies
        updates.totalSpent = totalExpenditure
        updates.averageExpenditure = averageExpenditure.toFixed(2)

        await updateClient(phoneNumber, updates)
        console.log('Se ha cargado la compra con exito!')

    } else if (client && client.currentBillies == 9) {
        alert(`${client.currentBillies}/9: El cliente debe reclamar su burger gratis`)
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
            alert(`${client.currentBillies}/9: El cliente reclamo un 15% de descuento`)

        } else if (client.currentBillies == 9 && client.giftAvailable == true) {
            updates.currentBillies = client.currentBillies - 9
            updates.discountAvailable = false
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