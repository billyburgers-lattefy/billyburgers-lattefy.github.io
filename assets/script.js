// Billy Burgers | landing page


// NavBar - toggle Responsive Menu:

burger = document.querySelector(".burger")
navBar = document.querySelector(".menu")

burger.onclick = function(){
    navBar.classList.toggle("active")
    burger.classList.toggle("active")
}

navBar.onclick = function(){
    navBar.classList.toggle("active")
    burger.classList.toggle("active")
}

// On Scroll effects

window.addEventListener('scroll', reveal)

function reveal(){
  var reveals = document.querySelectorAll('.reveal')

  for(var i = 0; i < reveals.length; i++){
    var windowheight = window.innerHeight
    var revealtop = reveals[i].getBoundingClientRect().top
    var revealpoint = 150

    if(revealtop < windowheight - revealpoint){
      reveals[i].classList.add('active')
    }else{
      reveals[i].classList.remove('active')
    }
  }
}

// CONTACT US

var contactBtn = document.getElementById("contact-btn")

contactBtn.addEventListener('click', function(e){
  e.preventDefault()

  var nombre = document.getElementById('name')
  var email = document.getElementById('email')
  var msg = document.getElementById('msg')

  var body = '<br/> Nombre: ' + nombre.value + '<br/> Email: ' + email.value + '<br/> Mensaje: ' + msg.value 
             
  function clearInputs(){
    nombre.value = ""
    email.value = ""
    msg.value = ""
  }

  console.log(body)

  Email.send({
    SecureToken : "caa0eb1e-3984-4d8e-b2f6-6710d77a9056",
    To : 'billyburgers.lattefy@gmail.com',
    From : 'billyburgers.lattefy@gmail.com',
    Subject : "BillyBurgers | Mensaje de Contacto",
    Body : body
  }).then(
    message => {
        alert(message)
        clearInputs()
    }
  )
  
})