// Billy Burgers - Fidelity Card | Form

const apiUrl = 'https://backend-nqez.onrender.com'
// const apiUrl = 'http://localhost:3068'

// Fetch client by phone number
async function getClientByPhoneNumber(phoneNumber) {
  try {
    const response = await fetch(`${apiUrl}/clients/${phoneNumber}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('billyToken')}`
      }
    })

    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error('Error fetching client:', error)
    return null
  }
}

// Authenticate client by phone number and obtain token
async function AuthenticatePhoneNumber(phoneNumber) {
  try {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    })

    if (!response.ok) throw new Error('Authentication failed')

    const data = await response.json()
    localStorage.setItem('billyToken', data.accessToken) // Store access token in local storage
    return data
  } catch (error) {
    console.error('Error authenticating phone number:', error)
    return null
  }
}

// Validate token and fetch client data
async function getClientByToken() {
  const accessToken = localStorage.getItem('billyToken')
  if (!accessToken) {
    console.log('No token found in localStorage.')
    return null
  }

  try {
    // Validate the token
    const response = await fetch(`${apiUrl}/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      console.warn('Invalid token.')
      localStorage.removeItem('billyToken') // Clean up
      return null
    }

    const { phoneNumber } = await response.json()
    if (!phoneNumber) {
      console.warn('No phone number returned from token validation.')
      return null
    }

    console.log('Token valid. Fetching client via phone number...')
    return await getClientByPhoneNumber(phoneNumber)
  } catch (error) {
    console.error('Error validating token or fetching client:', error)
    return null
  }
}


// Create client
async function createClient(clientData) {
  try {
    const response = await fetch(`${apiUrl}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('billyToken')}`
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
        'Authorization': `Bearer ${localStorage.getItem('billyToken')}`
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
        from_name: 'Billy Burgers',
        reply_to: 'billyburgers.lattefy@gmail.com',

        to_email: client.email,
        name: client.name,

        title: title,
        image_url: imageUrl || ''
      }

      const serviceID = 'service_gvhjjd5'
      const templateID = 'template_ds5krec'

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



// Function to validate inputs
function validateInputs(name, email, phoneNumber) {
  let isValid = true

  // Name validation (basic check: not empty)
  const nameInput = document.getElementById('name')
  const nameLabel = document.getElementById('name-label')
  if (!name.trim()) {
      nameInput.style.borderColor = 'red'
      nameLabel.textContent = 'Nombre completo - Este campo es obligatorio'
      isValid = false
  } else {
      nameInput.style.borderColor = ''
      nameLabel.textContent = 'Nombre completo'
  }

  // Email validation
  const emailInput = document.getElementById('email')
  const emailLabel = document.getElementById('email-label')
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
      emailInput.style.borderColor = 'red'
      emailLabel.textContent = 'Email - Por favor ingrese un email válido'
      isValid = false
  } else {
      emailInput.style.borderColor = ''
      emailLabel.textContent = 'Email'
  }

  // Phone number validation
  const isPhoneNumberValid = validatePhoneNumber(phoneNumber)
  if (!isPhoneNumberValid) {
    isValid = false
  }

  return isValid
}

function validatePhoneNumber (phoneNumber) {

  let valid = true

  const phoneInput = document.getElementById('phoneNumber')
  const phoneLabel = document.getElementById('phoneNumber-label')
  const phonePattern = /^0\d{8}$/ // starts with 0 and is 9 digits
  if (!phonePattern.test(phoneNumber)) {
      phoneInput.style.borderColor = 'red'
      phoneLabel.textContent = 'Debe comenzar con 0 y tener 9 dígitos'
      valid = false
  } else {
      phoneInput.style.borderColor = ''
      phoneLabel.textContent = 'Celular'
  }

  return valid

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

      // Get values from inputs
      const name = document.getElementById('name').value
      const email = document.getElementById('email').value
      const phoneNumber = document.getElementById('phoneNumber').value

      // Validate inputs
      const isFormValid = validateInputs(name, email, phoneNumber)

      if (isFormValid) {

        loader.style.display = "block"

        const clientData = {
          name: name,
          email: email,
          phoneNumber: phoneNumber,
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
          localStorage.setItem('billyToken', authData.accessToken)
          await createClient(clientData)
          await sendCardEmail(clientData)
          console.log('Client created successfully')
          window.location.href = `./done.html?phoneNumber=${phoneNumber}`

        } catch (error) {
          console.error('Error creating or updating client:', error)
          window.location.href = 'login.html'
        } finally {
          loader.style.display = "none"
        }

      } else {
        console.log('Invalid form inputs.')
      }

    })

  }

  // Login
  if (document.getElementById('login')) {

    await loginAuth()

    document.getElementById('login-btn').addEventListener('click', async function (event) {
      event.preventDefault()

      const phoneNumber = document.getElementById('phoneNumber').value
      const isPhoneNumberValid = validatePhoneNumber(phoneNumber)

      if (isPhoneNumberValid) {

        loader.style.display = "block"

        try {
          const authData = await AuthenticatePhoneNumber(phoneNumber)
          if (authData) {
            console.log('Client authenticated successfully')
  
            const client = await getClientByPhoneNumber(phoneNumber)
            updates = {
              logCount: client.logCount += 1
            }
            await updateClient(phoneNumber, updates)
  
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

      } else {
        console.log('Invalid phone number')
      }

    })
  
  }

  // Done
  if (document.getElementById('done')) {

    const phoneNumber = getPhoneNumberFromURL()
    
    document.getElementById('done-btn').addEventListener('click', async () => {
      if (phoneNumber) {
        window.location.href = `./index.html?phoneNumber=${phoneNumber}`
      } else {
        window.location.href = './login.html'
      }

    })

  }

  // Card
  if (document.getElementById('card')) {
    loader.style.display = "block"
    
    const phoneNumber = getPhoneNumberFromURL()
    const token = localStorage.getItem('billyToken')

    let client = null
    if (phoneNumber) {
      clearURL()
      client = await getClientByPhoneNumber(phoneNumber)
    } else if (token) {
      client = await getClientByToken()
    } else {
      window.location.href = './path.html'
      console.log('phoneNumber not found in the URL')
    }
    console.log(client)

    // Display Card
    if (client) {
      document.getElementById("client-name").innerHTML = client.name
      document.getElementById("current-points").innerHTML = `${client.currentBillies} / 9`
      loader.style.display = "none"
    } else {
      window.location.href = './path.html'
    }

    // Log out
    document.getElementById('logout-btn').addEventListener('click', async () => {
      localStorage.removeItem('billyToken')
      window.location.href = './login.html'
    })

  }

})





