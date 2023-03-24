const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    test('return an array', () => {
        const result = shuffleArray([1, 2, 3, 4, 5])
        expect(Array.isArray(result)).toBe(true)
      })
    
      test('return an array of the same length as the argument sent in', () => {
        const input = [1, 2, 3, 4, 5]
        const result = shuffleArray(input)
        expect(result.length).toBe(input.length)
      })
})