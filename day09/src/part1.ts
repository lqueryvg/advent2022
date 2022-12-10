import { readFileSync } from 'fs'

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  const moves: any = {
    UL: {
      R: ['U', [0, 0]],
      L: ['L', [-1, -1]],
      U: ['U', [-1, -1]],
      D: ['L', [0, 0]],
    },
    U: {
      R: ['UR', [0, 0]],
      L: ['UL', [0, 0]],
      U: ['U', [0, -1]],
      D: ['M', [0, 0]],
    },
    UR: {
      R: ['R', [1, -1]],
      L: ['U', [0, 0]],
      U: ['U', [1, -1]],
      D: ['R', [0, 0]],
    },
    L: {
      R: ['M', [0, 0]],
      L: ['L', [-1, 0]],
      U: ['UL', [0, 0]],
      D: ['DL', [0, 0]],
    },
    M: {
      R: ['R', [0, 0]],
      L: ['L', [0, 0]],
      U: ['U', [0, 0]],
      D: ['D', [0, 0]],
    },
    R: {
      R: ['R', [1, 0]],
      L: ['M', [0, 0]],
      U: ['UR', [0, 0]],
      D: ['DR', [0, 0]],
    },
    DL: {
      R: ['D', [0, 0]],
      L: ['L', [-1, 1]],
      U: ['L', [0, 0]],
      D: ['D', [-1, 1]],
    },
    D: {
      R: ['DR', [0, 0]],
      L: ['DL', [0, 0]],
      U: ['M', [0, 0]],
      D: ['D', [0, 1]],
    },
    DR: {
      R: ['R', [1, 1]],
      L: ['D', [0, 0]],
      U: ['R', [0, 0]],
      D: ['D', [1, 1]],
    },
  }

  let [x, y] = [0, 0]
  let current = 'M'
  const visitedPositions = new Set()

  for (const line of lines) {
    if (line === '') continue // skip blank lines

    const words = line.split(/\s+/)

    let [direction, count] = words

    for (let i = Number(count); i > 0; i--) {
      const [next, [dx, dy]] = moves[current][direction]
      x += dx
      y += dy
      current = next
      visitedPositions.add(`${x},${y}`)
    }
  }
  console.log({ part1: visitedPositions.size })
}

export default part1
