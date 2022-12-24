import { readFileSync } from 'fs'

enum Direction {
  North = 0,
  South = 1,
  West = 2,
  East = 3,
}

class Point {
  x: number
  y: number

  constructor(point: { x: number; y: number } | string) {
    if (typeof point === 'string') {
      ;[this.x, this.y] = point.split(',').map(Number)
    } else {
      ;[this.x, this.y] = [point.x, point.y]
    }
  }
  toString() {
    return `${this.x},${this.y}`
  }
}

class Grove {
  elves: Map<string, string> = new Map<string, string>()

  constructor() {}

  set(x: number, y: number) {
    this.elves.set(`${x},${y}`, '#')
  }

  getBounds() {
    const topLeft: Point = new Point({
      x: Number.MAX_VALUE,
      y: Number.MAX_VALUE,
    })
    const bottomRight: Point = new Point({
      x: Number.MIN_VALUE,
      y: Number.MIN_VALUE,
    })
    for (let elfCoord of this.elves.keys()) {
      const p = new Point(elfCoord)

      topLeft.x = Math.min(p.x, topLeft.x)
      topLeft.y = Math.min(p.y, topLeft.y)
      bottomRight.x = Math.max(p.x, bottomRight.x)
      bottomRight.y = Math.max(p.y, bottomRight.y)
    }
    return [topLeft, bottomRight]
  }

  getEmptyTiles() {
    const [topLeft, bottomRight] = this.getBounds()
    const width = bottomRight.x - topLeft.x + 1
    const height = bottomRight.y - topLeft.y + 1
    return width * height - this.elves.size
  }

  print() {
    const [topLeft, bottomRight] = this.getBounds()

    for (let y = topLeft.y; y <= bottomRight.y; y++) {
      let row = ''
      for (let x = topLeft.x; x < bottomRight.y; x++) {
        if (this.pointIsOccupied(new Point({ x, y }))) {
          row = row + '#'
        } else {
          row = row + '.'
        }
      }
      console.log(row)
    }
  }

  pointIsOccupied(p: Point) {
    return this.elves.has(new Point({ x: p.x, y: p.y }).toString())
  }

  hasNoNeighbors(point: Point) {
    return (
      !this.pointIsOccupied(new Point({ x: point.x, y: point.y - 1 })) &&
      !this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y - 1 })) &&
      !this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y - 1 })) &&
      !this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y })) &&
      !this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y })) &&
      !this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y + 1 })) &&
      !this.pointIsOccupied(new Point({ x: point.x, y: point.y + 1 })) &&
      !this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y + 1 }))
    )
  }

  directionIsOccupied(point: Point, direction: Direction) {
    switch (direction) {
      case Direction.North:
        return (
          this.pointIsOccupied(new Point({ x: point.x, y: point.y - 1 })) ||
          this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y - 1 })) ||
          this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y - 1 }))
        )
      case Direction.South:
        return (
          this.pointIsOccupied(new Point({ x: point.x, y: point.y + 1 })) ||
          this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y + 1 })) ||
          this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y + 1 }))
        )
      case Direction.West:
        return (
          this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y - 1 })) ||
          this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y })) ||
          this.pointIsOccupied(new Point({ x: point.x - 1, y: point.y + 1 }))
        )
      case Direction.East:
        return (
          this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y - 1 })) ||
          this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y })) ||
          this.pointIsOccupied(new Point({ x: point.x + 1, y: point.y + 1 }))
        )
    }
  }

  getDirectionPoint(point: Point, direction: Direction) {
    switch (direction) {
      case Direction.North:
        return new Point({ x: point.x, y: point.y - 1 })
      case Direction.South:
        return new Point({ x: point.x, y: point.y + 1 })
      case Direction.West:
        return new Point({ x: point.x - 1, y: point.y })
      case Direction.East:
        return new Point({ x: point.x + 1, y: point.y })
    }
  }

  getProposedTargetCoord(p: Point, startingDirection: Direction) {
    // returns undefined if there are no neighbors
    if (this.hasNoNeighbors(p)) return undefined
    const numDirections = Object.keys(Direction).length / 2
    for (
      let directionOffset = 0;
      directionOffset < numDirections;
      directionOffset++
    ) {
      const direction =
        (startingDirection + directionOffset + numDirections) % numDirections
      if (!this.directionIsOccupied(p, direction)) {
        return this.getDirectionPoint(p, direction)
      }
    }
  }

  move(elfPoint: string, target: string) {
    this.elves.delete(elfPoint)
    this.elves.set(target, '#')
  }

  round(startingDirection: Direction) {
    // will contain a list of elf coords wanting to move to each target coord
    const proposedTargetCoords = new Map<string, string[]>()

    let anyElvesWantedToMove = false
    for (let elfCoord of this.elves.keys()) {
      const targetCoord = this.getProposedTargetCoord(
        new Point(elfCoord),
        startingDirection
      )
      if (targetCoord !== undefined) {
        // this elf wants to move
        anyElvesWantedToMove = true
        if (!proposedTargetCoords.has(targetCoord.toString())) {
          proposedTargetCoords.set(targetCoord.toString(), [])
        }
        const list = proposedTargetCoords.get(targetCoord.toString())
        list?.push(elfCoord)
      }
    }

    // move the elves that can
    for (let [targetCoord, list] of proposedTargetCoords.entries()) {
      if (list.length === 1) {
        const sourcePoint = list[0]
        // console.log({ moveFrom: sourcePoint, to: targetCoord })
        this.move(sourcePoint, targetCoord)
      }
    }
    // this.print()

    return anyElvesWantedToMove
  }
}

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)

  const grove = new Grove()
  for (let y = 0; y < lines.length; y++) {
    const row = lines[y]
    for (let x = 0; x < row.length; x++) {
      if (row.charAt(x) === '#') {
        grove.set(x, y)
      }
    }
  }
  return grove
}

const main = () => {
  const grove = getInput('input.txt')

  const maxRounds = 10

  let direction = 0

  for (let round = 1; round <= maxRounds; round++) {
    const elvesWantedToMove = grove.round(direction)
    if (!elvesWantedToMove) break
    direction++
  }
  // grove.print()
  // console.log({ empty:  })
  return grove.getEmptyTiles()
}

export { main }
