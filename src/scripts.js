class MemoryGame {
  constructor() {
    this.cards = document.querySelectorAll(".memory-card");
    this.gameContainer = document.querySelector(".game-container");
    this.introPage = document.querySelector(".introBlock");
    this.btnBlock = document.querySelector(".btnBlock");
    this.startBtn = document.querySelector("#startBtn");
    this.restartBtn = document.querySelector("#restartBtn");
    this.message = document.querySelector(".victory-modal");

    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;

    this.startGame();
    this.restartGame();
    this.backToHomePage();
  }

  startGame() {
    this.startBtn.addEventListener("click", () => {
      this.introPage.style.display = "none";
      this.startBtn.style.display = "none";
      this.gameContainer.style.display = "flex";
      this.btnBlock.style.display = "flex";
      this.shuffleCards();
      this.cards.forEach((card) =>
        card.addEventListener("click", () => this.flipCard(card))
      );
    });
  }

  shuffleCards() {
    this.cards.forEach((card) => {
      card.style.order = Math.floor(Math.random() * 12);
    });
  }

  restartGame() {
    const restartBtn = document.querySelector("#restartBtn");
    restartBtn.addEventListener("click", () => {
      this.resetBoard();
      this.shuffleCards();
      this.cards.forEach((card) => {
        card.classList.remove("flip");
        card.addEventListener("click", () => this.flipCard(card));
      });

      this.gameContainer.style.display = "flex";
      this.btnBlock.style.display = "flex";
      this.message.style.display = "none";
    });
  }

  handleCardMatch() {
    const firstCardContent = this.firstCardClicked.dataset.framework;
    const secondCardContent = this.secondCardClicked.dataset.framework;
    const isMatch = firstCardContent === secondCardContent;

    if (isMatch) {
      this.disableCards();

      if (this.allCardsMatched()) {
        this.displayMotivationalMessage();
      }
    } else {
      this.unflipCards();
    }
  }

  disableCards() {
    this.firstCardClicked.removeEventListener("click", () =>
      this.flipCard(this.firstCardClicked)
    );
    this.secondCardClicked.removeEventListener("click", () =>
      this.flipCard(this.secondCardClicked)
    );

    this.resetBoard();
  }

  unflipCards() {
    this.boardLocked = true;
    setTimeout(() => {
      this.firstCardClicked.classList.remove("flip");
      this.secondCardClicked.classList.remove("flip");
      this.resetBoard();
    }, 1500);
  }

  flipCard(card) {
    if (this.boardLocked || card === this.firstCardClicked) return;

    card.classList.add("flip");

    if (!this.cardFlipped) {
      this.cardFlipped = true;
      this.firstCardClicked = card;
    } else {
      this.secondCardClicked = card;
      this.handleCardMatch(); // Call the combined function
    }
  }

  backToHomePage() {
    const goBackToHomePageBtn = document.querySelector("#goBackToHomePageBtn");
    goBackToHomePageBtn.addEventListener("click", () => {
      this.gameContainer.style.display = "none";
      this.introPage.style.display = "flex";
      this.btnBlock.style.display = "none";
      this.startBtn.style.display = "block";
    });
  }

  resetBoard() {
    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;
  }

  allCardsMatched() {
    return [...this.cards].every((card) => card.classList.contains("flip"));
  }

  displayMotivationalMessage() {
    this.gameContainer.style.display = "none";
    this.message.style.display = "block";
    this.restartBtn.style.display = "block";
  }
}

// Initialize the game
const game = new MemoryGame();
