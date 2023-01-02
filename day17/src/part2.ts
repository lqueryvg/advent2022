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
    // console.log({ rowMask: rowMask.toString(2) })
    const xDistanceFromRight = caveWidth - (x + w) // from right edge of shape
    // console.log({ xDistanceFromRight })
    rowMask = rowMask << xDistanceFromRight
    // console.log({ rowMask: rowMask.toString(2) })
    let result = 0
    for (let iy = y; iy < y + h; iy++) {
      const extractedBits = (this.bits[iy] & rowMask) >> xDistanceFromRight
      result |= extractedBits
      // console.log({ extractedBits: extractedBits.toString(2) })
      // console.log({ result: result.toString(2) })
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
    // console.log({ shape, x, y })
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
    if (numRows > 100) {
      console.log('adding ', { numRows })
    }
    const newRows = new Array<number>(numRows).fill(0b100000001)
    this.bits.push(...newRows)
  }
  print() {
    // console.log({
    //   highestRockPosition: this.highestRockPosition,
    //   // bits: this.bits.reverse().map((n) => n.toString(2)),
    // })
    console.log('-----------')
    this.bits
      .slice() // slice to take a copy to ensure that we don't reverse the original
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
    // console.log({ bitsLength: this.bits.length, height })
    const dy = height - this.bits.length
    if (dy > 0) this.addRowsToTop(dy)
  }
}

interface Shape {
  width: number
  height: number
  bits: number
}

let sampleTotal = 0
let rockNum = 1
let rockShapeIndex = 0
let jetIndex = 0
let jetPatternLength = 0
const rocksWanted = 1000000000000
let heightSkipped = 0

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
    // console.log(this.shape)
    cave.setHeight(cave.highestRockPosition + 3 + this.shape.height + 1)
    // cave.addRowsToTop(3 + this.shape.height)
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

  checkForRepeats(cave: Cave) {
    let samplePosition = 10000
    let sampleSize = 2000

    const getWindowTotal = (start: number, end: number) => {
      // inclusive
      let total = 0
      for (let i = start; i <= end; i++) {
        total += cave.bits[i]
      }
      return total
    }

    if (cave.highestRockPosition === samplePosition) {
      sampleTotal = getWindowTotal(
        samplePosition - sampleSize + 1,
        samplePosition
      )
      console.log({ sampleTotal })
    }

    if (cave.highestRockPosition > samplePosition) {
      const total = getWindowTotal(
        cave.highestRockPosition - sampleSize + 1,
        cave.highestRockPosition
      )
      if (total === sampleTotal) {
        console.log(
          `possible repeat at height ${cave.highestRockPosition} after ${rockNum} rocks`,
          {
            rockShapeIndex: rockShapeIndex % 5,
            jetIndex: jetIndex % jetPatternLength,
          }
        )

        // Debugging found that beyond a certain point the
        // pattern repeats after 1700 rocks and 2660 height
        // (with exactly the same shape and jet index).
        // Therefore as soon as we find a repeat we can skip the rock count
        // forward by whole multiple of 1700 to as close as possible to the desired
        // number of rocks and continue from there.
        // The final height total will need to be adjusted by the same whole multiple
        // of 2660.
        const skipCount = Math.floor((rocksWanted - rockNum) / 1700)
        rockNum += 1700 * skipCount
        heightSkipped = skipCount * 2660
      }
    }
  }
  solidify(cave: Cave) {
    cave.paintShape(this.shape, this.x, this.y)
    // console.log({highestRockPosition:cave.highestRockPosition,  })
    cave.highestRockPosition = Math.max(
      cave.highestRockPosition,
      this.y + this.shape.height - 1
    )

    this.checkForRepeats(cave)
    // console.log({ highestRockPosition: cave.highestRockPosition })
  }
}

const main = () => {
  const input = getInput('input.txt')
  // console.log({ jetPatternLength: input.jetPattern.length })

  const cave = new Cave()

  jetPatternLength = input.jetPattern.length
  // const rocksWanted = 100
  // const rocksWanted = 2022
  while (rockNum <= rocksWanted) {
    const rock = new Rock(rockShapeIndex, cave)

    // rock falls...
    while (true) {
      // console.log({ rockNum })
      const jetPattern = input.jetPattern.charAt(jetIndex % jetPatternLength)
      jetIndex++
      const dx = jetPattern === '<' ? -1 : 1
      // console.log(`apply jet ${jetPattern} delta ${dx}`)
      if (rock.canMoveToPosition(cave, rock.x + dx, rock.y)) {
        rock.x += dx
      }

      // console.log('move rock down if possible')
      if (rock.y === 0 || !rock.canMoveToPosition(cave, rock.x, rock.y - 1)) {
        rock.solidify(cave)
        break
      }

      rock.y--
    }

    rockShapeIndex++
    rockNum++
  }

  return cave.highestRockPosition + 1 + heightSkipped
}

export { main }
