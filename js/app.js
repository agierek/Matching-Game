const MAX_STARS = 3;
let GAME_STATE = {};
const SYMBOLS = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];
let CARDS = [];

function setMovesCount() {
  var counter = document.querySelector(".moves");
  counter.innerText = GAME_STATE.moves;
}

function showStars() {
  let starContainer = document.querySelector("ul.stars");
  starContainer.innerHTML = "";
  let emptyStars = MAX_STARS - GAME_STATE.stars;

  for (var i=0; i<GAME_STATE.stars; i++) {
    starContainer.innerHTML += '<li><i class="fa fa-star"></i></li>';
  }
  for (var i=0; i<emptyStars; i++) {
    starContainer.innerHTML += '<li><i class="fa fa-star-o"></i></li>';
  }
}

function countStars() {
  if (GAME_STATE.moves >=8 && GAME_STATE.moves <13) {
     return GAME_STATE.stars = 3;
  }
  if (GAME_STATE.moves >=13 && GAME_STATE.moves <17) {
     return GAME_STATE.stars = 2;
  }
  if (GAME_STATE.moves >=17) {
     return GAME_STATE.stars = 1;
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function createCard(symbol) {
  var card = document.createElement("li");
  card.innerHTML='<i class="fa '+symbol+'"></i>';
  card.setAttribute("class", "card");
  card.setAttribute("symbol", symbol);
  card.addEventListener("click", function(e) {
    if (GAME_STATE.ongoingMove) {
      return;
    }

    card.setAttribute("class", "card match");

    if (GAME_STATE.previousCard === null) {
      GAME_STATE.previousCard = card;

      return;
    }

    if (GAME_STATE.previousCard.getAttribute("symbol") !== card.getAttribute("symbol")) {
        var previousCard = GAME_STATE.previousCard;
        GAME_STATE.ongoingMove = true;
        setTimeout(function() {
          card.setAttribute("class", "card");
          previousCard.setAttribute("class", "card");
          GAME_STATE.ongoingMove = false;
        }, 1000);
    }

    if (GAME_STATE.previousCard.getAttribute("symbol") === card.getAttribute("symbol")) {
      incrementMatchedPairs();
    }

    GAME_STATE.previousCard = null;
    GAME_STATE.moves++;
    countStars();
    showStars();
    setMovesCount();

    if (chceckWin()) {
      displayVictoryScr();
    }
  });

  return card;
}

function init() {
  GAME_STATE = {
    moves: 0,
    stars: MAX_STARS,
    previousCard: null,
    ongoingMove:false,
    finished: false,
    matchedPairs: 0,
  };
  CARDS = [];

  SYMBOLS.forEach(function(symbol) {
    var domCard = createCard(symbol);
    CARDS.push(domCard);
    var domCard = createCard(symbol);
    CARDS.push(domCard);
  });

  shuffle(CARDS);

  let deck = document.getElementsByClassName("deck")[0];
  deck.innerHTML = "";

  for (var i = 0; i < CARDS.length; i++) {
    deck.appendChild(CARDS[i]);
  };

  setMovesCount();
  showStars();
}

function incrementMatchedPairs() {
  GAME_STATE.matchedPairs += 1;
}

function chceckWin () {
  return GAME_STATE.matchedPairs === 8;
}

function displayVictoryScr() {
  let victoryScr = document.querySelector(".victory-scr");
  victoryScr.style.display = "block";
  victoryScr.querySelector(".moves").innerHTML = GAME_STATE.moves;
  victoryScr.querySelector(".stars").innerHTML = GAME_STATE.stars;
  victoryScr.querySelector(".playAgain button").addEventListener("click", function(e) {
      victoryScr.style.display = "none";
      init();
  })
}

(function() {
  init();
  let restartBtn = document.querySelector(".restart");
  restartBtn.addEventListener("click", function(r) {
    init();
  });
})();
