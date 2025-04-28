const cardImages = ["🤡", "👺", "👹", "🩸", "🪓", "🔪"]
let cards = []
let flippedCards = []
let disableClick = false

const flipSound = document.getElementById("flip-sound")
const matchSounds = document.querySelectorAll(".match")
const failSound = document.getElementById("fail-sound")

let timer
let timeLeft = 30
let i = 0

const randomSound = () => {
  if (i === matchSounds.length) {
    i = 0
  }
  const sound = matchSounds[i]
  i++
  return sound
}

const shuffleArray = (array) => {
  const newArray = [...array, ...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false,
  }))
}

const renderCards = () => {
  const board = document.getElementById("game-board")
  board.innerHTML = ""
  cards.forEach((card) => {
    const cardElement = document.createElement("div")
    cardElement.className =
      "card" + (card.flipped || card.matched ? " flipped" : "")
    if (card.flipped || card.matched) {
      cardElement.textContent = card.emoji
    } else {
      cardElement.innerHTML = `<img src="./joker_icon.gif" width="40">`
    }
    cardElement.addEventListener("click", () => handleCardClick(card))
    board.appendChild(cardElement)
  })
}

const handleCardClick = (card) => {
  if (disableClick || card.flipped || card.matched) return
  flipSound.play()
  card.flipped = true
  flippedCards.push(card)
  renderCards()

  if (flippedCards.length === 2) {
    disableClick = true
    setTimeout(() => {
      const [first, second] = flippedCards
      if (first.emoji === second.emoji) {
        first.matched = true
        second.matched = true
        randomSound().play()
      } else {
        first.flipped = false
        second.flipped = false
        failSound.play()
      }
      flippedCards = []
      disableClick = false
      renderCards()

      if (cards.every((card) => card.matched)) {
        clearInterval(timer)
        setTimeout(() => {
          alert("🤡 don't think you won, you just learned 🤡")
          resetGame()
        }, 500)
      }
    }, 1000)
  }
}

const startTimer = () => {
  clearInterval(timer)

  // read difficulty from localStorage
  const difficulty = localStorage.getItem("difficulty") || "fast"

  if (difficulty === "slow") {
    timeLeft = 50
  } else if (difficulty === "medium") {
    timeLeft = 40
  } else {
    timeLeft = 30
  }

  document.getElementById("timer").textContent = `Time: ${timeLeft}s`
  document.getElementById("timer").style.display = "block"

  timer = setInterval(() => {
    timeLeft--
    document.getElementById("timer").textContent = `Time: ${timeLeft}s`
    if (timeLeft <= 0) {
      clearInterval(timer)
      alert("🪦it's time ⋆༺𓆩☠︎︎𓆪༻⋆ to bury you🪦")
      resetGame()
    }
  }, 1000)
}

const resetGame = () => {
  cards = shuffleArray(cardImages)
  flippedCards = []
  disableClick = false
  renderCards()
  startTimer()
}

document.getElementById("reset-button").addEventListener("click", resetGame)

window.onload = () => {
  resetGame()
}
