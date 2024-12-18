// Function to send emails using EmailJS

const images = {
   discount: 'https://res.cloudinary.com/dif3u3ft1/image/upload/v1731019308/discount_ttvqrd.png',
   gift: 'https://res.cloudinary.com/dif3u3ft1/image/upload/v1731019308/gift_lvp1rw.png'
}

const titles = {
    discount: '¡Ganaste un 15% OFF en tu proxima compra!',
    gift: '¡Reclama tu burger 100% gratis!'
}

let imageUrl
let title

async function sendFileEmail(client, why) {

    if (why == 'gift') {
        imageUrl = images.gift
        title = titles.gift
    } else if (why == 'discount') {
        imageUrl = images.discount
        title = titles.discount
    }

    try {
    
        const templateParams = {
            from_name: 'Billy Burgers',
            reply_to: 'billyburgers.lattefy@gmail.com',

            to_email: client.email,
            name: client.name,

            title: title,
            image_url: imageUrl || ''
        }

        const serviceID = 'service_gvhjjd5';
        const templateID = 'template_ds5krec';

        await emailjs.send(serviceID, templateID, templateParams)
    

        console.log('Email sent successfully')
    } 
    catch (error) {
        console.error('Error sending email:', error)
    }
    
}
