// Billy Burgers - Fidelity Card | Dashboard


/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3087'
const apiUrl = 'https://backend-nqez.onrender.com'

// Fetch all clients
async function getAll(database) {
  try {
    const response = await fetch(`${apiUrl}/${database}`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${database}:`, error)
    return []
  }
}

// Authenticate cedula
async function AuthenticateCedula(cedula, cedula) {
  return !clients.some(client => client.cedula === cedula)
}

// Get client by cedula
function getClientByCedula(clients, cedula) {
  return clients.find(client => client.cedula === cedula)
}

// Update client
async function updateClient(cedula, updates) {
  try {
    const response = await fetch(`${apiUrl}/clients/${cedula}`, {
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

  // if (!localStorage.getItem('auth')) {
  //   await auth(authUrl)
  //   localStorage.setItem('auth', 'true')
  // } else {
  //   clearURL()
  // }

  await auth()

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
    sentimentAnalysis(clients)
    displayTotalProfit(clients)
  }

  // Clients
  if (document.getElementById('clients')) {
    initializeSortAndFilter(clients)
  }

  // Purchase 
  if (document.getElementById('purchase')) {

    // Purchase Upload
    const purchaseBtn = document.getElementById('purchase-btn')
    purchaseBtn.addEventListener('click', function () {
      const cedula = document.getElementById('cedula').value
      const amountSpentNow = parseFloat(document.getElementById('amount-spent').value)
      uploadPurchase(cedula, amountSpentNow)
      cedula.value = ''
      document.getElementById('amount-spent').value = ''
    })

  }

  // Stats
  if (document.getElementById('stats')) {

    displayClientCount(clients)
    displayTotalBillies(clients)
    displayClaimedCards(clients)
    sentimentAnalysis(clients)
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
