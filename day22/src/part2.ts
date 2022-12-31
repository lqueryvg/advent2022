import { readFileSync } from 'fs'

interface Instruction {
  type: string
  value: string
}

enum Facing {
  Right = 0,
  Down = 1,
  Left = 2,
  Up = 3,
}

type Neighbors = [
  Cell | undefined,
  Cell | undefined,
  Cell | undefined,
  Cell | undefined
]

type FacingsList = [Facing, Facing, Facing, Facing]

const cellMap = new Map<string, Cell>()

class Cell {
  x: number
  y: number
  coordString: string
  char: string
  neighbors: Neighbors
  newDirections: FacingsList

  constructor(x: number, y: number, char: string) {
    this.coordString = `${x},${y}`
    this.x = x
    this.y = y
    this.char = char
    this.newDirections = [Facing.Right, Facing.Down, Facing.Left, Facing.Up]
    this.neighbors = [undefined, undefined, undefined, undefined]
  }

  print() {
    console.log({
      coordString: this.coordString,
      neighbors: this.neighbors.map((cell) => {
        if (cell) return cell.coordString
      }),
      newDirections: this.newDirections,
    })
  }
}

class You {
  facing = Facing.Right
  cell: Cell
  constructor(startCell: Cell) {
    this.cell = startCell
    // this.facing = Facing.Right
  }

  turn(way: string) {
    switch (way) {
      case 'R':
        this.facing = (this.facing + 1) % 4
        break
      case 'L':
        this.facing = (this.facing + 4 - 1) % 4
        break
    }
  }

  moveOneStep() {
    const nextCell = this.cell.neighbors[this.facing]!
    const charAhead = nextCell.char
    if (charAhead! === '#') return false
    if (charAhead! === '.') {
      // console.log({ x: nextCell.x, y: nextCell.y })
      // console.log({ nextCell })
      this.facing = this.cell.newDirections[this.facing]
      this.cell = nextCell
      return true
    }
  }

  move(steps: number) {
    // console.log({ steps })
    for (let i = 1; i <= steps; i++) {
      if (!this.moveOneStep()) break
    }
  }
}

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  let lines = file.split(/\r\n|\n/)

  const regexpNames = /(\d+)([RL])/gm
  const instructionsString = lines[lines.length - 2]
  lines = lines.slice(0, -3)
  const instructions: Instruction[] = []
  for (const match of instructionsString.matchAll(regexpNames)) {
    instructions.push(
      { type: 'move', value: match[1] },
      { type: 'turn', value: match[2] }
    )
  }
  instructions.push({
    type: 'move',
    value: instructionsString.match(/(\d+)$/)![0],
  })
  return { instructions, lines }
}

const main = () => {
  const input = getInput('input.txt')
  // console.log({ input })

  // make the cell map
  for (let y = 0; y < input.lines.length; y++) {
    const row = input.lines[y]
    for (let x = 0; x < row.length; x++) {
      const char = row.charAt(x)
      if (char != ' ') {
        const cell = new Cell(x + 1, y + 1, char)
        cellMap.set(cell.coordString, cell)
      }
    }
  }

  // simple stitching
  for (const cell of cellMap.values()) {
    const left = cellMap.get(`${cell.x - 1},${cell.y}`)
    if (left) cell.neighbors[Facing.Left] = left

    const right = cellMap.get(`${cell.x + 1},${cell.y}`)
    if (right) cell.neighbors[Facing.Right] = right

    const up = cellMap.get(`${cell.x},${cell.y - 1}`)
    if (up) cell.neighbors[Facing.Up] = up

    const down = cellMap.get(`${cell.x},${cell.y + 1}`)
    if (down) cell.neighbors[Facing.Down] = down
  }

  const oppositeDirection = (direction: Facing) => (direction + 2) % 4

  // complex stitching
  const stitch = (
    x1: number,
    y1: number,
    exitDirection: Facing,
    newFacing: Facing,
    x2: number,
    y2: number
  ) => {
    const cell1 = cellMap.get(`${x1},${y1}`)
    const cell2 = cellMap.get(`${x2},${y2}`)

    // console.log({ x1, y1, cell1, x2, y2, cell2 })

    cell1!.neighbors[exitDirection] = cell2
    cell1!.newDirections[exitDirection] = newFacing
    cell2!.neighbors[oppositeDirection(newFacing)] = cell1
    cell2!.newDirections[oppositeDirection(newFacing)] =
      oppositeDirection(exitDirection)
  }

  if (input.lines.length === 12) {
    const blockWidth = 4
    // example
    // ..1
    // 234
    // ..56

    for (let i = 1; i <= blockWidth; i++) {
      // 1 - 2
      stitch(
        blockWidth * 2 + i,
        1,
        Facing.Up,
        Facing.Down,
        blockWidth + 1 - i,
        blockWidth + 1
      )
      // 1 - 3
      stitch(
        blockWidth + i,
        blockWidth + 1,
        Facing.Up,
        Facing.Right,
        blockWidth * 2 + 1,
        i
      )
      // 1 - 6
      stitch(
        blockWidth * 3,
        i,
        Facing.Right,
        Facing.Left,
        blockWidth * 4,
        blockWidth * 3 - i + 1
      )
      // 2 - 5
      stitch(
        i,
        blockWidth * 2,
        Facing.Down,
        Facing.Up,
        blockWidth * 3 - i + 1,
        blockWidth * 3
      )
      // console.log('2 - 6')
      stitch(
        1,
        blockWidth + i,
        Facing.Left,
        Facing.Up,
        blockWidth * 4 - i + 1,
        blockWidth * 3
      )
      // console.log('3 - 5')
      stitch(
        blockWidth + i,
        blockWidth * 2,
        Facing.Down,
        Facing.Right,
        blockWidth * 2 + 1,
        blockWidth * 3 - i + 1
      )
      // console.log('4 - 6')
      stitch(
        blockWidth * 3,
        blockWidth + i,
        Facing.Right,
        Facing.Down,
        blockWidth * 4 - i + 1,
        blockWidth * 2 + 1
      )
    }
  } else {
    const blockWidth = 50

    // full input
    // .12
    // .3
    // 45
    // 6

    for (let i = 1; i <= blockWidth; i++) {
      // 1 - 4
      stitch(
        blockWidth + 1,
        i,
        Facing.Left,
        Facing.Right,
        1,
        3 * blockWidth - i + 1
      )
      // 1 - 6
      stitch(blockWidth + i, 1, Facing.Up, Facing.Right, 1, blockWidth * 3 + i)
      // 2 - 3
      stitch(
        2 * blockWidth + i,
        blockWidth,
        Facing.Down,
        Facing.Left,
        2 * blockWidth,
        blockWidth + i
      )
      // 2 - 5
      stitch(
        3 * blockWidth,
        blockWidth - i + 1,
        Facing.Right,
        Facing.Left,
        2 * blockWidth,
        2 * blockWidth + i
      )
      // console.log('2 - 6')
      stitch(2 * blockWidth + i, 1, Facing.Up, Facing.Up, i, 4 * blockWidth)
      // console.log('3 - 4')
      stitch(
        blockWidth + 1,
        blockWidth + i,
        Facing.Left,
        Facing.Down,
        i,
        2 * blockWidth + 1
      )
      // console.log('5 - 6')
      stitch(
        blockWidth + i,
        3 * blockWidth,
        Facing.Down,
        Facing.Left,
        blockWidth,
        3 * blockWidth + i
      )
    }
  }

  // for (const cell of cellMap.values()) {
  //   cell.print()
  // }

  // init starting position
  const startX = input.lines[0].length - input.lines[0].trimStart().length + 1
  const startCell = cellMap.get(`${startX},1`)
  const you = new You(startCell!)

  // follow instructions
  for (let instruction of input.instructions) {
    // console.log({ instruction })
    switch (instruction.type) {
      case 'move':
        you.move(Number(instruction.value))
        break
      case 'turn':
        you.turn(instruction.value)
        break
    }
  }

  // console.log({ you })

  return 1000 * you.cell.y + 4 * you.cell.x + you.facing
}

export { main }
