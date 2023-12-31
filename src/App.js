import React, { useEffect, useState } from 'react';

import Collapsible from './components/Collapsible';

import { checkWin } from './utils';
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
    const currentIsGameInProgress = localStorage.getItem("isGameInProgress");
    if (e.target.innerHTML !== "" && currentIsGameInProgress || !currentIsGameInProgress) {
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
      processGameState("X"+selectedCell, "AI");
    } else {
      setMoveState("X");
      clickedCell.innerHTML = "O";
      clickedCell.classList.add(`${styles.unclickable}`);
      clickedCell.classList.add(`${styles.blue}`);
      localStorage.setItem("lastMoveState", "O");
      processGameState("O"+selectedCell, "AI");
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

  const processGameState = (latestMove, currentPlayer="player") => {
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
      setCurrentGameHistory((gameHistory) => ({ "moves": [...gameHistory["moves"], latestMove], "winner": latestMovePlayer }));
      makeAllCellsUnclickable();
      localStorage.setItem("winnerFromLastMove", "1");
      localStorage.setItem("isGameInProgress", "");
    } else {
      setCurrentGameHistory((gameHistory) => ({ "moves": [...gameHistory["moves"], latestMove], "winner": "" }));

      if (currentPlayer === "player") {
        setIsAiTurn(true);
      }
    }
  };

  const resetGame = (endGame=false) => {
    setMoveState("X");
    localStorage.setItem("savedGameState", JSON.stringify(Array(9).fill("")));
    localStorage.setItem("lastMoveState", "");
    localStorage.setItem("winnerFromLastMove", "");
    localStorage.setItem("movesPlayed", 0);
    localStorage.setItem("cellsToSelect", JSON.stringify(CELL_IDS));
    localStorage.setItem("currentGameHistory", JSON.stringify({}));

    setWinner("");
    setMovesPlayed(0);
    setCellsToSelect(CELL_IDS);
    setCurrentGameHistory({"moves": [], "winner": ""});

    if (endGame) {
      localStorage.setItem("isGameInProgress", "");
      setIsGameInProgress(false);
      return;
    } else {
      CELL_IDS.forEach((cell) => clearCell(cell));

      localStorage.setItem("isGameInProgress", "1");
      setIsGameInProgress(true);
    }
  }

  const clearGameHistory = () => {
    setPastGames([]);
  };

  useEffect(() => {
    const savedGameStateArray = JSON.parse(savedGameState);

    if (savedGameStateArray && savedGameStateArray.includes("") && !winnerFromLastMove) {
      savedGameStateArray.forEach((coordinate, index) => initializeCell(coordinate, index));
    } else {
      resetGame();
    }

    setIsGameInProgress(true);
    localStorage.setItem("isGameInProgress", "1");
  }, []);

  useEffect(() => {
    if (isAiTurn && aiMode && !winner) {
      if (cellsToSelect.length < 1) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * cellsToSelect.length);
      const selectedCell = cellsToSelect[randomIndex];

      aiClickCell(selectedCell);
    }
  }, [isAiTurn, aiMode, cellsToSelect, winner]);

  useEffect(() => {
    localStorage.setItem("currentGameHistory", JSON.stringify(currentGameHistory));

    if (winner || movesPlayed >= 9) {
      setPastGames((pastGames) => {
        if (pastGames.length > 0) {
          return [...pastGames, currentGameHistory];
        } else {
          return [currentGameHistory];
        }
      });

      resetGame(true);
    }
  }, [currentGameHistory, movesPlayed, winner]);

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
    <button className={styles.secondaryButton} onClick={() => resetGame()}>{isGameInProgress ? "Reset game" : "Play again"}</button>
    <h2 style={{ marginBottom: 0 }}>Previous games</h2>
    <p style={{ margin: 0 }}>Click a game to show the moves played.</p>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: "100%" }}>
      {pastGames.length > 0 && pastGames.map((pastGame, index) => <Collapsible title={`Game ${index + 1}: ${pastGame["winner"] != "" ? pastGame["winner"] : "No one"} won.`} key={`pastgame-${index}`}>
        <ol>
          {pastGame["moves"].map((move, moveIndex) => <li key={`pastgame-li-${moveIndex}`}>{move}</li>)} 
        </ol>
      </Collapsible>)}
      <button className={styles.secondaryButton} onClick={clearGameHistory}>Clear history</button>
    </div>
  </div>;
}
