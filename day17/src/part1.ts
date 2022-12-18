import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  for (const line of lines) {
    if (line === '') continue // skip blank lines
    return {
      jetPattern: line,
    }
  }
  throw new Error('no input lines found')
}

const caveWidth = 7 + 2
class Cave {
  /*
    100000001
    100000001
    100000001
    100000001
    100000001 <- row 0, bottom
  */
  bits: number[] = []
  highestRockPosition = -1

  getRegionBits(x: number, y: number, w: number, h: number) {
    // console.log({ x, y, w, h })
    if (x < 0 || x + w > caveWidth) {
      throw new Error('x out of bounds')
    }
    if (y < 0 || y + h > this.bits.length) {
      throw new Error('y out of bounds')
    }
    let rowMask = (1 << w) - 1 // e.g. 111 if w = 3
    const xDistanceFromRight = caveWidth - (x + w) // from right edge of shape
    rowMask = rowMask << xDistanceFromRight
    let result = 0
    for (let iy = y; iy < y + h; iy++) {
      const extractedBits = (this.bits[iy] & rowMask) >> xDistanceFromRight
      result |= extractedBits
      if (iy < y + h - 1) {
        result = result << w
      }
    }
    return result
  }
  paintShape(shape: Shape, x: number, y: number) {
    if (x < 0 || x + shape.width > caveWidth) {
      throw new Error('x out of bounds')
    }
    if (y < 0 || y + shape.height > this.bits.length) {
      throw new Error('y out of bounds')
    }
    let shapeRowMask = (1 << shape.width) - 1 // e.g. 111 if width = 3
    shapeRowMask = shapeRowMask << ((shape.height - 1) * shape.width)
    const xDistanceFromRight = caveWidth - (x + shape.width) // from right edge of shape
    for (let iy = 0; iy < shape.height; iy++) {
      let shapeRowBits =
        (shape.bits & shapeRowMask) >> ((shape.height - 1 - iy) * shape.width)
      shapeRowMask = shapeRowMask >> shape.width
      this.bits[iy + y] |= shapeRowBits << xDistanceFromRight
    }
  }
  addRowsToTop(numRows: number) {
    const newRows = new Array<number>(numRows).fill(0b100000001)
    this.bits.push(...newRows)
  }
  print() {
    console.log('-----------')
    this.bits
      .slice()
      .reverse()
      .forEach((n) =>
        console.log(
          n
            .toString(2)
            .replace(/1/g, '#')
            .replace(/0/g, '.')
            .replace(/^./, '|')
            .replace(/.$/, '|')
        )
      )
    console.log('-----------')
  }
  setHeight(height: number) {
    const dy = height - this.bits.length
    if (dy > 0) this.addRowsToTop(dy)
  }
}

interface Shape {
  width: number
  height: number
  bits: number
}

class Rock {
  static readonly rockShapes: Shape[] = [
    // bits start at bottom left corner of shape
    { width: 4, height: 1, bits: 0b1111 },
    { width: 3, height: 3, bits: 0b010111010 },
    { width: 3, height: 3, bits: 0b111001001 },
    { width: 1, height: 4, bits: 0b1111 },
    { width: 2, height: 2, bits: 0b1111 },
  ]
  shape: Shape
  // bottom left coords
  x = Number.NaN
  y = Number.NaN
  constructor(rockShapeIndex: number, cave: Cave) {
    this.shape = Rock.rockShapes[rockShapeIndex % 5]
    this.x = 2 + 1
    this.y = cave.highestRockPosition + 4
    cave.setHeight(cave.highestRockPosition + 3 + this.shape.height + 1)
  }
  canMoveToPosition = (cave: Cave, x: number, y: number) => {
    const caveBitMask = cave.getRegionBits(
      x,
      y,
      this.shape.width,
      this.shape.height
    )
    return (caveBitMask & this.shape.bits) === 0
  }
  solidify(cave: Cave) {
    cave.paintShape(this.shape, this.x, this.y)
    cave.highestRockPosition = Math.max(
      cave.highestRockPosition,
      this.y + this.shape.height - 1
    )
  }
}

const main = () => {
  const input = getInput('input.txt')

  let rockShapeIndex = 0
  let jetIndex = 0
  let rockNum = 1
  const cave = new Cave()

  // const rocksWanted = 10
  const rocksWanted = 2022
  while (rockNum <= rocksWanted) {
    // console.log({ rockNum })
    // get next rock
    const rock = new Rock(rockShapeIndex, cave)
    // console.log({ rock })
    // cave.print()

    // rock falls...
    while (true) {
      const jetPattern = input.jetPattern.charAt(
        jetIndex % input.jetPattern.length
      )
      jetIndex++
      const dx = jetPattern === '<' ? -1 : 1
      // console.log(`apply jet ${jetPattern} delta ${dx}`)
      if (rock.canMoveToPosition(cave, rock.x + dx, rock.y)) {
        rock.x += dx
      }

      // console.log('move rock down if possible')
      if (rock.y === 0 || !rock.canMoveToPosition(cave, rock.x, rock.y - 1)) {
        // rock stopped
        rock.solidify(cave)
        // cave.print()
        break
      }
      rock.y--
    }

    rockShapeIndex++
    rockNum++
  }

  // const testCave = new Cave()
  // testCave.bits.push(
  //   ...[
  //     0b100000001, // row 3
  //     0b100000001,
  //     0b100000001,
  //     0b100000001, // row 0
  //   ].reverse()
  // )

  // testCave.print()

  // console.log('testing...')
  // console.log(testCave.getRegionBits(0, 0, 3, 2).toString(2))
  // testCave.paintShape({ width: 3, height: 3, bits: 0b010111010 }, 6, 1)
  // testCave.print()

  // let rock = new Rock(4, cave)
  // let testX = 4
  // let testY = 0
  // if (rock.canMoveToPosition(testCave, testX, testY)) {
  //   testCave.paintShape(rock.shape, testX, testY)
  //   testCave.print()
  // }

  // rock = new Rock(0, cave)
  // testX = 1
  // testY = 1
  // if (rock.canMoveToPosition(testCave, testX, testY)) {
  //   testCave.paintShape(rock.shape, testX, testY)
  //   testCave.print()
  // }

  return cave.highestRockPosition + 1
}

export { main }
