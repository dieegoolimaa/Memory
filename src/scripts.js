class MemoryGame {
  constructor() {
    this.cards = document.querySelectorAll(".memory-card");
    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;
    this.allCardsMatched = false;
    this.score = 0;
    this.startBtn = document.querySelector("#startBtn");
    this.restartBtn = document.querySelector("#restartBtn");
    this.goBackToHomePageBtn = document.querySelector("#goBackToHomePageBtn");
    this.introBlock = document.querySelector(".introBlock");
    this.gameContainer = document.querySelector(".game-container");
    this.duringGameBtn = document.querySelector(".duringGameBtn");

    this.startBtn.addEventListener("click", () => this.startGame());
    this.restartBtn.addEventListener("click", () => this.restartGame());
    this.goBackToHomePageBtn.addEventListener("click", () => {
      this.gameContainer.style.display = "none";
      this.introBlock.style.display = "flex";
      this.goBackToHomePageBtn.style.display = "none";
      this.restartBtn.style.display = "none";
    });
  }

  flipCard(card) {
    if (this.boardLocked || card === this.firstCardClicked) return;

    card.classList.add("flip");

    if (!this.cardFlipped) {
      this.cardFlipped = true;
      this.firstCardClicked = card;
    } else {
      this.secondCardClicked = card;
      this.checkForMatch();
    }
  }

  checkForMatch() {
    let isMatch = this.areCardsMatching();

    if (isMatch) {
      this.disableCards(); // Disable matched cards
      this.score += 100; // Update score on match
    } else {
      this.unflipCards(); // Unflip cards if not a match
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
    }, 1500); // Unflip cards after 1 second
  }

  resetBoard() {
    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;
  }

  shuffleCards() {
    this.cards.forEach((card) => {
      card.style.order = Math.floor(Math.random() * 12);
    });
  }

  startGame() {
    this.introBlock.style.display = "none";
    this.gameContainer.style.display = "flex";
    this.duringGameBtn.style.display = "block"; // Show buttons during game

    this.shuffleCards();
    this.cards.forEach((card) =>
      card.addEventListener("click", () => this.flipCard(card))
    );
    this.allCardsMatched = false;
    this.score = 0;
  }

  restartGame() {
    this.resetBoard();
    this.shuffleCards();
    this.cards.forEach((card) => {
      card.classList.remove("flip");
      card.addEventListener("click", () => this.flipCard(card));
    });
    this.score = 0;
  }

  areCardsMatching() {
    const firstCardContent = this.firstCardClicked.dataset.framework;
    const secondCardContent = this.secondCardClicked.dataset.framework;
    return firstCardContent === secondCardContent;
  }
}

const memoryGame = new MemoryGame();
