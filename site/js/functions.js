// генерує в випадкові послідовності картки (приймає кількість карток, масив карток та посилання куди вставити картки)
const drawCards = (amount, cards, containerRef) => {
  containerRef.querySelectorAll(".card").forEach((card) => card.remove());
  let collection = [];
  while (!(collection.length === amount)) {
    let random = Math.ceil(Math.random() * cards.length);
    if (!collection.includes(random)) {
      collection.push(random);
    }
    if (collection.length === amount / 2) {
      collection = [...collection, ...collection];
      let setOfCards = collection.slice();
      while (!(setOfCards.length === 0)) {
        random = Math.ceil(Math.random() * cards.length);
        if (setOfCards.includes(random)) {
          let card = cards.find((card) => card.id === random);
          let string = `<div class="card card-${card.id}"><img data-id='${card.id}' src='./img/card-down.png' class="card__back" ><img class="card__photo" src="${card.src}" alt="${card.description}" data-id='${card.id}'></div>`;
          containerRef.insertAdjacentHTML("beforeend", string);
          setOfCards.splice(setOfCards.indexOf(random), 1);
        }
      }
    }
  }
};
let gameResult;
const funcGlob = {};
// починає гру на заданому контейнері карток (контейнер карток, тип гри)
const gamePlay = (container, playerAmount, gameType) => {
  const state = {
    ref: "",
    id: 0,
    position: 1,
    gameState: 0,
    blocked: false,
    move: 0,
    count: [0, 0, 0, 0],
  };
  const removeCards = (event) => {
    event.target.classList.add("scaled");
    state.ref.classList.add("scaled");
    event.target.parentNode.classList.add("hidden");
    state.ref.parentNode.classList.add("hidden");
    state.blocked = false;
    setTimeout(() => {
      event.target.classList.remove("scaled");
      state.ref.classList.remove("scaled");
    }, 300);
  };
  const repairCard = (event) => {
    event.target.nextSibling.classList.remove("choosed");
    state.ref.nextSibling.classList.remove("choosed");
    event.target.classList.remove("flip");
    state.ref.classList.remove("flip");
    state.blocked = false;
  };
  const playerCount = [...document.querySelectorAll(".game__player-counter")];
  const playerMessage = document.querySelector(".game__player-turn");
  // починає гру при сингл плеєрі і аркаді
  funcGlob.compareCardSingle = () => {
    if (state.blocked || !event.target.classList.contains("card__back")) return;
    event.target.classList.add("flip");
    event.target.nextSibling.classList.add("choosed");
    if (state.position === 2) {
      if (state.ref === event.target) return;
      if (state.ref.dataset.id === event.target.dataset.id) {
        state.position = 1;
        state.blocked = true;
        setTimeout(removeCards, 400, event);
        state.gameState++;
        if (state.gameState === container.children.length / 2) {
          state.gameState = 0;
          gameResult = "win";
          container.removeEventListener("click", compareCardSingle);
          setTimeout(endGame, 500, 1, container.children.length);
        }
      }
     if (state.ref.dataset.id !== event.target.dataset.id){
        state.position = 1;
        state.blocked = true;
        setTimeout(repairCard, 1000, event);
      }
    }
    else if (state.position === 1) {
      state.ref = event.target;
      state.position = 2;
    }
  };

  // починає гру при мульти плеєрі
  funcGlob.compareCardMulti = () => {
    if (state.blocked || !event.target.classList.contains("card__back")) return;
    event.target.classList.add("flip");
    event.target.nextSibling.classList.add("choosed");
    if (state.position === 2) {
      if (state.ref === event.target) return;
      if (state.ref.dataset.id === event.target.dataset.id) {
        state.position = 1;
        state.blocked = true;
        setTimeout(removeCards, 400, event);
        state.gameState++;
        playerCount[state.move].textContent++;
        state.count[state.move]++;
        if (state.gameState === container.children.length / 2) {
          state.gameState = 0;
          state.maxCount = 0;
          state.winner = [];
          setTimeout(() => {
            const gameCounterRef = document.querySelectorAll(
              ".game__player-counter"
            );
            for (let i = 0; i < playerAmount; i++) {
              gameCounterRef[i].classList.add("hidden");
              console.log(gameCounterRef[i]);
            }
          }, 500);
          state.count.map(
            (player) =>
              (state.maxCount =
                state.maxCount < player ? player : state.maxCount)
          );
          state.count.map((player, index) =>
            state.maxCount === player ? state.winner.push(index) : 1
          );
          let string = "Winner:";
          for (const player of state.winner) {
            string = `${string} player-${player + 1}`;
          }
          document.querySelector(".win__headline").textContent = string;
          container.removeEventListener("click", compareCardMulti);
          playerCount[state.move].classList.add(
            "game__player-counter--current"
          );

          setTimeout(endGame, 500, 1, container.children.length);
        }
      } else {
        state.position = 1;
        state.blocked = true;
        playerCount[state.move].classList.remove(
          "game__player-counter--current"
        );
        state.move = state.move === playerAmount - 1 ? 0 : state.move + 1;
        playerCount[state.move].classList.add("game__player-counter--current");

        setTimeout(repairCard, 800, event);
        setTimeout(function () {
          playerMessage.classList.remove("hidden");
          playerMessage.textContent = `Player-${state.move + 1} move`;
        }, 600);
        setTimeout(function () {
          playerMessage.classList.add("hidden");
        }, 1500);
      }
    } else if (state.position === 1) {
      state.ref = event.target;
      state.position = 2;
    }
  };
  if (gameType === "singlePlayer")
    container.addEventListener("click", funcGlob.compareCardSingle);
  if (gameType === "multiPlayer") {
    container.addEventListener("click", funcGlob.compareCardMulti);
    playerCount[state.move].classList.add("game__player-counter--current");
    playerCount.forEach((count) => (count.textContent = 0));
  }
};

// розпочинає гру із заданими параметрами

export const startGame = (
  cardsAmount,
  cards,
  containerRef,
  timerCount,
  playerAmount,
  gameType
) => {
  containerRef.classList.add(`card-container--${cardsAmount}`);
  document.querySelector(".game").classList.remove("hidden-modal");
  drawCards(cardsAmount, cards, containerRef);
  const numbersRef = document.querySelector(".game__start-number-wrapper");
  numbersRef.classList.remove("hidden-modal");
  const countdownRef = document.querySelector(".audio__countdown");
  countdownRef.currentTime = 0.3;
  // countdownRef.speed = 2;
  countdownRef.play();
  document.querySelector(".audio__main-theme").pause();
  let index = 0;
  numbersRef.children[index].classList.remove("hidden-modal");
  const startNumber = setInterval(() => {
    if (index !== 0)
      numbersRef.children[index - 1].classList.add("hidden-modal");
    if (index === 4) {
      clearInterval(startNumber);
      numbersRef.classList.add("hidden-modal");
      return;
    }
    // numbersRef.children[index].classList.add("scaled");
    numbersRef.children[index].classList.remove("hidden-modal");
    index++;
  }, 1400);
  setTimeout(function () {
    countdownRef.pause();
    const gameCounterRef = [
      ...document.querySelectorAll(".game__player-counter"),
    ];

    for (let i = 0; i < playerAmount; i++) {
      gameCounterRef[i].classList.remove("hidden");
      console.log(gameCounterRef[i]);
    }
    const timerRef = document.querySelector(".timer");
    const minutesRef = document.querySelector(".timer__minutes");
    const secondsRef = document.querySelector(".timer__seconds");
    if (gameType === "singlePlayer") {
      timerRef.classList.remove("hidden-modal");
      timer(timerCount, minutesRef, secondsRef, cardsAmount);
    }
    document.querySelector(".audio__game-play").currentTime = 0;
    document.querySelector(".audio__game-play").play();
    gamePlay(containerRef, playerAmount, gameType);
  }, 7400);
};

// закінчує гру
const endGame = (timerCount, cardsAmount) => {
  const containerRef = document.querySelector(".card-container");
  containerRef.removeEventListener("click", funcGlob.compareCardSingle);
  containerRef.classList.remove(`card-container--${cardsAmount}`);
  document.querySelector(".game").classList.add("hidden-modal");
  document.querySelector(".audio__game-play").pause();
  document.querySelector(".timer").classList.add("hidden-modal");
  if (timerCount + 1 === 0) {
    document.querySelector(".audio__lose").play();
    document.querySelector(".lose").classList.remove("hidden-modal");
    gameResult = "";
  } else {
    document.querySelector(".audio__won").play();
    document.querySelector(".win").classList.remove("hidden-modal");
    document.querySelector(".game__congratulation").classList.remove("hidden");
  }
};
// таймер (кількість часу, посилання на хилини, секунди)
const timer = (timerCount, minutesRef, secondsRef, cardsAmount) => {
  let minutes = (timerCount / 60) % 60;
  let seconds = timerCount % 60 < 10 ? `0${timerCount % 60}` : timerCount % 60;
  if (gameResult === "win") {
    document.querySelector(
      ".win__headline"
    ).textContent = `You win in ${timerCount} seconds`;
    gameResult = "";
    return;
  }
  if (timerCount < 0) {
    endGame(timerCount, cardsAmount);
  } else {
    timerCount--;
    minutesRef.innerHTML = Math.floor(minutes);
    secondsRef.innerHTML = seconds;
    setTimeout(timer, 1000, timerCount, minutesRef, secondsRef);
  }
};
