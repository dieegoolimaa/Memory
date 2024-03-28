class MemoryGame {
  constructor() {
    // Get references to DOM elements
    this.cards = document.querySelectorAll(".memory-card");
    this.gameContainer = document.querySelector(".game-container");
    this.introPage = document.querySelector(".introBlock");
    this.btnBlock = document.querySelector(".btnBlock");
    this.startBtn = document.querySelector("#startBtn");
    this.restartBtn = document.querySelector("#restartBtn");
    this.message = document.querySelector(".victory-modal");
    this.scoreElement = document.querySelector(".score");
    this.scoreElement.style.display = "none";

    this.score = 0;
    this.multiplier = 10; // Increase score by 10 points per match

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
      this.scoreElement.style.display = "block";

      // Shuffle cards
      this.score = 0;
      scoreDisplay.innerText = this.score;

      this.resetBoard();
      this.shuffleCards();
      this.cards.forEach((card) => {
        card.classList.remove("flip");
        card.addEventListener("click", () => this.flipCard(card));
      });
    });
  }

  shuffleCards() {
    // Randomly order cards using Math.floor and requestAnimationFrame for smoother shuffling
    this.cards.forEach((card) => {
      card.style.order = Math.floor(Math.random() * 12);
      window.requestAnimationFrame(() => {
        card.style.transition = "transform 0.5s ease-in-out"; // Add a smooth shuffling animation (optional)
      });
    });
  }

  restartGame() {
    const restartBtn = document.querySelector("#restartBtn");
    restartBtn.addEventListener("click", () => {
      this.score = 0;
      scoreDisplay.innerText = this.score;
      this.resetBoard();
      this.shuffleCards();
      this.cards.forEach((card) => {
        card.classList.remove("flip");
        card.addEventListener("click", () => this.flipCard(card));
      });

      this.gameContainer.style.display = "flex";
      this.btnBlock.style.display = "flex";
      this.message.style.display = "none";
      this.restartBtn.style.display = "flex";
    });
  }

  handleCardMatch() {
    const firstCardContent = this.firstCardClicked.dataset.framework;
    const secondCardContent = this.secondCardClicked.dataset.framework;
    const isMatch = firstCardContent === secondCardContent;

    if (isMatch) {
      this.score += this.multiplier;
      this.disableCards();

      if (this.allCardsMatched()) {
        this.displayMotivationalMessage();
      }
    } else {
      this.unflipCards();
    }

    // Update the score display
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.innerText = this.score;
  }

  disableCards() {
    const disabledCards = [this.firstCardClicked, this.secondCardClicked];
    disabledCards.forEach((card) =>
      card.removeEventListener("click", this.flipCard)
    );

    this.resetBoard();
  }

  unflipCards() {
    this.boardLocked = true;
    setTimeout(() => {
      this.firstCardClicked.classList.remove("flip");
      this.secondCardClicked.classList.remove("flip");
      this.resetBoard();
    }, 1300);
  }

  flipCard(card) {
    if (
      this.boardLocked ||
      card === this.firstCardClicked ||
      card.classList.contains("flip")
    )
      return;

    card.classList.add("flip");

    if (!this.firstCardClicked) {
      this.firstCardClicked = card;
    } else {
      this.secondCardClicked = card;
      this.handleCardMatch();
    }
  }

  homePage() {
    this.gameContainer.style.display = "none";
    this.introPage.style.display = "flex";
    this.btnBlock.style.display = "none";
    this.startBtn.style.display = "block";
    this.message.style.display = "none";
    this.restartBtn.style.display = "none";
    this.scoreElement.style.display = "none";
  }
  backToHomePage() {
    const goBackToHomePageBtn = document.querySelector("#goBackToHomePageBtn");
    goBackToHomePageBtn.addEventListener("click", () => {
      this.homePage();
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
