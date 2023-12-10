export const checkWin = (gameState) => {
  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
  ];

  const cells = gameState;
  let winner;

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      winner = cells[a];
      break;
    }
  }

  return winner;
};
