import { readFileSync } from 'fs'

const part2 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  // directions are UL, U, UR, L, M, R, DL, D, DR
  // they denote position of one knot relative to another
  // (Up Left, Up, Up Right, Left, Middle, Right, Down Left, Down, Down Right)
  // M means that one knot covers the other
  // for any 2 knots, the first is the head, the one behind is the tail
  const moves: any = {
    // key (string) direction = position of the head relative to the tail
    UL: {
      // key (string) = move direction
      // array value represents the effect of moving in that direction:
      //   the first string gives the direction of the new head relative to the new tail
      //   the second string gives the direction the tail needs to move in
      L: ['L', 'UL'],
      R: ['U', 'M'],
      U: ['U', 'UL'],
      D: ['L', 'M'],
      UL: ['UL', 'UL'],
      UR: ['U', 'U'],
      DL: ['L', 'L'],
      DR: ['M', 'M'],
    },
    U: {
      L: ['UL', 'M'],
      R: ['UR', 'M'],
      U: ['U', 'U'],
      D: ['M', 'M'],
      UL: ['U', 'UL'],
      UR: ['U', 'UR'],
      DL: ['L', 'M'],
      DR: ['R', 'M'],
    },
    UR: {
      L: ['U', 'M'],
      R: ['R', 'UR'],
      U: ['U', 'UR'],
      D: ['R', 'M'],
      UL: ['U', 'U'],
      UR: ['UR', 'UR'],
      DL: ['M', 'M'],
      DR: ['R', 'R'],
    },
    L: {
      L: ['L', 'L'],
      R: ['M', 'M'],
      U: ['UL', 'M'],
      D: ['DL', 'M'],
      UL: ['L', 'UL'],
      UR: ['U', 'M'],
      DL: ['L', 'DL'],
      DR: ['D', 'M'],
    },
    M: {
      L: ['L', 'M'],
      R: ['R', 'M'],
      U: ['U', 'M'],
      D: ['D', 'M'],
      UL: ['UL', 'M'],
      UR: ['UR', 'M'],
      DR: ['DR', 'M'],
      DL: ['DL', 'M'],
    },
    R: {
      L: ['M', 'M'],
      R: ['R', 'R'],
      U: ['UR', 'M'],
      D: ['DR', 'M'],
      UL: ['U', 'M'],
      UR: ['R', 'UR'],
      DL: ['D', 'M'],
      DR: ['R', 'DR'],
    },
    DL: {
      L: ['L', 'DL'],
      R: ['D', 'M'],
      U: ['L', 'M'],
      D: ['D', 'DL'],
      UL: ['L', 'L'],
      UR: ['M', 'M'],
      DL: ['DL', 'DL'],
      DR: ['D', 'D'],
    },
    D: {
      R: ['DR', 'M'],
      L: ['DL', 'M'],
      U: ['M', 'M'],
      D: ['D', 'D'],
      UL: ['L', 'M'],
      UR: ['R', 'M'],
      DL: ['D', 'DL'],
      DR: ['D', 'DR'],
    },
    DR: {
      L: ['D', 'M'],
      R: ['R', 'DR'],
      U: ['R', 'M'],
      D: ['D', 'DR'],
      UL: ['M', 'M'],
      UR: ['R', 'R'],
      DR: ['DR', 'DR'],
      DL: ['D', 'D'],
    },
  }

  let [x, y] = [0, 0] // tracks the final tail position
  const numTailKnots = 9
  const knotDirections = Array(numTailKnots).fill('M')
  const visitedPositions = new Set()

  const getDeltas = (direction: string) => {
    const map: any = {
      UL: [-1, -1],
      U: [0, -1],
      UR: [1, -1],
      L: [-1, 0],
      M: [0, 0],
      R: [1, 0],
      DL: [-1, 1],
      D: [0, 1],
      DR: [1, 1],
    }
    return map[direction]
  }

  for (const line of lines) {
    if (line === '') continue // skip blank lines

    const words = line.split(/\s+/)

    let [lineDirection, count] = words

    for (let steps = Number(count); steps > 0; steps--) {
      let directionToMoveNextKnot = lineDirection
      let knotIndex = numTailKnots - 1
      while (knotIndex >= 0) {
        const oldRelativeKnotDirection = knotDirections[knotIndex]

        const [newRelativeKnotDirection, newDirectionToMoveNextKnot] =
          moves[oldRelativeKnotDirection][directionToMoveNextKnot]

        directionToMoveNextKnot = newDirectionToMoveNextKnot

        knotDirections[knotIndex] = newRelativeKnotDirection
        if (directionToMoveNextKnot === 'M') {
          break
        }
        knotIndex--
      }
      const [dx, dy] = getDeltas(directionToMoveNextKnot)
      x += dx
      y += dy
      visitedPositions.add(`${x},${y}`)
    }
  }
  console.log({ part2: visitedPositions.size })
}

export default part2
