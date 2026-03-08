import type { CellIndex, GameState, SubBoardIndex } from '../engine/types';
import { useGameStore } from '../store/gameStore';
import { MetaBoard } from './MetaBoard';
import { GameStatus } from './GameStatus';
import { Controls } from './Controls';
import styles from './App.module.css';

export function App() {
  const state = useGameStore();

  const gameState: GameState = {
    board: state.board,
    subBoardStatus: state.subBoardStatus,
    currentPlayer: state.currentPlayer,
    activeSubBoard: state.activeSubBoard,
    lastMove: state.lastMove,
    gameOutcome: state.gameOutcome,
    moveCount: state.moveCount,
  };

  const handleCellClick = (subBoard: SubBoardIndex, cell: CellIndex) => {
    state.play(subBoard, cell);
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Ultimate Tic-Tac-Toe</h1>
      <GameStatus state={gameState} />
      <MetaBoard state={gameState} onCellClick={handleCellClick} />
      <Controls onNewGame={state.reset} isGameOver={gameState.gameOutcome !== null} />
    </div>
  );
}
