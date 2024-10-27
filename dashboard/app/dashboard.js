// Billy Burgers - Fidelity Card | Dashboard


/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3087'
const apiUrl = 'https://backend-nqez.onrender.com'

// // Fetch all clients
// async function getAll(database) {
//   try {
//     const response = await fetch(`${apiUrl}/${database}`)
//     if (!response.ok) throw new Error('Network response was not ok')
//     return await response.json()
//   } catch (error) {
//     console.error(`Error fetching ${database}:`, error)
//     return []
//   }
// }

// Fetch all clients with auth
async function getAll(database) {
  try {
    const token = sessionStorage.getItem('authToken') // Retrieve the token from session storage
    const response = await fetch(`${apiUrl}/${database}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${database}:`, error)
    return []
  }
}


// Authenticate phoneNumber
async function AuthenticatePhoneNumber(phoneNumber) {
  const clients = await getAll('clients');
  console.log('Existing clients:', clients);
  return !clients.some(client => client.phoneNumber === phoneNumber);
}

// Get client by phone
async function getClientByPhoneNumber(phoneNumber) {
  try {
    const response = await fetch(`${apiUrl}/clients`)
    if (!response.ok) throw new Error('Network response was not ok')
    const clients = await response.json()
    return clients.find(client => client.phoneNumber === phoneNumber)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return null
  }
}

// Update client
async function updateClient(phoneNumber, updates) {
  try {
    const response = await fetch(`${apiUrl}/clients/${phoneNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    const data = await response.json()
    console.log('Client updated:', data)
  } catch (error) {
    console.error('Error updating client:', error)
  }
}



/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- LOAD FUNCTIONS ----------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {

  // auth
  if (!localStorage.getItem('accessToken')) {
    authLogin()
  } else {
    auth()
  }

  const clients = await getAll('clients')

  // Loader
  if (
    document.getElementById('dashboard') || 
    document.getElementById('clients') ||
    document.getElementById('stats') ||
    document.getElementById('campaigns') ||
    document.getElementById('download')
  ) {
    var loader = document.getElementById("loader")
    loader.style.display = "none"
  }

  // Dashboard
  if (document.getElementById('dashboard')) {
    displayClientsDashboard(clients)
    displayClientCount(clients)
    // sentimentAnalysis(clients)
    displayLogCount(clients)
    displayTotalProfit(clients)
  }

  // Clients
  if (document.getElementById('clients')) {
    initializeSortAndFilter(clients)
  }

  // Purchase
  if (document.getElementById('purchase')) {

    function setEventListeners() {
      const selectedFunction = checkSelector()

        // Add Billy
        if (selectedFunction === 'add-billy') {
            const purchaseBtn = document.getElementById('purchase-btn')
            const newPurchaseBtn = purchaseBtn.cloneNode(true)
            purchaseBtn.parentNode.replaceChild(newPurchaseBtn, purchaseBtn)

            newPurchaseBtn.addEventListener('click', function () {
                const phoneNumber = document.getElementById('phone-add').value
                const amountSpentNow = parseFloat(document.getElementById('amount-spent').value)
                uploadPurchase(phoneNumber, amountSpentNow)
                document.getElementById('phone-add').value = ''
                document.getElementById('amount-spent').value = ''
            })

        // Claim Gift
        } else if (selectedFunction === 'claim-gift') {
            const giftBtn = document.getElementById('gift-btn')
            const newGiftBtn = giftBtn.cloneNode(true)
            giftBtn.parentNode.replaceChild(newGiftBtn, giftBtn)

            newGiftBtn.addEventListener('click', function () {
                const phoneNumber = document.getElementById('phone-gift').value
                claimGift(phoneNumber)
                document.getElementById('phone-gift').value = ''
            })

        } else {
            console.log('No function selected')
        }

      }
      setEventListeners()
      document.getElementById('function-selector').addEventListener('change', setEventListeners)
  }


  // Stats
  if (document.getElementById('stats')) {

    displayClientCount(clients)
    displayTotalBillies(clients)
    displayClaimedCards(clients)
    // sentimentAnalysis(clients)
    displayLogCount(clients)
    displayAverageExpenditure(clients)
    displayTotalProfit(clients)

  }

  // Campaigns
  if(document.getElementById('campaigns')) {

    document.getElementById('campaign-btn').addEventListener('click', async (e) => {
      e.preventDefault()

      loader.style.display = "block"
    
      const title = document.getElementById('title').value
      const content = document.getElementById('content').value
      const imageFile = document.getElementById('image-upload').files[0]
    
      if (!title || !content) {
        alert('Please fill out the title and content.')
        loader.style.display = "none"
        return
      }
    
      let imageUrl = ''
    
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile)
      }
    
      try {
        await sendCampaignEmail(clients, title, content, imageUrl)
      } catch (error) {
        console.error('Error sending campaign emails:', error)
        alert('Error sending campaign emails. Please try again.')
      }

      loader.style.display = "none"

    })    

  }

  // Download
  if (document.getElementById('download')) {

    const pdfBtn = document.getElementById('pdf-btn') 
    pdfBtn.addEventListener('click', function () {
      downloadPDF(clients)
    })

    const csvBtn = document.getElementById('csv-btn') 
    csvBtn.addEventListener('click', function () {
      downloadCSV(clients)
    })

  }


})
