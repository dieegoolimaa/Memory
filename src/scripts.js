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
    this.moveDisplay = document.querySelector("moveDisplay");
    this.scoreElement.style.display = "none";
    this.timeBoard = document.querySelector(".timer");
    this.timeBoard.style.display = "none";
    this.startBtn = document.querySelector("#startBtn");
    this.restartBtn = document.querySelector("#restartBtn");
    this.goBackBtn = document.querySelector("#goBackToHomePageBtn");

    this.restartBtn.addEventListener("click", () => this.startGame());
    this.startBtn.addEventListener("click", () => this.startGame());
    this.goBackBtn.addEventListener("click", () => this.homePage());

    this.score = 0;
    this.multiplier = 10; // Increase score by 10 points per match
    this.moveCount = 0;

    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;
    this.duration = 90;
    this.timerInterval = null; // Single timer instance for better control
  }

  // Methods

  // Display home page
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

  // Start the game
  startGame() {
    this.introPage.style.display = "none";
    this.startBtn.style.display = "none";
    this.gameContainer.style.display = "grid"; // This line controls the grid container visibility
    this.btnBlock.style.display = "flex";
    this.scoreElement.style.display = "block";
    this.timeBoard.style.display = "block";
    this.matchedAllCardsMessage.style.display = "none";
    this.displayGameOverMessage.style.display = "none";

    this.score = 0;
    const scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.innerText = this.score;

    this.shuffleCards();

    // Temporarily flip all cards to reveal images
    this.cards.forEach((card) => card.classList.add("flip"));
    let isCardRevealDone = false;

    setTimeout(() => {
      this.resetBoard();
      this.cards.forEach((card) => card.classList.remove("flip"));
      isCardRevealDone = true; // Set flag to indicate reveal is complete

      this.cards.forEach((card) => {
        if (isCardRevealDone) {
          // Check flag before adding event listener
          card.addEventListener("click", () => this.flipCard(card));
        }
      });

      this.startTimer();
    }, 3000); // Adjust the delay (in milliseconds) as needed

    // Clear any existing timer interval before starting a new one
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.duration = 90; // Reset duration
  }

  // Shuffle cards
  shuffleCards() {
    // Randomly order cards using Math.floor and requestAnimationFrame for smoother shuffling
    this.cards.forEach((card) => {
      card.style.order = Math.floor(Math.random() * 12);
      window.requestAnimationFrame(() => {
        card.style.transition = "transform 0.5s ease-in-out"; // Smooth shuffling animation
      });
    });
  }

  // Handle card match
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

  // Disable cards
  disableCards() {
    const disabledCards = [this.firstCardClicked, this.secondCardClicked];
    disabledCards.forEach((card) =>
      card.removeEventListener("click", this.flipCard)
    );

    this.resetBoard();
  }

  // Unflip cards
  unflipCards() {
    this.boardLocked = true;
    setTimeout(() => {
      this.firstCardClicked.classList.remove("flip");
      this.secondCardClicked.classList.remove("flip");
      this.resetBoard();
    }, 1300);
  }

  // Flip card
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

    this.moveCount += 1;
    console.log("Move count:", this.moveCount);

    const scoreDisplay = document.getElementById("moveDisplay");
    scoreDisplay.textContent = `${this.moveCount}`;
  }

  // Reset board
  resetBoard() {
    this.cardFlipped = false;
    this.boardLocked = false;
    this.firstCardClicked = null;
    this.secondCardClicked = null;
  }

  // Check if all cards are matched
  allCardsMatched() {
    return [...this.cards].every((card) => card.classList.contains("flip"));
  }

  // Start timer
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

  // Update timer display
  updateTimerDisplay() {
    const minutes = Math.floor(this.duration / 60);
    const seconds = Math.floor(this.duration % 60);
    const formattedTime =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    this.timeBoard.innerText = formattedTime;
  }

  // Display game over message
  displayMotivationalMessage() {
    this.gameContainer.style.display = "none";
    this.matchedAllCardsMessage.style.display = "block";
    this.restartBtn.style.display = "block";
    this.displayGameOverMessage.style.display = "none";
  }

  // Game over by time
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
