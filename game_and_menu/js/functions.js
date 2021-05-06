// генерує в випадкові послідовності картки (приймає кількість карток, масив карток та посилання куди вставити картки)
const drawCards = (amount, cards, containerRef) => {
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
          let string = `<div class="card card-${card.id}"><img src='./img/card-down.png' class="card__back" ><img class="card__photo" src="${card.src}" alt="${card.description}" data-id='${card.id}'></div>`;
          containerRef.insertAdjacentHTML("beforeend", string);
          setOfCards.splice(setOfCards.indexOf(random), 1);
        }
      }
    }
  }
};

let gameResult;
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
  };
  const repairCard = (event) => {
    event.target.classList.remove("choosed");
    state.ref.classList.remove("choosed");
    event.target.previousSibling.classList.remove("flip");
    state.ref.previousSibling.classList.remove("flip");
    state.blocked = false;
  };
  const playerCount = [...document.querySelectorAll(".game__player-counter")];
  const playerMessage = document.querySelector(".game__player-turn");
  // починає гру при сингл плеєрі і аркаді
  const compareCardSingle = () => {
    if (state.blocked) return;
    if (event.target === container) return;
    event.target.classList.add("choosed");
    event.target.previousSibling.classList.add("flip");
    if (state.position === 2) {
      if (state.ref === event.target) return;
      if (state.ref.dataset.id === event.target.dataset.id) {
        state.position = 1;
        state.blocked = true;
        setTimeout(removeCards, 400, event);
        state.gameState++;
        if (state.gameState === container.children.length / 2) {
          gameResult = "win";
          setTimeout(endGame, 500);
        }
      } else {
        state.position = 1;
        state.blocked = true;
        setTimeout(repairCard, 1800, event);
      }
    } else if (state.position === 1) {
      state.ref = event.target;
      state.position = 2;
    }
  };

  // починає гру при мульти плеєрі
  const compareCardMulti = () => {
    if (state.blocked) return;
    if (event.target === container) return;
    event.target.classList.add("choosed");
    event.target.previousSibling.classList.add("flip");
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
          state.maxCount = 0;
          state.winner = [];
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
          alert(string);
          setTimeout(endGame, 500);
        }
      } else {
        state.position = 1;
        state.blocked = true;
        state.move = state.move === playerAmount - 1 ? 0 : state.move + 1;
        setTimeout(repairCard, 800, event);
        setTimeout(function () {
          playerMessage.classList.remove("hidden");
          playerMessage.textContent = `Player-${state.move + 1} move`;
        }, 600);
        setTimeout(function () {
          playerMessage.classList.add("hidden");
          playerMessage.classList.remove("scaled");
        }, 1300);
      }
    } else if (state.position === 1) {
      state.ref = event.target;
      state.position = 2;
    }
  };
  if (gameType === "singlePlayer")
    container.addEventListener("click", compareCardSingle);
  if (gameType === "multiPlayer") {
    container.addEventListener("click", compareCardMulti);
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
  containerRef.querySelectorAll(".card").forEach((card) => {
    card.remove();
  });
  const timerRef = document.querySelector(".timer");
  const minutesRef = document.querySelector(".timer__minutes");
  const secondsRef = document.querySelector(".timer__seconds");
  if (gameType === "singlePlayer") {
    timerRef.classList.remove("hidden");
    setTimeout(timer, 1000, timerCount, minutesRef, secondsRef);
  }
  drawCards(cardsAmount, cards, containerRef);
  // document.querySelector(".audio__game-play").play();
  gamePlay(containerRef, playerAmount, gameType);
};

// закінчує гру
const endGame = (timerCount) => {
  document.querySelector(".audio__game-play").pause();
  if (timerCount + 1 === 0) {
    document.querySelector(".audio__lose").play();
    alert("loser");
  } else {
    document.querySelector(".audio__won").play();
    document.querySelector(".game__congratulation").classList.remove("hidden");
    alert("you won");
  }
};
// таймер (кількість часу, посилання на хилини, секунди)
const timer = (timerCount, minutesRef, secondsRef) => {
  let minutes = (timerCount / 60) % 60;
  let seconds = timerCount % 60 < 10 ? `0${timerCount % 60}` : timerCount % 60;
  if (gameResult === "win") return;
  if (timerCount < 0) {
    endGame(timerCount);
  } else {
    timerCount--;
    minutesRef.innerHTML = Math.floor(minutes);
    secondsRef.innerHTML = seconds;
    const tester = setTimeout(timer, 1000, timerCount, minutesRef, secondsRef);
    console.log(tester);
  }
};
