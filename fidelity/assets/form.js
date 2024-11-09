// Billy Burgers - Fidelity Card | Form

const apiUrl = 'https://backend-v2-esfc.onrender.com'
// const apiUrl = 'http://localhost:3068'

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

// // Authenticate client by phone number and obtain token
// async function AuthenticatePhoneNumber(phoneNumber) {
//   try {
//     const response = await fetch(`${apiUrl}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ phoneNumber })
//     })

//     if (!response.ok) throw new Error('Authentication failed')

//     const data = await response.json()
//     localStorage.setItem('accessToken', data.accessToken) // Store access token in local storage
//     return data
//   } catch (error) {
//     console.error('Error authenticating phone number:', error)
//     return null
//   }
// }

// Authenticate phoneNumber
async function AuthenticatePhoneNumber(phoneNumber) {
  const clients = await getAll('clients')
  return !clients.some(client => client.phoneNumber === phoneNumber)
}

// Create client
async function createClient(clientData) {
  try {
    const response = await fetch(`${apiUrl}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
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

// Send email function
async function sendCardEmail(client) {

  const imageUrl = 'https://res.cloudinary.com/dif3u3ft1/image/upload/v1731019307/card_oac2x2.png'
  const title = 'Ya podes empezar a sumar billies!'

  try {
  
      const templateParams = {
          to_email: client.email,
          name: client.name,
          title: title,
          image_url: imageUrl || ''
      }

      const serviceID = 'service_u4c98ke';
      const templateID = 'template_jl1x1mv';

      await emailjs.send(serviceID, templateID, templateParams)

      console.log('Email sent successfully')
  } 
  catch (error) {
      console.error('Error sending email:', error)
  }
  
}

// URL Functions

function getPhoneNumberFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('phoneNumber')
}

function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('phoneNumber')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}







// DOM Content Load
document.addEventListener('DOMContentLoaded', async function () {

  const loader = document.getElementById("loader")
  window.addEventListener("load", function () {
    loader.style.display = "none"
  })

  // Form
  if (document.getElementById('form')) {
    document.getElementById('form-btn').addEventListener('click', async function (event) {
      event.preventDefault()
      loader.style.display = "block"

      const phoneNumber = document.getElementById("phoneNumber").value
      const clientData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phoneNumber,
        logCount: 0,
        startDate: new Date(),
        lastRating: 0,
        averageRating: 0,
        discountAvailable: false,
        giftAvailable: false,
        currentBillies: 0,
        totalBillies: 0,
        claimedBillies: 0,
        totalSpent: 0,
        averageExpenditure: 0
      }

      try {
        // Instead of authenticating, directly sign up the client
        const signupResponse = await fetch(`${apiUrl}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientData)
        })

        if (!signupResponse.ok) {
          throw new Error('Signup failed')
        }

        const authData = await signupResponse.json()
        localStorage.setItem('accessToken', authData.accessToken)
        await createClient(clientData)
        sendCardEmail(clientData)
        console.log('Client created successfully')
        window.location.href = 'done.html'
      } catch (error) {
        console.error('Error creating or updating client:', error)
        window.location.href = 'login.html'
      } finally {
        loader.style.display = "none"
      }
    })
  }

  // Login
  if (document.getElementById('login')) {
    document.getElementById('login-btn').addEventListener('click', async function (event) {
      event.preventDefault()
      loader.style.display = "block"

      const phoneNumber = document.getElementById("phoneNumber").value

      try {
        const authData = await AuthenticatePhoneNumber(phoneNumber)
        if (authData) {
          console.log('Client authenticated successfully')
          window.location.href = `./index.html?phoneNumber=${phoneNumber}`
        } else {
          alert('User not found.')
          window.location.href = 'form.html'
        }

      } catch (error) {
        console.error('Error logging in:', error)
      } finally {
        loader.style.display = "none"
      }
    })
  }

  // Card
  if (document.getElementById('card')) {
    loader.style.display = "block"
    const phoneNumber = getPhoneNumberFromURL()

    if (phoneNumber) {
      clearURL()
      const client = await getClientByPhoneNumber(phoneNumber)
      console.log(client)
      document.getElementById("client-name").innerHTML = client.name
      document.getElementById("current-billies").innerHTML = `${client.currentBillies} / 9`
    } else {
      window.location.href = './path.html'
      console.log('phoneNumber not found in the URL')
    }
    loader.style.display = "none"
  }
})





