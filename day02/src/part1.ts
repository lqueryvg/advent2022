import { readFileSync } from 'fs'

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  // A X Rock 1
  // B Y Paper 2
  // C Z Scissors 3

  // lose 0, draw = 3, win = 6

  const scores = new Map<string, number>([
    ['A X', 1 + 3],
    ['A Y', 2 + 6],
    ['A Z', 3 + 0],
    ['B X', 1 + 0],
    ['B Y', 2 + 3],
    ['B Z', 3 + 6],
    ['C X', 1 + 6],
    ['C Y', 2 + 0],
    ['C Z', 3 + 3],
  ])

  let total = 0
  lines.forEach((line) => {
    if (line !== '') {
      total += scores.get(line)!
    }
  })
  console.log(total)
}

export default part1
