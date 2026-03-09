import { create } from 'zustand'
import type { GameState } from '../engine/types.ts'
import { createInitialState, makeMove } from '../engine/engine.ts'

interface GameStore {
  /** Current game state */
  game: GameState

  /** Place a mark — delegates to engine.makeMove */
  playMove: (boardIndex: number, cellIndex: number) => void

  /** Reset to initial state */
  resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  game: createInitialState(),

  playMove: (boardIndex, cellIndex) =>
    set((state) => {
      const newGame = makeMove(state.game, boardIndex, cellIndex)
      if (!newGame) return state // invalid move, no change
      return { game: newGame }
    }),

  resetGame: () => set({ game: createInitialState() }),
}))
