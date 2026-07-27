import { describe, expect, it } from 'vitest'
import { MAX_ATTEMPTS, evaluateGuess, maskWord } from '../src/lib/mask.js'

describe('maskWord', () => {
  it('hides every letter when nothing has been guessed', () => {
    expect(maskWord('ELEPHANT', [])).toBe('________')
  })

  it('reveals every occurrence of a repeated letter', () => {
    expect(maskWord('ELEPHANT', ['E'])).toBe('E_E_____')
  })
})

describe('evaluateGuess', () => {
  it('does not spend an attempt on correct letters', () => {
    const result = evaluateGuess('ELEPHANT', ['E', 'L'])
    expect(result.attemptsRemaining).toBe(MAX_ATTEMPTS)
    expect(result.status).toBe('playing')
  })

  it('spends one attempt per incorrect letter', () => {
    const result = evaluateGuess('ELEPHANT', ['E', 'Z'])
    expect(result.attemptsRemaining).toBe(MAX_ATTEMPTS - 1)
    expect(result.status).toBe('playing')
  })

  it('reports won once every letter is revealed', () => {
    const result = evaluateGuess('ELEPHANT', ['E', 'L', 'P', 'H', 'A', 'N', 'T'])
    expect(result.status).toBe('won')
    expect(result.maskedWord).toBe('ELEPHANT')
  })

  it('reports lost after six incorrect letters', () => {
    const result = evaluateGuess('ELEPHANT', ['B', 'C', 'D', 'F', 'G', 'I'])
    expect(result.status).toBe('lost')
    expect(result.attemptsRemaining).toBe(0)
  })
})
