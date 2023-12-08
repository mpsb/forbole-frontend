import React, { useEffect, useState } from 'react';

import Collapsible from './components/Collapsible';

import * as styles from './index.module.css';

const CELL_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"];

export function App() {
  const aiModeState = localStorage.getItem("aiMode");
  const cellsToSelectState = localStorage.getItem("cellsToSelect");
  const currentGameHistoryState = localStorage.getItem("currentGameHistory");
  const isAiTurnState = localStorage.getItem("isAiTurn");
  const isGameInProgressState = localStorage.getItem("isGameInProgress");
  const lastMoveState = localStorage.getItem("lastMoveState");
  const movesPlayedState = localStorage.getItem("movesPlayed");
  const pastGamesState = localStorage.getItem("pastGames");
  const winnerFromLastMove = localStorage.getItem("winnerFromLastMove");
  const savedGameState = localStorage.getItem("savedGameState");
  const [ aiMode, setAiMode ] = useState(aiModeState ? parseInt(aiModeState) : false);
  const [ isAiTurn, setIsAiTurn ] = useState(isAiTurnState ? parseInt(isAiTurnState) : false);
  const [ cellsToSelect, setCellsToSelect ] = useState(cellsToSelectState ? JSON.parse(cellsToSelectState) : CELL_IDS);
  const [ currentGameHistory, setCurrentGameHistory ] = useState(currentGameHistoryState ? JSON.parse(currentGameHistoryState) : { "moves": [], "winner": "" });
  const [ isGameInProgress, setIsGameInProgress ] = useState(isGameInProgressState ? true : false);
  const [ movesPlayed, setMovesPlayed ] = useState(movesPlayedState ? parseInt(movesPlayedState) : 0);
  const [ moveState, setMoveState ] = useState(lastMoveState === "X" ? "O" : "X");
  const [ pastGames, setPastGames ] = useState(pastGamesState ? JSON.parse(pastGamesState) : []);
  const [ winner, setWinner ] = useState("");

  const checkWin = (gameState) => {
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

  const clearCell = (cell) => {
    const selectedCell = document.getElementById(cell);

    selectedCell.innerHTML = "";
    selectedCell.classList.remove(`${styles.unclickable}`);
    selectedCell.classList.remove(`${styles.red}`);
    selectedCell.classList.remove(`${styles.blue}`);
  };

  const initializeCell = (coordinate, index) => {
    const selectedCellElement = document.getElementById("c" + (index+1));

    if (coordinate === "") {
      return;
    }

    selectedCellElement.innerHTML = coordinate;
    selectedCellElement.classList.add(`${styles.unclickable}`);
    selectedCellElement.classList.add(`${coordinate === "X" ? styles.red : styles.blue}`);
  };

  const makeAllCellsUnclickable = () => {
    CELL_IDS.forEach((coordinate) => {
      document.getElementById(coordinate).classList.add(`${styles.unclickable}`);
    })
  };

  const onClickCell = (e) => {
    if (e.target.innerHTML !== "" && isGameInProgress || !isGameInProgress) {
      e.stopPropagation();
      e.preventDefault();

      return;
    }

    setIsGameInProgress(true);
    localStorage.setItem("isGameInProgress", "1");
    setMovesPlayed((movesPlayed) => {
      const newMovesPlayed = movesPlayed + 1;
      localStorage.setItem("movesPlayed", newMovesPlayed);

      return newMovesPlayed;
    });

    const clickedCell = document.getElementById(e.target.id);
    setCellsToSelect((cellsToSelect) => cellsToSelect.filter(cell => cell !== e.target.id));

    if (moveState === "X") {
      setMoveState("O");
      clickedCell.innerHTML = "X";
      clickedCell.classList.add(`${styles.unclickable}`);
      clickedCell.classList.add(`${styles.red}`);
      localStorage.setItem("lastMoveState", "X");
      processGameState("X"+e.target.id);
    } else {
      setMoveState("X");
      clickedCell.innerHTML = "O";
      clickedCell.classList.add(`${styles.unclickable}`);
      clickedCell.classList.add(`${styles.blue}`);
      localStorage.setItem("lastMoveState", "O");
      processGameState("O"+e.target.id);
    }

    setIsAiTurn(true);
  };

  const aiClickCell = (selectedCell) => {
    setMovesPlayed((movesPlayed) => {
      const newMovesPlayed = movesPlayed + 1;
      localStorage.setItem("movesPlayed", newMovesPlayed);

      return newMovesPlayed;
    });

    const clickedCell = document.getElementById(selectedCell); 
    setCellsToSelect((cellsToSelect) => cellsToSelect.filter(cell => cell !== selectedCell));

    if (moveState === "X") {
      setMoveState("O");
      clickedCell.innerHTML = "X";
      clickedCell.classList.add(`${styles.unclickable}`);
      clickedCell.classList.add(`${styles.red}`);
      localStorage.setItem("lastMoveState", "X");
      processGameState("X"+selectedCell);
    } else {
      setMoveState("X");
      clickedCell.innerHTML = "O";
      clickedCell.classList.add(`${styles.unclickable}`);
      clickedCell.classList.add(`${styles.blue}`);
      localStorage.setItem("lastMoveState", "O");
      processGameState("O"+selectedCell);
    }

    setIsAiTurn(false);
  }

  const setAIModeWithLocalStorage = (mode) => {
    if (mode) {
      setAiMode(true);
      localStorage.setItem("aiMode", "1");
    } else {
      setAiMode(false);
      localStorage.setItem("aiMode", "");
    }
  }

  const processGameState = (latestMove) => {
    const latestMovePosition = parseInt(latestMove.slice(2));
    const latestMovePlayer = latestMove[0];

    let savedGameStateArray = JSON.parse(savedGameState);
    if (savedGameState) {
      savedGameStateArray[latestMovePosition - 1] = latestMovePlayer;
      localStorage.setItem("savedGameState", JSON.stringify(savedGameStateArray));
    }

    const winState = checkWin(savedGameStateArray); 

    if (winState) {
      setWinner(winState);
      setIsGameInProgress(false);
      console.log('latestMovePlayer', latestMovePlayer);
      setCurrentGameHistory((gameHistory) => ({ "moves": gameHistory["moves"], "winner": latestMovePlayer }));
      makeAllCellsUnclickable();
      localStorage.setItem("winnerFromLastMove", "1");
      localStorage.setItem("isGameInProgress", "");
    } else {
      setCurrentGameHistory((gameHistory) => ({ "moves": [...gameHistory["moves"], latestMove], "winner":"" }));
    }
  };

  const resetGame = () => {
    setMoveState("X");
    localStorage.setItem("savedGameState", JSON.stringify(Array(9).fill("")));
    localStorage.setItem("lastMoveState", "");
    localStorage.setItem("isGameInProgress", "1");
    localStorage.setItem("winnerFromLastMove", "");
    localStorage.setItem("movesPlayed", 0);
    localStorage.setItem("cellsToSelect", JSON.stringify(CELL_IDS));
    localStorage.setItem("currentGameHistory", JSON.stringify({}));

    CELL_IDS.forEach((cell) => clearCell(cell));

    setIsGameInProgress(true);
    setWinner("");
    setMovesPlayed(0);
    setCellsToSelect(CELL_IDS);
    setCurrentGameHistory({"moves": [], "winner": ""});
  }

  const clearGameHistory = () => {
    setPastGames([]);
  };

  useEffect(() => {
    const savedGameStateArray = JSON.parse(savedGameState);

    if (!winnerFromLastMove) {
      savedGameStateArray.forEach((coordinate, index) => initializeCell(coordinate, index));
    } else {
      resetGame();
    }
  }, []);

  useEffect(() => {
    if (isAiTurn && aiMode && isGameInProgress) {
      if (cellsToSelect.length < 1) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * cellsToSelect.length);
      const selectedCell = cellsToSelect[randomIndex];

      aiClickCell(selectedCell);
    }
  }, [isAiTurn, aiMode, cellsToSelect, isGameInProgress]);

  useEffect(() => {
    console.log('currentGameHistory', currentGameHistory);
    localStorage.setItem("currentGameHistory", JSON.stringify(currentGameHistory));

    if (currentGameHistory["winner"] || movesPlayed >= 9) {
      setPastGames((pastGames) => {
        if (pastGames.length > 0) {
          return [...pastGames, currentGameHistory];
        } else {
          return [currentGameHistory];
        }
      });

      setIsGameInProgress(false);
      localStorage.setItem("isGameInProgress", "");
    }
  }, [currentGameHistory, movesPlayed]);

  useEffect(() => {
    localStorage.setItem("pastGames", JSON.stringify(pastGames));
  }, [pastGames]);

  return <div className={styles.gameContainer}>
    <h1 style={{ textAlign: 'center', marginBottom: 0 }}>The most satisfying<br/>Tic-Tac-Toe Game.</h1>
    <p style={{ textAlign: 'center', margin: 0 }}>Click any of the cells to start a game.<br/>Or click below to start a game with the AI.</p>
    {aiMode ? <button className={styles.primaryAlertButton} onClick={() => setAIModeWithLocalStorage(false)}>Stop playing with AI</button> : <button className={styles.primaryButton} onClick={() => setAIModeWithLocalStorage(true)}>Play with AI</button>}
    <div className={styles.ticTacToeContainer}>
      <div className={styles.ticTacToeGrid}>
        <div className={styles.row}>
          <button className={styles.cell} onClick={onClickCell} id="c1"></button>
          <button className={styles.cell} onClick={onClickCell} id="c2"></button>
          <button className={styles.cell} onClick={onClickCell} id="c3"></button>
        </div>
        <div className={styles.row}>
          <button className={styles.cell} onClick={onClickCell} id="c4"></button>
          <button className={styles.cell} onClick={onClickCell} id="c5"></button>
          <button className={styles.cell} onClick={onClickCell} id="c6"></button>
        </div>
        <div className={styles.row}>
          <button className={styles.cell} onClick={onClickCell} id="c7"></button>
          <button className={styles.cell} onClick={onClickCell} id="c8"></button>
          <button className={styles.cell} onClick={onClickCell} id="c9"></button>
        </div>
      </div>
    </div>
    {movesPlayed >= 9 && winner === "" ? "No winner." : null}
    {!isGameInProgress && winner !== "" ? <p style={{ textAlign: 'center' }}>{`${winner} has won.`}</p> : null}
    <button className={styles.secondaryButton} onClick={resetGame}>{isGameInProgress ? "Reset game" : "Play again"}</button>
    <h2 style={{ marginBottom: 0 }}>Previous games</h2>
    <p style={{ margin: 0 }}>Click a game to show the moves played.</p>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: "100%" }}>
      {pastGames.length > 0 && pastGames.map((pastGame, index) => <Collapsible title={`Game ${index + 1}: ${pastGame["winner"] != "" ? pastGame["winner"] : "No one"} won.`}>
        <ol>
          {pastGame["moves"].map((move) => <li>{move}</li>)} 
        </ol>
      </Collapsible>)}
      <button className={styles.secondaryButton} onClick={clearGameHistory}>Clear history</button>
    </div>
  </div>;
}
