const giftExperience = document.querySelector("#gift-experience");
const openButton = document.querySelector("#open-gift");
const giftImage = document.querySelector("#gift-image");
const closedContent = document.querySelector("#closed-content");
const letterArea = document.querySelector("#letter-area");
const openStatus = document.querySelector("#open-status");
const liveRegion = document.querySelector("#gift-live");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let isOpening = false;

openButton.addEventListener("click", () => {
  if (isOpening || giftExperience.classList.contains("is-open")) {
    return;
  }

  isOpening = true;
  openButton.disabled = true;
  giftExperience.classList.remove("is-closed");
  giftExperience.classList.add("is-opening");
  liveRegion.textContent = "Abrindo o presente.";

  const transitionDuration = reduceMotion.matches ? 0 : 650;
  window.setTimeout(showLetter, transitionDuration);
});

function showLetter() {
  giftImage.src = "assets/presente-aberto.png";
  giftExperience.classList.remove("is-opening");
  giftExperience.classList.add("is-open");
  closedContent.hidden = true;
  openStatus.hidden = false;
  letterArea.setAttribute("aria-hidden", "false");
  liveRegion.textContent = "Presente aberto. Uma cartinha da Lara foi revelada.";
  isOpening = false;

  window.setTimeout(() => {
    letterArea.querySelector(".continue-button").focus({ preventScroll: true });
  }, reduceMotion.matches ? 0 : 300);
}
