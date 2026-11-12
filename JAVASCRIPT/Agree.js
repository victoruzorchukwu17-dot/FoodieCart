const agreementForm = document.querySelector('.agreement-form');

agreementForm?.addEventListener('submit', () => {
    if ('speechSynthesis' in window) {
        const message = new SpeechSynthesisUtterance(
            'Welcome to FoodieCart. Order food and have it delivered to your door.'
        );
        window.speechSynthesis.speak(message);
    }
});