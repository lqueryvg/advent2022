import { readFileSync } from 'fs'

const leftRangeContainsRight = (left: string, right: string) => {
  const [l1, l2] = left.split('-').map(Number)
  const [r1, r2] = right.split('-').map(Number)
  return l1 <= r1 && l2 >= r2
}

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let count = 0
  for (const line of lines) {
    if (line === '') continue
    const pair = line.split(',')
    if (
      leftRangeContainsRight(pair[0], pair[1]) ||
      leftRangeContainsRight(pair[1], pair[0])
    ) {
      count++
    }
  }
  console.log({ part1: count })
}

export default part1
