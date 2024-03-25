class Game {
    constructor() {
        this.cards = [];
    }

    startGame() {}

    shuffleCards() {
    const cards = document.querySelectorAll('.memory-card');  

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      cards[i].parentNode.appendChild(cards[j]); 
    }

    flipCards() {
        

    }




}