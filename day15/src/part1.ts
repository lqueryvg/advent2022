import { readFileSync } from 'fs'

class Line {
  x1: number
  x2: number
  constructor(x1: number, x2: number) {
    this.x1 = x1
    this.x2 = x2
  }
  length(): number {
    return this.x2 - this.x1
  }
  compare(line: Line) {
    // compare by x1 first, then length if they are equal
    const dx = this.x1 - line.x1
    if (dx !== 0) {
      return dx
    }
    return this.length() - line.length()
  }
}
class Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    ;[this.x, this.y] = [x, y]
  }
  // updateBounds(topLeft: Point, bottomRight: Point) {
  //   topLeft.x = Math.min(topLeft.x, this.x)
  //   topLeft.y = Math.min(topLeft.y, this.y)
  //   bottomRight.x = Math.max(bottomRight.x, this.x)
  //   bottomRight.y = Math.max(bottomRight.y, this.y)
  // }
  manhatten(point: Point): number {
    return Math.abs(this.x - point.x) + Math.abs(this.y - point.y)
  }
  getIntersectLine(range: number, row: number): Line | undefined {
    const dx = range - Math.abs(row - this.y)
    // console.log({ x: this.x, y: this.y, range, row, dx })
    if (dx < 0) return undefined
    return new Line(this.x - dx, this.x + dx)
  }
}

// const topLeft = new Point(Number.MAX_VALUE, Number.MAX_VALUE)
// const bottomRight = new Point(Number.MIN_VALUE, Number.MIN_VALUE)

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.trim().split(/\r\n|\n/)

  const sensors: any = []
  const beacons: Point[] = []

  for (const line of lines) {
    const rawNumberString = line
      .replace(/.*?=/, '')
      .replace(/:.*?=/, ' ')
      .replace(/, y=/g, ' ')
    const [sensorX, sensorY, beaconX, beaconY] = rawNumberString
      .split(/\s+/)
      .map(Number)

    const sensor = new Point(sensorX, sensorY)
    const beacon = new Point(beaconX, beaconY)
    const manhatten = sensor.manhatten(beacon)

    beacons.push(beacon)
    sensors.push({ location: sensor, range: manhatten })

    // sensor.updateBounds(topLeft, bottomRight)
    // beacon.updateBounds(topLeft, bottomRight)
  }

  // use the total number of sensors to decide
  // if we are working with the full input or the example
  let desiredRow = sensors.length === 35 ? 2000000 : 10

  const beaconXValuesOnDesiredRow = new Set<number>()

  for (let beacon of beacons) {
    if (beacon.y === desiredRow) {
      beaconXValuesOnDesiredRow.add(beacon.x)
    }
  }

  // get list of line segments which intersect desired row
  let lineSegments = []
  for (let sensor of sensors) {
    const line = sensor.location.getIntersectLine(sensor.range, desiredRow)
    if (line) lineSegments.push(line)
    // console.log({ location: sensor.location, line })
  }

  const getTotal = (lineSegments: Line[]) => {
    let total = 0
    // console.log({ lineSegments })
    lineSegments.sort((a, b) => a.compare(b))
    // console.log({ lineSegments })

    let thisLineIndex = 0

    const addToTotal = (x1: number, x2: number) => {
      // check no beacons fall withing this segment
      // console.log(`total += ${x2 - x1 + 1}`)
      total += x2 - x1 + 1
      beaconXValuesOnDesiredRow.forEach((x) => {
        if (x >= x1 && x <= x2) {
          // console.log({ x })
          // console.log(`beacon found at ${x}, so subtracting 1`)
          total--
        }
      })
    }

    while (thisLineIndex < lineSegments.length - 1) {
      const thisLine = lineSegments[thisLineIndex]

      // console.log({ thisLine })
      // console.log(`total += ${thisLine.length() + 1}`)
      // total += thisLine.length() + 1
      // addToTotalOld(thisLine.length() + 1)
      addToTotal(thisLine.x1, thisLine.x2)

      let nextLineIndex = thisLineIndex + 1

      while (nextLineIndex < lineSegments.length) {
        let nextLine = lineSegments[nextLineIndex]
        // console.log({ nextLine })

        if (nextLine.x1 > thisLine.x2) {
          console.log('no overlap')
          if (nextLineIndex === lineSegments.length - 1) {
            // console.log('end reached')
            // console.log(`total += ${nextLine.length() + 1}`)
            // total += nextLine.length() + 1
            // addToTotalOld(nextLine.length() + 1)
            addToTotal(nextLine.x1, nextLine.x2)
          }
          break
        }

        if (nextLine.x2 <= thisLine.x2) {
          // console.log('complete overlap, ignoring')
          // ignore this and move next line forwards
          nextLineIndex++
          continue
        }

        // partial overlap
        // console.log(`partial overlap`)
        const delta = nextLine.x2 - thisLine.x2
        // total += delta
        // addToTotalOld(delta)
        addToTotal(thisLine.x2 + 1, nextLine.x2)

        thisLine.x2 = nextLine.x2
        nextLineIndex++
      }

      thisLineIndex = nextLineIndex
    }
    return total
  }

  return getTotal(lineSegments)
}

export { main }
