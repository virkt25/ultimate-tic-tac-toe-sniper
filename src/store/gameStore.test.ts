import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame()
  })

  it('starts with initial state', () => {
    const { game } = useGameStore.getState()
    expect(game.currentPlayer).toBe('X')
    expect(game.status).toBe('playing')
    expect(game.activeBoard).toBeNull()
    expect(game.winner).toBeNull()
  })

  it('playMove updates state on valid move', () => {
    useGameStore.getState().playMove(0, 0)
    const { game } = useGameStore.getState()
    expect(game.boards[0][0]).toBe('X')
    expect(game.currentPlayer).toBe('O')
    expect(game.activeBoard).toBe(0)
  })

  it('playMove ignores invalid move', () => {
    useGameStore.getState().playMove(0, 0) // X plays
    const stateAfterX = useGameStore.getState().game
    useGameStore.getState().playMove(4, 0) // O tries wrong board (should be board 0)
    const stateAfterInvalid = useGameStore.getState().game
    expect(stateAfterInvalid).toEqual(stateAfterX)
  })

  it('resetGame restores initial state', () => {
    useGameStore.getState().playMove(0, 0)
    useGameStore.getState().playMove(0, 1)
    useGameStore.getState().resetGame()
    const { game } = useGameStore.getState()
    expect(game.currentPlayer).toBe('X')
    expect(game.boards[0][0]).toBeNull()
    expect(game.activeBoard).toBeNull()
  })
})
