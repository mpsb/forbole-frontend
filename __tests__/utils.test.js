import { checkWin } from '../src/utils.js';

describe('checkWin', () => {
  it('should return the winning symbol for a winning combination', () => {
    const gameState = ["", "O", "O", "X", "X", "X", "", "", ""];
    const result = checkWin(gameState);
    expect(result).toBe('X');
  });

  it('should return null when there is no winner', () => {
    const gameState = ["O", "X", "O", "X", "X", "O", "X", "O", "X"];
    const result = checkWin(gameState);
    expect(result).toBeNull();
  });

  it('should return the winning symbol for a diagonal winning combination', () => {
    const gameState = ['X', 'O', 'X', 'O', 'X', 'O', null, null, 'X'];
    const result = checkWin(gameState);
    expect(result).toBe('X');
  });
});
