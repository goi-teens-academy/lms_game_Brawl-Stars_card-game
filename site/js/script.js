import cards from "./cards.js";
import { startGame } from "./functions.js";

const refs = {};
refs.containerRef = document.querySelector(".card-container");
refs.settingsRef = document.querySelector(".settings");
refs.cardsAmount = 12;
refs.timerCount = 60;
refs.playerAmount = 0;
refs.gameType = "singlePlayer";

document.querySelector(".start__btn").addEventListener("click", () => {
  document.querySelector(".settings").classList.remove("hidden-modal");
  document.querySelector(".start").classList.add("hidden-modal");
  document.querySelector(".audio__main-theme").play();
});

document
  .querySelector(".start__how-to-play")
  .addEventListener("click", () =>
    document.querySelector(".how-to-play").classList.remove("hidden-modal")
  );
document.querySelectorAll(".settings__type").forEach((type) => {
  type.addEventListener("click", () => {
    refs.gameType = event.target.dataset.type;
    document
      .querySelectorAll(".settings__by-type")
      .forEach((settings) => settings.classList.add("hidden-modal"));
    document
      .querySelector(`.settings__${event.currentTarget.dataset.type}`)
      .classList.remove("hidden-modal");
    document
      .querySelector(".settings__type--active")
       .classList.remove("settings__type--active");
    event.currentTarget.classList.add("settings__type--active");
    if (event.target.dataset.type === "singlePlayer") {
      refs.playerAmount = 0;
    }
    if (event.target.dataset.type === "multiPlayer") {
      refs.playerAmount = [...document
        .querySelector(".count-player__wrapper")
        .children].find((btn) =>
          btn.classList.contains("settings__btn--choosed")
        ).dataset.count;
    }
  });
});
document.querySelectorAll(".count-cards__wrapper").forEach((container) => {
  container.addEventListener("click", () => {
    if (event.target === event.currentTarget) return;
    refs.cardsAmount = +event.target.dataset.count;
    event.target.parentNode
      .querySelector(".settings__btn--choosed")
      .classList.remove("settings__btn--choosed");
    event.target.classList.add("settings__btn--choosed");
  });
});
document
  .querySelector(".count-timer__wrapper")
  .addEventListener("click", () => {
    if (event.target === event.currentTarget) return;
    refs.timerCount = +event.target.dataset.count;
    event.target.parentNode
      .querySelector(".settings__btn--choosed")
      .classList.remove("settings__btn--choosed");
    event.target.classList.add("settings__btn--choosed");
  });
document
  .querySelector(".count-player__wrapper")
  .addEventListener("click", () => {
    if (event.target === event.currentTarget) return;
    refs.playerAmount = +event.target.dataset.count;
    event.target.parentNode
      .querySelector(".settings__btn--choosed")
      .classList.remove("settings__btn--choosed");
    event.target.classList.add("settings__btn--choosed");
  });
document.querySelectorAll(".win__open-menu").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelector(".settings").classList.remove("hidden-modal");
    document.querySelector(".game__congratulation").classList.add("hidden");
    document.querySelector(".audio__main-theme").currentTime = 0;
    document.querySelector(".audio__main-theme").play();
    btn.parentNode.parentNode.classList.add("hidden-modal");
  })
);
document.querySelectorAll(".win__replay").forEach((btn) =>
  btn.addEventListener("click", () => {
    startGame(
      refs.cardsAmount,
      cards,
      refs.containerRef,
      refs.timerCount,
      refs.playerAmount,
      refs.gameType
    );
    btn.parentNode.parentNode.classList.add("hidden-modal");
    document.querySelector(".game__congratulation").classList.add("hidden");
  })
);
document
  .querySelector(".settings__start-btn")
  .addEventListener("click", function () {
    startGame(
      refs.cardsAmount,
      cards,
      refs.containerRef,
      refs.timerCount,
      refs.playerAmount,
      refs.gameType
    );
    refs.settingsRef.classList.add("hidden-modal");
  });