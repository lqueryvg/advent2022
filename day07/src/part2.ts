import { readFileSync } from 'fs'

const part2 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  const stack = []
  let total = 0
  const dirSizes = []
  for (const line of lines) {
    if (line === '') continue // skip blank lines

    if (line.startsWith('$ cd ..')) {
      dirSizes.push(total)

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
  dirSizes.push(total)

  // console.log({ stack })
  while (stack.length > 0) {
    total += stack.pop()!
  }

  dirSizes.push(total)

  const freeSpace = 70000000 - total
  const spaceNeeded = 30000000 - freeSpace

  // console.log({ total, freeSpace, spaceNeeded })

  const sortedDirs = dirSizes.sort((a, b) => a - b)
  const firstSmallest = sortedDirs.find((a) => a >= spaceNeeded)

  console.log({ part2: firstSmallest })
}

export default part2
