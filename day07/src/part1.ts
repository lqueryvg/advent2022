import { readFileSync } from 'fs'

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  const stack = []
  let total = 0
  let sumTotals = 0
  const max = 100000
  for (const line of lines) {
    if (line === '') continue // skip blank lines

    if (line.startsWith('$ cd ..')) {
      if (total <= max) {
        sumTotals += total
      }
      total += stack.pop()!
    } else if (line.startsWith('$ cd ')) {
      stack.push(total)
      total = 0
    } else if (line.startsWith('dir ')) {
      continue
    } else if (line === '$ ls') {
      continue
    } else {
      const words = line.split(/\s+/)
      total += Number(words[0])
    }
  }

  if (total <= max) {
    sumTotals += total
  }

  while (stack.length > 0) {
    total += stack.pop()!
  }

  if (total <= max) {
    sumTotals += total
  }

  console.log({ part1: sumTotals })
}

export default part1
