import { getFittedGridGeometry, getPiecePosition } from "./puzzle-core.js";

const board = document.querySelector("#board");
const backLink = document.querySelector(".back-link");
const difficulty = document.querySelector("#difficulty");
const shuffleButton = document.querySelector("#shuffle");
const undoButton = document.querySelector("#undo");
const hintButton = document.querySelector("#hint");
const hintBoardButton = document.querySelector("#hint-board");
const fullscreenButton = document.querySelector("#fullscreen");
const fullscreenPuzzle = document.querySelector(".board-card");
const movesElement = document.querySelector("#moves");
const progressElement = document.querySelector("#progress");
const completeMessage = document.querySelector("#complete-message");
const gameStatus = document.querySelector("#game-status");
const celebration = document.querySelector("#celebration");
const pieceFeedback = document.querySelector("#piece-feedback");
const demoMode = new URLSearchParams(window.location.search).get("demo");
const photoAspectRatio = 1080 / 1154;

const difficultySettings = {
  "50": { columns: 10, rows: 5 },
  "100": { columns: 10, rows: 10 },
  "150": { columns: 15, rows: 10 },
  "200": { columns: 20, rows: 10 }
};

let grid = getSelectedGrid();
let pieces = [];
let moves = demoMode === "complete" ? 23 : 0;
let previousPieces = null;
let activeDrag = null;
let feedbackTimer = null;
let renderFrame = null;

function createPieces() {
  const total = grid.columns * grid.rows;
  const scatterColumns = Math.ceil(Math.sqrt(total * 1.55));
  const scatterRows = Math.ceil(total / scatterColumns);
  const slots = Array.from({ length: total }, (_, index) => index);
  shuffleInPlace(slots);

  return Array.from({ length: total }, (_, id) => {
    const slot = slots[id];
    const column = slot % scatterColumns;
    const row = Math.floor(slot / scatterColumns);
    const jitterX = seededOffset(id, 17);
    const jitterY = seededOffset(id, 41);

    return {
      id,
      x: clamp((column + 0.5 + jitterX) / scatterColumns, 0.045, 0.955),
      y: clamp((row + 0.5 + jitterY) / scatterRows, 0.065, 0.935),
      locked: demoMode === "complete"
    };
  });
}

function renderBoard() {
  const width = board.clientWidth;
  const height = board.clientHeight;

  if (width === 0 || height === 0) {
    window.requestAnimationFrame(renderBoard);
    return;
  }

  const geometry = getGeometry(width, height);
  board.style.setProperty("--target-left", `${geometry.left}px`);
  board.style.setProperty("--target-top", `${geometry.top}px`);
  board.style.setProperty("--target-width", `${geometry.targetWidth}px`);
  board.style.setProperty("--target-height", `${geometry.targetHeight}px`);
  board.style.setProperty("--grid-columns", String(grid.columns));
  board.style.setProperty("--grid-rows", String(grid.rows));

  board.querySelectorAll(".piece").forEach((piece) => piece.remove());

  pieces.forEach((pieceState) => {
    const piece = document.createElement("button");
    const source = getPiecePosition(pieceState.id, grid.columns, grid.rows);
    const target = getTargetPosition(pieceState.id, geometry);
    const left = pieceState.locked ? target.x : pieceState.x * width - geometry.cellWidth / 2;
    const top = pieceState.locked ? target.y : pieceState.y * height - geometry.cellHeight / 2;

    piece.className = `piece shape-${pieceState.id % 4}`;
    piece.type = "button";
    piece.dataset.id = String(pieceState.id);
    piece.disabled = pieceState.locked;
    piece.style.width = `${geometry.cellWidth}px`;
    piece.style.height = `${geometry.cellHeight}px`;
    piece.style.left = `${clamp(left, 0, width - geometry.cellWidth)}px`;
    piece.style.top = `${clamp(top, 0, height - geometry.cellHeight)}px`;
    piece.style.backgroundSize = `${geometry.targetWidth}px ${geometry.targetHeight}px`;
    piece.style.backgroundPosition = `${-source.column * geometry.cellWidth}px ${-source.row * geometry.cellHeight}px`;
    piece.style.setProperty("--scatter-rotation", `${pieceState.locked ? 0 : seededRotation(pieceState.id)}deg`);
    piece.setAttribute(
      "aria-label",
      pieceState.locked
        ? `Peça ${pieceState.id + 1} encaixada.`
        : `Peça ${pieceState.id + 1}. Arraste até o lugar correto.`
    );

    if (pieceState.locked) {
      piece.classList.add("locked");
    } else {
      piece.addEventListener("pointerdown", startDrag);
      piece.addEventListener("keydown", handleKeyboardMove);
    }

    board.append(piece);
  });

  updateStats();
}

function startDrag(event) {
  const id = Number(event.currentTarget.dataset.id);
  const pieceState = pieces.find((piece) => piece.id === id);

  if (!pieceState || pieceState.locked) {
    return;
  }

  const rect = event.currentTarget.getBoundingClientRect();
  activeDrag = {
    id,
    element: event.currentTarget,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
    startX: pieceState.x,
    startY: pieceState.y,
    previousPieces: pieces.map((piece) => ({ ...piece }))
  };

  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.classList.add("dragging");
  event.currentTarget.addEventListener("pointermove", dragPiece);
  event.currentTarget.addEventListener("pointerup", finishDrag);
  event.currentTarget.addEventListener("pointercancel", finishDrag);
  gameStatus.innerHTML = "<span aria-hidden=\"true\">&#128161;</span><span>Leve a peça até a posição correta na foto.</span>";
}

function dragPiece(event) {
  if (!activeDrag) {
    return;
  }

  const bounds = board.getBoundingClientRect();
  const pieceState = pieces.find((piece) => piece.id === activeDrag.id);
  const pieceWidth = activeDrag.element.offsetWidth;
  const pieceHeight = activeDrag.element.offsetHeight;
  const left = clamp(event.clientX - bounds.left - activeDrag.offsetX, 0, bounds.width - pieceWidth);
  const top = clamp(event.clientY - bounds.top - activeDrag.offsetY, 0, bounds.height - pieceHeight);

  pieceState.x = (left + pieceWidth / 2) / bounds.width;
  pieceState.y = (top + pieceHeight / 2) / bounds.height;
  activeDrag.element.style.left = `${left}px`;
  activeDrag.element.style.top = `${top}px`;
  activeDrag.element.style.setProperty("--scatter-rotation", "0deg");
}

function finishDrag(event) {
  if (!activeDrag) {
    return;
  }

  const drag = activeDrag;
  const pieceState = pieces.find((piece) => piece.id === drag.id);
  const geometry = getGeometry(board.clientWidth, board.clientHeight);
  const target = getTargetPosition(pieceState.id, geometry);
  const centerX = pieceState.x * board.clientWidth;
  const centerY = pieceState.y * board.clientHeight;
  const targetCenterX = target.x + geometry.cellWidth / 2;
  const targetCenterY = target.y + geometry.cellHeight / 2;
  const distanceX = Math.abs(centerX - targetCenterX);
  const distanceY = Math.abs(centerY - targetCenterY);

  drag.element.releasePointerCapture?.(event.pointerId);
  drag.element.removeEventListener("pointermove", dragPiece);
  drag.element.removeEventListener("pointerup", finishDrag);
  drag.element.removeEventListener("pointercancel", finishDrag);
  drag.element.classList.remove("dragging");

  const moved = Math.hypot(pieceState.x - drag.startX, pieceState.y - drag.startY) > 0.004;
  if (moved) {
    previousPieces = drag.previousPieces;
    moves += 1;
  }

  if (
    distanceX <= Math.max(12, geometry.cellWidth * 0.58) &&
    distanceY <= Math.max(12, geometry.cellHeight * 0.58)
  ) {
    pieceState.locked = true;
    drag.element.classList.add("just-placed");
    showPieceFeedback();
  } else if (moved) {
    gameStatus.innerHTML = "<span aria-hidden=\"true\">&#128161;</span><span>Quase! Tente aproximar a peça do lugar correto.</span>";
  }

  activeDrag = null;
  renderBoard();

  if (isSolved()) {
    showCompletedState();
  }
}

function handleKeyboardMove(event) {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  previousPieces = pieces.map((piece) => ({ ...piece }));
  const pieceState = pieces.find((piece) => piece.id === Number(event.currentTarget.dataset.id));
  pieceState.locked = true;
  moves += 1;
  renderBoard();
  showPieceFeedback();

  if (isSolved()) {
    showCompletedState();
  }
}

function restartGame() {
  grid = getSelectedGrid();
  pieces = createPieces();
  moves = 0;
  previousPieces = null;
  activeDrag = null;
  hidePieceFeedback();
  board.classList.remove("hint", "solved");
  celebration.classList.remove("is-visible");
  completeMessage.hidden = true;
  setHintState(false);
  setDefaultHint();
  renderBoard();
}

function getGeometry(width, height) {
  return getFittedGridGeometry(width, height, grid.columns, grid.rows, photoAspectRatio);
}

function getTargetPosition(id, geometry) {
  const { row, column } = getPiecePosition(id, grid.columns, grid.rows);
  return {
    x: geometry.left + column * geometry.cellWidth,
    y: geometry.top + row * geometry.cellHeight
  };
}

function updateStats() {
  const locked = pieces.filter((piece) => piece.locked).length;
  const progress = pieces.length === 0 ? 0 : Math.round((locked / pieces.length) * 100);
  movesElement.textContent = String(moves);
  progressElement.textContent = `${progress}%`;
  undoButton.disabled = previousPieces === null || isSolved();
}

function isSolved() {
  return pieces.length > 0 && pieces.every((piece) => piece.locked);
}

function toggleHint() {
  board.classList.toggle("hint");
  setHintState(board.classList.contains("hint"));
  gameStatus.innerHTML = board.classList.contains("hint")
    ? "<span aria-hidden=\"true\">&#128161;</span><span>A foto completa aparece ao fundo para ajudar.</span>"
    : "<span aria-hidden=\"true\">&#128161;</span><span>Dica escondida. Continue montando a foto.</span>";
}

function showPieceFeedback() {
  pieceFeedback.hidden = false;
  gameStatus.innerHTML = "<span aria-hidden=\"true\">&#10003;</span><span><strong>Peça encaixada!</strong> Ela ficou bloqueada no lugar certo.</span>";
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(hidePieceFeedback, 950);
}

function hidePieceFeedback() {
  window.clearTimeout(feedbackTimer);
  pieceFeedback.hidden = true;
}

function showCompletedState() {
  board.classList.add("solved");
  completeMessage.hidden = false;
  celebration.classList.add("is-visible");
  gameStatus.innerHTML = "<span aria-hidden=\"true\">&#10084;</span><span><strong>Que lindo!</strong> A foto ficou completa.</span>";
  undoButton.disabled = true;
}

function setHintState(isVisible) {
  hintButton.querySelector("strong").textContent = isVisible ? "Esconder foto completa" : "Mostrar foto completa";
  hintBoardButton.firstChild.textContent = isVisible ? "Esconder foto completa " : "Ver foto completa ";
}

function setDefaultHint() {
  gameStatus.innerHTML = "<span aria-hidden=\"true\">&#128161;</span><span><strong>Dica:</strong> Comece pelas bordas e cores<br>marcantes para montar mais rápido!</span>";
}

function getSelectedGrid() {
  return difficultySettings[difficulty.value] ?? difficultySettings["50"];
}

function shuffleInPlace(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
}

function seededOffset(id, salt) {
  const value = Math.sin((id + 1) * (salt + 11)) * 10000;
  return (value - Math.floor(value) - 0.5) * 0.34;
}

function seededRotation(id) {
  return Math.round(seededOffset(id, 73) * 42);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

shuffleButton.addEventListener("click", restartGame);
difficulty.addEventListener("change", restartGame);
hintButton.addEventListener("click", toggleHint);
hintBoardButton.addEventListener("click", toggleHint);

undoButton.addEventListener("click", () => {
  if (!previousPieces) {
    return;
  }

  pieces = previousPieces;
  previousPieces = null;
  moves = Math.max(0, moves - 1);
  hidePieceFeedback();
  gameStatus.innerHTML = "<span aria-hidden=\"true\">&#8630;</span><span>Último movimento desfeito.</span>";
  renderBoard();
});

backLink.addEventListener("click", (event) => {
  event.preventDefault();
  const cameFromGift = document.referrer.endsWith("/") || document.referrer.endsWith("/index.html");

  if (cameFromGift) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
});

fullscreenButton.addEventListener("click", async () => {
  const fallbackActive = fullscreenPuzzle.classList.contains("is-puzzle-fullscreen");

  try {
    if (!document.fullscreenElement && !fallbackActive) {
      await fullscreenPuzzle.requestFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      fullscreenPuzzle.classList.remove("is-puzzle-fullscreen");
    }
  } catch {
    fullscreenPuzzle.classList.toggle("is-puzzle-fullscreen");
  }

  updateFullscreenButton();
});

document.addEventListener("fullscreenchange", () => {
  updateFullscreenButton();
  window.requestAnimationFrame(renderBoard);
});
window.addEventListener("resize", () => {
  window.cancelAnimationFrame(renderFrame);
  renderFrame = window.requestAnimationFrame(renderBoard);
});

function updateFullscreenButton() {
  const fallbackActive = fullscreenPuzzle.classList.contains("is-puzzle-fullscreen");
  const isFullscreen = document.fullscreenElement === fullscreenPuzzle || fallbackActive;
  document.body.classList.toggle("puzzle-fullscreen-active", isFullscreen);
  fullscreenButton.querySelector("span").textContent = isFullscreen ? "↙" : "⛶";
  fullscreenButton.setAttribute("aria-label", isFullscreen ? "Sair da tela cheia" : "Ativar tela cheia");

  window.requestAnimationFrame(renderBoard);
}

pieces = createPieces();
renderBoard();

if (demoMode === "hint") {
  board.classList.add("hint");
  setHintState(true);
}

if (demoMode === "complete") {
  showCompletedState();
}
