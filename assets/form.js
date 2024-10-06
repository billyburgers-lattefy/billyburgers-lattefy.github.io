// Billy Burgers - Fidelity Card | Form

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
async function AuthenticateCedula(cedula) {
  const clients = await getAll('clients')
  return !clients.some(client => client.cedula === cedula)
}

// Get client by cedula
async function getClientByCedula(cedula) {
  try {
    const response = await fetch(`${apiUrl}/clients`)
    if (!response.ok) throw new Error('Network response was not ok')
    const clients = await response.json()
    return clients.find(client => client.cedula === cedula)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return null
  }
}

// Create client
async function createClient(clientData) {
  try {
    const response = await fetch(`${apiUrl}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    })
    const data = await response.json()
    console.log('Client created:', data)
  } catch (error) {
    console.error('Error creating client:', error)
  }
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

// Get cedula from URL
function getCedulaFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams.get('cedula'))
  return urlParams.get('cedula')
}

// Delete cedula from URL
function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('cedula')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}


// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {

  // Loader
  const loader = document.getElementById("loader")
  window.addEventListener("load", function() {
    loader.style.display = "none"
  })
  

 if (
  document.getElementById('form') ||
  document.getElementById('login') 
 ) {
   // Get 5-Star Rating
   function getStarRating() {
    let userRating = null
    document.querySelectorAll('.star').forEach((star, index) => {
      star.addEventListener('click', () => {
        userRating = 5 - index
        console.log('User rating updated:', userRating)
      })
    })
    return () => userRating
  }
 }

  // Form 
  if (document.getElementById('form')) {

    // Form Submission
    document.getElementById('form-btn').addEventListener('click', async function(event) {
      event.preventDefault()

      loader.style.display = "block"

      // Fixed Data
      const name = document.getElementById("name").value
      const cedula = document.getElementById("cedula").value
      const email = document.getElementById("email").value
      const phoneNumber = document.getElementById("phoneNumber").value
      const birthDate = document.getElementById("birthdate").value

      // Discount Data
      const startDate = new Date()
      const discountAvailable = false
      const giftAvailable = false
      const currentBillies = 0
      const totalBillies = 0
      const claimedBillies = 0

      // Rating
      const lastRating = getUserRating()
      const averageRating = lastRating

      try {
        if (await AuthenticateCedula(cedula) && lastRating !== null) {
          const clientData = {
            name,
            cedula,
            email,
            phoneNumber,
            birthDate,
            startDate,
            lastRating,
            averageRating,
            discountAvailable,
            giftAvailable,
            currentBillies,
            totalBillies,
            claimedBillies,
            totalSpent: 0,
            averageExpenditure: 0
          }
          await createClient(clientData)
          console.log('Client created successfully')

          window.location.href = 'done.html'
        } else {
          window.location.href = 'login.html'
          console.log('Client already registered')
        }
      } catch (error) {
        console.error('Error creating or updating client:', error)
      } finally {
        loader.style.display = "none"
      }
    })
  }

  // Login 
  if (document.getElementById('login')) {

    const getUserRating = getStarRating()

    document.getElementById('login-btn').addEventListener('click', async function(event) {
      event.preventDefault()

      loader.style.display = "block"

      const cedula = document.getElementById("cedula").value
      const lastRating = getUserRating()

      try {
        const existingClient = await getClientByCedula(cedula)
        if (existingClient) {
          const averageRating = ((existingClient.averageRating + lastRating) / 2).toFixed(2)

          if (lastRating !== null) {
            const updates = {
              lastRating,
              averageRating,
            }
            await updateClient(cedula, updates)
            console.log('Client updated successfully')
          }
          
          window.location.href = `./index.html?cedula=${existingClient.cedula}`
        } else {
          alert('Usuario no encontrado.')
          window.location.href = 'form.html'
        }

        loader.style.display = "none"
      } catch (error) {
        console.error('Error fetching client:', error)
      }

    })
  }

  // Card 
  if (document.getElementById('card')) {

    // Get the current URL
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('cedula')) {

        const cedula = getCedulaFromURL()
        const client = await getClientByCedula(cedula)
        console.log(client)

        const nameDisplay = document.getElementById("client-name")
        const currentBilliesDisplay = document.getElementById("current-billies")

        nameDisplay.innerHTML = client.name
        currentBilliesDisplay.innerHTML = `${client.currentBillies} / 10`
        
    } else {
        window.location.href = './path.html'
        console.log('Cedula not found in the URL')
    }

  }


})