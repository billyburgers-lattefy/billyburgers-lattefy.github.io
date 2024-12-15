
// Billy Burgers - Fidelity Card | Dashboard


/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3068'
const apiUrl = 'https://backend-nqez.onrender.com'

// Fetch all clients
async function getAll(database) {
  try {

    const response = await fetch(`${apiUrl}/${database}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    }) 
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()

  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }

}

// Authenticate phoneNumber
async function AuthenticatePhoneNumber(phoneNumber) {
  const clients = await getAll('clients')
  return !clients.some(client => client.phoneNumber === phoneNumber)
}

// Fetch client by phone number
async function getClientByPhoneNumber(phoneNumber) {
  try {
    const response = await fetch(`${apiUrl}/clients/${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })

    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching client:', error)
    return null
  }
}

// Update client
async function updateClient(phoneNumber, updates) {
  try {
    const response = await fetch(`${apiUrl}/clients/${phoneNumber}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
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
  await auth()

  const clients = await getAll('clients')

  // log-out
  const logOutBtn = document.getElementById('logout-btn')
  logOutBtn.addEventListener('click', function () {
    localStorage.clear()
    window.location.href = 'https://lattefy.com.uy/auth'
  })

  // Loader
  if (document.getElementById("loader")) {
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
                auth()
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
                auth()
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

    const fileInput = document.getElementById('image-upload');
    const fileName = document.getElementById('file-name');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
            fileName.textContent = file.name
        } else {
            fileName.textContent = '' 
        }
    })

    let audience

    // Apply clients filter
    document.getElementById('apply-btn').addEventListener('click', async () => {
        const variable = document.getElementById('filter-variable').value
        const condition = document.getElementById('filter-condition').value
        const value = document.getElementById('filter-value').value.trim()

        if (!variable || !value) {
            alert('Por favor ingrese valores válidos para filtrar')
            return
        }

        // Wait for the filtered clients
        audience = await filterClients(clients, variable, condition, value)
        displayAudienceSize(audience)
        console.log('Audience:', audience)
    })

    // Reset clients filter
    document.getElementById('reset-btn').addEventListener('click', () => {
        audience = clients
        document.getElementById('filter-variable').selectedIndex = 0
        document.getElementById('filter-condition').selectedIndex = 0
        document.getElementById('filter-value').value = ''
        displayAudienceSize(clients)
        console.log('filters reset')
    })

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
