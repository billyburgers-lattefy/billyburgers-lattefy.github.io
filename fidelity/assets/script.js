// BILLY BURGERS - SCRIPT


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