// DASHBOARD AUTH

// const authUrl = 'http://localhost:3089'
const authUrl = 'https://backend-v2-esfc.onrender.com'

async function auth() {
  const email = getEmailFromURL()
  const password = getPasswordFromURL()

  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if (email && password) {
    await authLogin(email, password) 
  } else if (refreshToken || accessToken){
    await validateTokens(accessToken, refreshToken) 
  } else {
    window.location.href = 'https://lattefy.com.uy/auth'
  }
}

// Token Validation
async function validateTokens(accessToken, refreshToken) {

  // Validate access token against the server
  const tokenValid = await validateAccessToken(accessToken)
  if (!tokenValid) {
    console.log('Access token expired or invalid, refreshing...')
    await refreshAccessToken(refreshToken)
  } else {
    console.log('Access token is valid')
  }

}

async function validateAccessToken(accessToken) {

  try {
      const response = await fetch(`${authUrl}/users`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      })

      if (response.ok) {
          return true
      } else if (response.status === 403 || response.status === 401) {
          return false
      }

  } catch (error) {
      console.log('Error checking access token validity: ' + error.message)
      return false
  }

}

// Refresh the access token using the refresh token
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch(`${authUrl}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: refreshToken })
    })

    if (!response.ok) {
      throw new Error('Failed to refresh access token')
    }

    const data = await response.json()
    localStorage.setItem('accessToken', data.accessToken)
    window.location.reload()
  
  } catch (error) {
    console.log('Error refreshing access token: ' + error.message)
    window.location.href = 'https://lattefy.com.uy/auth'
    throw error 
  }

}

// URL utility functions
function getEmailFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('email')
}
function getPasswordFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('password')
}
function clearURL() {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.delete('email')
  urlParams.delete('password')
  const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '')
  window.history.replaceState({}, '', newUrl)
}

// Login process
async function authLogin(email, password) {
  clearURL() 

  try {
    const response = await fetch(`${authUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      const errorMsg = await response.json()
      throw new Error(errorMsg)
    }

    const data = await response.json()
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
  
  } catch (error) {
    console.log('Authorization failed: ' + error.message)
    window.location.href = 'https://lattefy.com.uy/auth'
  }

}