import assert from "node:assert/strict";
import {
  createOrderedPieces,
  getPiecePosition,
  getProgress,
  isSolved,
  shufflePieces,
  swapPieces
} from "../src/puzzle-core.js";

assert.equal(isSolved([0, 1, 2, 3]), true);
assert.equal(isSolved([1, 0, 2, 3]), false);
assert.deepEqual(swapPieces([0, 1, 2, 3], 0, 3), [3, 1, 2, 0]);
assert.equal(createOrderedPieces(50).length, 50);
assert.deepEqual(createOrderedPieces(100).slice(0, 5), [0, 1, 2, 3, 4]);
assert.equal(createOrderedPieces(150).length, 150);
assert.equal(createOrderedPieces(200).length, 200);
assert.deepEqual(createOrderedPieces(100).slice(-3), [97, 98, 99]);
assert.deepEqual(getPiecePosition(17, 15, 10), { row: 1, column: 2 });
assert.equal(getProgress([0, 2, 1, 3]), 50);

const shuffled = shufflePieces(100, () => 0);
assert.equal(shuffled.length, 100);
assert.equal(new Set(shuffled).size, 100);
assert.equal(isSolved(shuffled), false);

assert.throws(() => createOrderedPieces(3), RangeError);
assert.throws(() => swapPieces([0, 1], -1, 1), RangeError);

console.log("Todos os testes de logica do quebra-cabeca passaram.");
