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

// Get phoneNumber from URL
function getPhoneNumberFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams.get('phoneNumber'))
  return urlParams.get('phoneNumber')
}

// Delete phoneNumber from URL
function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('phoneNumber')
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

//  if (
//   document.getElementById('form') ||
//   document.getElementById('login') 
//  ) {
//    // Get 5-Star Rating
//    function getStarRating() {
//     let userRating = null
//     document.querySelectorAll('.star').forEach((star, index) => {
//       star.addEventListener('click', () => {
//         userRating = 5 - index
//         console.log('User rating updated:', userRating)
//       })
//     })
//     return () => userRating
//   }
//  }

  // Form 
  if (document.getElementById('form')) {

    // const getUserRating = getStarRating()

    // Form Submission
    document.getElementById('form-btn').addEventListener('click', async function(event) {
      event.preventDefault()

      loader.style.display = "block"

      // Fixed Data
      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const phoneNumber = document.getElementById("phoneNumber").value

      // Log data
      const startDate = new Date()

      // Discount Data
      const discountAvailable = false
      const giftAvailable = false
      const currentBillies = 0
      const totalBillies = 0
      const claimedBillies = 0

      // Rating
      let lastRating = 0
      let averageRating = 0
      // const rating = getUserRating()
      // if (rating != null) {
      //   lastRating = rating
      //   averageRating = lastRating
      // } else {
      //   lastRating = 0
      //   averageRating = 0 
      // }

      try {
        if (await AuthenticatePhoneNumber(phoneNumber)) {
          const clientData = {
            name,
            email,
            phoneNumber,
            logCount: 0,
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

        loader.style.display = "none"

      } catch (error) {
        console.error('Error creating or updating client:', error)
      } 

    }) 
  }

  // Login 
  if (document.getElementById('login')) {

    // const getUserRating = getStarRating()

    document.getElementById('login-btn').addEventListener('click', async function(event) {
      event.preventDefault()

      loader.style.display = "block"

      const phoneNumber = document.getElementById("phoneNumber").value
      // const lastRating = getUserRating()

      try {
        const existingClient = await getClientByPhoneNumber(phoneNumber)

        if (existingClient) {

          const logCount = existingClient.logCount + 1
          const updates = {
            logCount
          }
        
          await updateClient(phoneNumber, updates)
          console.log('Client updated successfully')
          window.location.href = `./index.html?phoneNumber=${existingClient.phoneNumber}`

          // let averageRating
          // if (averageRating === 0) {
          //   averageRating = ((existingClient.averageRating + lastRating) / 2).toFixed(2)
          // } else {
          //   averageRating = lastRating
          // }
          
          // if (lastRating !== null) {
          //   const updates = {
          //     lastRating,
          //     averageRating,
          //   }
          //   await updateClient(cedula, updates)
          //   console.log('Client updated successfully')
          // }
          
          
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

    loader.style.display = "block"

    // Get the current URL
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('phoneNumber')) {

        const phoneNumber = getPhoneNumberFromURL()
        clearURL()
        const client = await getClientByPhoneNumber(phoneNumber)
        console.log(client)

        const nameDisplay = document.getElementById("client-name")
        const currentBilliesDisplay = document.getElementById("current-billies")

        nameDisplay.innerHTML = client.name
        currentBilliesDisplay.innerHTML = `${client.currentBillies} / 9`
        
    } else {
        //window.location.href = './path.html'
        console.log('phoneNumber not found in the URL')
    }

    loader.style.display = "none"

  }


})