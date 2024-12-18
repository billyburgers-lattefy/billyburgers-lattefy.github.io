/* ------------------------------------------------------------------------------------------------- */
/* ------------------------------------------- CAMPAIGNS ------------------------------------------- */
/* ------------------------------------------------------------------------------------------------- */

// Display audience
async function displayAudienceSize(audience) {
    console.log('Tamaño de la audiencia:', audience.length)
    const audienceElement = document.getElementById('audience-size')
    audienceElement.textContent = `Tamaño de la audiencia: ${audience.length}`
}

// Function to filter clients
async function filterClients(clients, variable, condition, value) {
    console.log(`Filtrando por ${variable} con condición ${condition} y valor "${value}"`)
    return clients.filter(client => {
        const clientValue = client[variable]?.toString().toLowerCase() || ''
        const filterValue = value.toLowerCase()

        if (condition === 'contains') return clientValue.includes(filterValue)
        if (condition === 'not-contains') return !clientValue.includes(filterValue)
        return false
    })
}

// Function to send emails using EmailJS
async function sendCampaignEmail(clients, title, content, imageUrl) {

    try {
        for (const client of clients) {
            if (!client.email) {
                console.error(`Missing email for client: ${client.name}`)
                continue
            }
    
            const templateParams = {
                from_name: 'Billy Burgers',
                reply_to: 'billyburgers.lattefy@gmail.com',

                to_email: client.email,
                name: client.name,
                
                title: title,
                content: content,
                image_url: imageUrl || ''
            }

            const serviceID = 'service_gvhjjd5';
            const templateID = 'template_d029ld1';
    
            await emailjs.send(serviceID, templateID, templateParams)
    
        }
        alert('Campaña enviada con exito!')
    } 
    catch (error) {
        console.error('Error sending campaign emails:', error)
        alert('Error al enviar la campaña.')
    }
    
}
    
// Function to upload images to Cloudinary
async function uploadImageToCloudinary(imageFile) {
    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'my_unsigned_preset')

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/dif3u3ft1/image/upload', {
            method: 'POST',
            body: formData
        })
        const data = await response.json()
    
        if (response.ok) {
            return data.secure_url
        } else {
            throw new Error(data.error.message)
        }
        } catch (error) {
            console.error('Error uploading the image:', error)
            alert('Error al cargar el archivo.')
    }
}