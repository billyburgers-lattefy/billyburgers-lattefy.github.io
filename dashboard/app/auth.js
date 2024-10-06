/* --------------------------------------------------------------------------------------------------*/
/* ------------------------------------------ USER AUTH -------------------------------------------- */
/* --------------------------------------------------------------------------------------------------*/

// Fetch all users
async function getAllUsers(api) {
  try {
    const response = await fetch(`https://backend-v1-2-63a1.onrender.com/users`)
    if (!response.ok) throw new Error('Network response was not ok')
    return await response.json()
  } catch (error) {
    console.error(`Error fetching users:`, error)
    return []
  }
}

// Get user by email
function getUserByEmail(users, email) {
  return users.find(user => user.email === email)
}

// Function to Authenticate user
async function authenticateUser (users, email, password) {

  // Authenticate email
  function authenticateEmail(users, email) {
    return users.some(user => user.email === email)
  }

  // Authenticate Password
  function authenticatePassword(users, email, password) {
    const user = users.find(user => user.email === email)
    return user && user.password === password
  }

  if (!authenticateEmail(users, email) || !authenticatePassword(users, email, password)) {
    console.log("Error authenticating user")
    return false
  }
  return true
}

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

async function auth() {
  let email, password;

  // Get the current URL
  const urlParams = new URLSearchParams(window.location.search)

  if (urlParams.has('email') && urlParams.has('password')) {
    email = getEmailFromURL()
    password = getPasswordFromURL()
    console.log(`URL: email: ${email}, password: ${password}`)
    localStorage.setItem('email', email)
    localStorage.setItem('password', password)
    localStorage.setItem('auth', true)
    clearURL()
  } else if (localStorage.getItem('auth')) {
    email = localStorage.getItem('email')
    password = localStorage.getItem('password')
    console.log(`AUTH: email: ${email}, password: ${password}`)
  } else {
    localStorage.removeItem('auth')
    alert('Error al iniciar sesion')
    window.location.href = 'https://lattefy.github.io/auth/login.html'
  }

  const users = await getAllUsers()

  if (await authenticateUser(users, email, password)) {
    const user = getUserByEmail(users, email)
    console.log(`User authenticated: ${user.name}`)
    clearURL()
  } else {
    alert('Error al iniciar sesion')
    window.location.href = `https://lattefy.github.io/auth/login.html`
  }
}
