import { readFileSync } from 'fs'

const part2 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  // A Rock 1
  // B Paper 2
  // C Scissors 3

  // X lose 0
  // Y draw 3
  // Z win 6

  const scores = new Map<string, number>([
    ['A X', 3 + 0],
    ['A Y', 1 + 3],
    ['A Z', 2 + 6],
    ['B X', 1 + 0],
    ['B Y', 2 + 3],
    ['B Z', 3 + 6],
    ['C X', 2 + 0],
    ['C Y', 3 + 3],
    ['C Z', 1 + 6],
  ])

  let total = 0
  lines.forEach((line) => {
    if (line !== '') {
      total += scores.get(line)!
    }
  })
  console.log(total)
}

export default part2
