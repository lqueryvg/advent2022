import { readFileSync } from 'fs'

interface Instruction {
  type: string
  value: string
}

class You {
  x: number = 0
  y: number = 0
  direction: number = 0

  turn(way: string) {
    // console.log({ way })
    switch (way) {
      case 'R':
        this.direction = (this.direction + 1) % 4
        break
      case 'L':
        this.direction = (this.direction + 4 - 1) % 4
        break
    }
    console.log({ direction: this.direction })
  }

  seekDown(lines: string[]) {
    let y = 0
    while (y < lines.length) {
      const row = lines[y]
      if (row.length > this.x && row.charAt(this.x) !== ' ') return y
      y++
    }
    throw new Error('fell off the bottom when seeking down')
  }

  seekUp(lines: string[]) {
    let y = lines.length - 1
    while (y >= 0) {
      const row = lines[y]
      if (row.length > this.x && row.charAt(this.x) !== ' ') return y
      y--
    }
    throw new Error('fell off the top when seeking up')
  }

  moveOneStep(lines: string[]) {
    let newX = this.x,
      newY = this.y,
      charAhead: string
    let line
    // console.log({ direction: this.direction })
    switch (this.direction) {
      case 0: // Right
        line = lines[newY]
        newX = this.x + 1
        charAhead = line.charAt(newX)
        if (charAhead === '') {
          // TODO optimise - compute these just once
          newX = line.length - line.trimStart().length
          charAhead = line.charAt(newX)
        }
        break
      case 1: // Down
        newY = this.y + 1
        if (newY > lines.length - 1) newY = this.seekDown(lines)
        line = lines[newY]
        charAhead = line.charAt(newX)
        if (charAhead === ' ' || charAhead === '') {
          newY = this.seekDown(lines)
          line = lines[newY]
          charAhead = line.charAt(newX)
        }
        break
      case 2: // Left
        line = lines[this.y]
        newX = this.x - 1
        if (newX < 0) newX = line.length - 1
        charAhead = line.charAt(newX)
        if (charAhead === ' ') {
          newX = line.length - 1
          charAhead = line.charAt(newX)
        }
        break
      case 3: // Up
        newY = this.y - 1
        if (newY < 0) newY = this.seekUp(lines)
        line = lines[newY]
        charAhead = line.charAt(newX)
        if (charAhead === ' ') {
          newY = this.seekUp(lines)
          line = lines[newY]
          charAhead = line.charAt(newX)
        }
        break
      default:
        throw new Error(`unsupported direction: ${this.direction}`)
    }
    console.log({ charAhead, newX, newY })
    if (charAhead! === '#') return false
    if (charAhead! === '.') {
      this.x = newX
      this.y = newY
      return true
    }
    throw new Error('unexpected state when moving one step')
  }

  move(steps: number, lines: string[]) {
    // console.log({ steps })
    for (let i = 1; i <= steps; i++) {
      if (!this.moveOneStep(lines)) break
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

  const you = new You()
  you.x = input.lines[0].length - input.lines[0].trimStart().length

  // you.x = 8

  for (let instruction of input.instructions) {
    console.log({ instruction })
    switch (instruction.type) {
      case 'move':
        you.move(Number(instruction.value), input.lines)
        break
      case 'turn':
        you.turn(instruction.value)
        break
    }
  }

  console.log({ you })

  return 1000 * (you.y + 1) + 4 * (you.x + 1) + you.direction
}

export { main }
