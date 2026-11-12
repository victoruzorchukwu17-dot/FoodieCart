const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', ()=>{
    container.classList.add("active");
});

loginBtn.addEventListener('click', ()=>{
    container.classList.remove("active");
});


function speakWelcome() {
           
    if ('speechSynthesis' in window) {
        const message = new SpeechSynthesisUtterance("Please Agree on our terms and condition inorder to access the website");
        message.volume = 1;  
        message.rate = 1;
        message.pitch = 1; 
        window.speechSynthesis.speak(message);
    } 
    else {
        console.log("Text-to-speech not supported in this browser.");
    }
}
