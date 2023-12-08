import React, { useEffect, useState } from 'react';

import * as styles from './index.module.css';

const CELL_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"];

export function App() {
  const isGameEndedState = localStorage.getItem("isGameEnded");
  const lastMoveState = localStorage.getItem("lastMoveState");
  const savedGameState = localStorage.getItem("savedGameState");
  const savedOGameState = localStorage.getItem("savedOGameState");
  const savedXGameState = localStorage.getItem("savedXGameState");
  const [ isGameEnded, setIsGameEnded ] = useState(isGameEndedState ? true : false);
  const [ moveState, setMoveState ] = useState(lastMoveState === "X" ? "O" : "X");

  const clearCell = (cell) => {
    const selectedCell = document.getElementById(cell);

    selectedCell.innerHTML = "";
    selectedCell.classList.remove(`${styles.unclickable}`);
    selectedCell.classList.remove(`${styles.red}`);
    selectedCell.classList.remove(`${styles.blue}`);
  }

  const initializeCell = (coordinate) => {
    const move = coordinate[0];
    const cell = coordinate.slice(1);
    const selectedCellElement = document.getElementById(cell);

    selectedCellElement.innerHTML = move;
    selectedCellElement.classList.add(`${styles.unclickable}`);
    selectedCellElement.classList.add(`${move === "X" ? styles.red : styles.blue}`);
  };

  const onClickCell = (e) => {
    console.log("event", e.target);
    if (e.target.innerHTML !== "") {
      e.stopPropagation();
      e.preventDefault();

      return;
    }

    setIsGameEnded(false);
    localStorage.setItem("isGameEnded", "");
    
    const clickedCell = document.getElementById(e.target.id); 
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

  const processGameState = (latestMove) => {
    console.log("latestMove", latestMove);

    if (savedGameState) {
      let savedGameStateArray = JSON.parse(savedGameState);

      if (savedGameStateArray.length > 8) {
        localStorage.setItem("savedGameState", JSON.stringify([latestMove]));
      } else {
        savedGameStateArray.push(latestMove);
        localStorage.setItem("savedGameState", JSON.stringify(savedGameStateArray));
      }
    } else {
      localStorage.setItem("savedGameState", JSON.stringify([latestMove]));
    }

    if (latestMove[0] === "X") {
      let savedXGameStateArray = JSON.parse(savedXGameState);


      if (savedXGameStateArray.length > 4) {
        localStorage.setItem("savedXGameState", JSON.stringify([latestMove]));
      } else {
        savedXGameStateArray.push(latestMove);
        localStorage.setItem("savedXGameState", JSON.stringify(savedXGameStateArray));
      }
    } else {
      let savedOGameStateArray = JSON.parse(savedOGameState);

      if (savedOGameStateArray.length > 4) {
        localStorage.setItem("savedOGameState", JSON.stringify([latestMove]));
      } else {
        savedOGameStateArray.push(latestMove);
        localStorage.setItem("savedOGameState", JSON.stringify(savedOGameStateArray));
      }
    }
  };

  const resetGame = () => {
    setMoveState("X");
    localStorage.setItem("savedGameState", JSON.stringify([]));
    localStorage.setItem("savedOGameState", JSON.stringify([]));
    localStorage.setItem("savedXGameState", JSON.stringify([]));
    localStorage.setItem("lastMoveState", "");
    localStorage.setItem("isGameEnded", "1");

    CELL_IDS.forEach((cell) => clearCell(cell));

    setIsGameEnded(true);
  }

  useEffect(() => {
    const savedGameStateArray = JSON.parse(savedGameState);

    if (savedGameStateArray.length > 0) {
      savedGameStateArray.forEach((coordinate) => initializeCell(coordinate));
    }
  }, []);

  return <div className={styles.gameContainer}>
    <h1 style={{ textAlign: 'center', marginBottom: 0 }}>The most satisfying<br/>Tic-Tac-Toe Game</h1>
    <p style={{ textAlign: 'center', margin: 0 }}>Click any of the cells to start a game.<br/>Or click below to start a game with the AI.</p>
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
    {isGameEnded ? null : <button className={styles.secondaryButton} onClick={resetGame}>Reset game</button>}
  </div>;
}
