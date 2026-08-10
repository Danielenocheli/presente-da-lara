export function createOrderedPieces(totalPieces) {
  validateTotalPieces(totalPieces);
  return Array.from({ length: totalPieces }, (_, index) => index);
}

export function shufflePieces(totalPieces, random = Math.random) {
  const pieces = createOrderedPieces(totalPieces);

  for (let index = pieces.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [pieces[index], pieces[swapIndex]] = [pieces[swapIndex], pieces[index]];
  }

  if (isSolved(pieces)) {
    [pieces[0], pieces[1]] = [pieces[1], pieces[0]];
  }

  return pieces;
}

export function swapPieces(pieces, fromIndex, toIndex) {
  if (!Array.isArray(pieces)) {
    throw new TypeError("pieces precisa ser uma lista.");
  }

  if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) {
    throw new TypeError("indices precisam ser numeros inteiros.");
  }

  if (fromIndex < 0 || toIndex < 0 || fromIndex >= pieces.length || toIndex >= pieces.length) {
    throw new RangeError("indices fora do tabuleiro.");
  }

  const nextPieces = [...pieces];
  [nextPieces[fromIndex], nextPieces[toIndex]] = [nextPieces[toIndex], nextPieces[fromIndex]];
  return nextPieces;
}

export function isSolved(pieces) {
  return pieces.every((piece, index) => piece === index);
}

export function getProgress(pieces) {
  if (pieces.length === 0) {
    return 0;
  }

  const correctPieces = pieces.filter((piece, index) => piece === index).length;
  return Math.round((correctPieces / pieces.length) * 100);
}

export function getPiecePosition(pieceIndex, columns, rows) {
  validateGrid(columns, rows);

  if (!Number.isInteger(pieceIndex) || pieceIndex < 0 || pieceIndex >= columns * rows) {
    throw new RangeError("peca fora do tabuleiro.");
  }

  return {
    row: Math.floor(pieceIndex / columns),
    column: pieceIndex % columns
  };
}

export function getFittedGridGeometry(width, height, columns, rows, aspectRatio) {
  validateGrid(columns, rows);

  if (![width, height, aspectRatio].every(Number.isFinite) || width <= 0 || height <= 0 || aspectRatio <= 0) {
    throw new RangeError("dimensoes do tabuleiro invalidas.");
  }

  const isCompactBoard = width < 700;
  const availableWidth = width * (isCompactBoard ? 0.8 : 0.56);
  const availableHeight = height * (isCompactBoard ? 0.42 : 0.9);
  const targetWidth = Math.min(availableWidth, availableHeight * aspectRatio);
  const targetHeight = targetWidth / aspectRatio;

  return {
    cellWidth: targetWidth / columns,
    cellHeight: targetHeight / rows,
    targetWidth,
    targetHeight,
    left: isCompactBoard ? (width - targetWidth) / 2 : Math.max(24, width * 0.05),
    top: isCompactBoard ? 24 : (height - targetHeight) / 2
  };
}

function validateTotalPieces(totalPieces) {
  if (!Number.isInteger(totalPieces) || totalPieces < 4 || totalPieces > 400) {
    throw new RangeError("a quantidade de pecas deve estar entre 4 e 400.");
  }
}

function validateGrid(columns, rows) {
  if (!Number.isInteger(columns) || !Number.isInteger(rows) || columns < 2 || rows < 2) {
    throw new RangeError("a grade do quebra-cabeca precisa ter ao menos 2 colunas e 2 linhas.");
  }
}
