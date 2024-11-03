// Lattefy | Authentication JavaScript File

/* --------------------------------------------------------------------------------------------------*/
/* -------------------------------------- DATABASE CONNECTION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// const apiUrl = 'http://localhost:3089'
// const apiUrl = 'https://backend-5v26.onrender.com'
const apiUrl = 'https://backend-v1-2-63a1.onrender.com'

// Fetch all users
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


/* --------------------------------------------------------------------------------------------------*/
/* ------------------------------------ CLIENT AUTHENTICATION -------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Get client by email
function getClientByEmail(clients, email) {
  return clients.find(client => client.email === email)
}

// Function to Authenticate client
async function authenticateClient (clients, email, password) {

  console.log(`CLIENT AUTH: email: ${email}, password: ${password}`)

  // Authenticate email
  function authenticateEmail(clients, email) {
    return clients.some(clients => clients.email === email)
  }

  // Authenticate Password
  function authenticatePassword(clients, email, password) {
    const client = clients.find(client => client.email === email)
    return client && client.password === password
  }

  const client = await getClientByEmail(clients, email)
  console.log(client)
  if (!authenticateEmail(clients, email) || !authenticatePassword(clients, email, password)) {
    console.log("Error authenticating client")
    return false
  }
  return true
}

// Log In

if (document.getElementById('login')) {

  async function login () {

    const clients = await getAll('clients')
    const email = document.getElementById('client-email').value
    const password = document.getElementById('client-password').value

    if (await authenticateClient(clients, email, password)) {
      const client = getClientByEmail(clients, email)
      
      if (client) {
        window.location.href = `index.html?email=${client.email}&password=${client.password}`
      } else {
        console.error('Client not found')
      }
    } else {
      console.error('Error authenticating client')
      window.location.href = '../form/index.html'
    }

  }

  loginBtn = document.getElementById('login-btn')
  loginBtn.addEventListener('click', login)

}



/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- URL MANAGMENT ------------------------------------------ */
/* --------------------------------------------------------------------------------------------------*/

// Get email from URL
function getEmailFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams.get('email'))
  return urlParams.get('email')
}

// Get password from URL
function getPasswordFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  console.log(urlParams.get('password'))
  return urlParams.get('password')  
}

// Delete email & password from URL
function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('email')
  urlParams.delete('password')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}


/* --------------------------------------------------------------------------------------------------*/
/* ---------------------------------------- FIDELITY CARD ------------------------------------------ */
/* --------------------------------------------------------------------------------------------------*/

async function auth(clients, email, password) {

  if (await authenticateClient(clients, email, password)) {
    const client = getClientByEmail(clients, email)
    console.log(`Client authenticated: ${client.name}`)
    clearURL()
  } else {
    console.error('Error authenticating client')
    window.location.href = `login.html`
  }

}

if (document.getElementById('fidelity')) {
  document.addEventListener('DOMContentLoaded', async function () {

    const clients = await getAll('clients')

    let email
    let password

    console.log(`ls: ${localStorage.getItem('email')}, ${localStorage.getItem('email') === 'null'}`)

    if (!getEmailFromURL() === null) {
      email = getEmailFromURL()
      password = getPasswordFromURL()
    } else if (!localStorage.getItem('email') === 'null') {
      email = localStorage.getItem('email')
      password = localStorage.getItem('password')
    } else {
      localStorage.setItem('fidelity-auth', true)
      window.location.href = './login.html'
    }

    console.log(`email: ${email}, password: ${password}`)

    // Fidelity - client auth
    if (!localStorage.getItem('fidelity-auth')) {
      await auth(clients, email, password)
      localStorage.setItem('email', email)
      localStorage.setItem('password', password)
    } else {
      clearURL()
    }

    email = localStorage.getItem('email')
    const client = getClientByEmail(clients, email)
    console.log(client)

    // Welcome Msg
    const msg = document.getElementById('welcome-msg')
    msg.innerHTML = `Welcome, ${client.name}!`
  })
}

