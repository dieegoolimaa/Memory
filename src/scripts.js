class MemoryGame {
  constructor() {
    // Get references to DOM elements
    this.cards = document.querySelectorAll(".memory-card");
    this.gameContainer = document.querySelector(".game-container");
    this.introPage = document.querySelector(".introBlock");
    this.btnBlock = document.querySelector(".btnBlock");
    this.matchedAllCardsMessage = document.querySelector("#victoryMessage");
    this.displayGameOverMessage = document.querySelector("#gameOver");
    this.scoreElement = document.querySelector(".score");
    this.scoreElement.style.display = "none";
    this.timeBoard = document.querySelector(".timer");
    this.timeBoard.style.display = "none";
    this.startBtn = document.querySelector("#startBtn");
    this.restartBtn = document.querySelector("#restartBtn");

    this.restartBtn.addEventListener("click", () => this.startGame());
    this.startBtn.addEventListener("click", () => this.startGame());

    this.score = 0;
    this.multiplier = 10; // Increase score by 10 points per match

    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;
    this.duration = 10;
    this.timerInterval = null; // Single timer instance for better control
  }

  startGame() {
    this.introPage.style.display = "none";
    this.startBtn.style.display = "none";
    this.gameContainer.style.display = "flex";
    this.btnBlock.style.display = "flex";
    this.scoreElement.style.display = "block";
    this.timeBoard.style.display = "block";
    this.matchedAllCardsMessage.style.display = "none";
    this.displayGameOverMessage.style.display = "none";

    // Shuffle cards
    this.score = 0;
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.innerText = this.score;

    // Clear any existing timer interval before starting a new one
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.duration = 10; // Reset duration
    this.startTimer();
    this.resetBoard();
    this.shuffleCards();
    this.cards.forEach((card) => {
      card.classList.remove("flip");
      card.addEventListener("click", () => this.flipCard(card));
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

  handleCardMatch() {
    const firstCardContent = this.firstCardClicked.dataset.framework;
    const secondCardContent = this.secondCardClicked.dataset.framework;
    const isMatch = firstCardContent === secondCardContent;

    if (isMatch) {
      this.score += this.multiplier;
      this.disableCards();

      if (this.allCardsMatched()) {
        this.displayMotivationalMessage();
        clearInterval(this.timerInterval); // Stop the timer on win
        this.timeBoard.style.display = "none";
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
    this.matchedAllCardsMessage.style.display = "none";
    this.restartBtn.style.display = "none";
    this.scoreElement.style.display = "none";
    this.timeBoard.style.display = "none";
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

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTimerDisplay();
      if (this.duration <= 0) {
        this.gameOverByTime();
        clearInterval(this.timerInterval);
      }
      this.duration--;
    }, 1000); // Update every second
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = Math.floor(this.duration % 60);
    const formattedTime =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    this.timeBoard.innerText = formattedTime;
  }

  displayMotivationalMessage() {
    this.gameContainer.style.display = "none";
    this.matchedAllCardsMessage.style.display = "block";
    this.restartBtn.style.display = "block";
    this.displayGameOverMessage.style.display = "none";
  }

  gameOverByTime() {
    this.displayGameOverMessage.style.display = "block";
    this.gameContainer.style.display = "none";
    this.scoreElement.style.display = "none";
    this.timeBoard.style.display = "none";
    this.restartBtn.style.display = "block";
  }
}

// Initialize the game
const game = new MemoryGame();
