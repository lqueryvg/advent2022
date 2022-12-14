import { readFileSync } from 'fs'

let maxX = 500
let maxY = Number.MIN_VALUE
let minX = 500

class Point {
  x: number
  y: number

  constructor(point: string | number[]) {
    this.x = 0
    this.y = 0
    if (typeof point === 'string') {
      ;[this.x, this.y] = point.split(',').map(Number)
      // console.log(this.x, this.y)
    }
    if (this.x > maxX) maxX = this.x
    if (this.y > maxY) maxY = this.y
    if (this.x < minX) minX = this.x
  }
}

const printGrid = (grid: any) => {
  console.log('=====================================================')
  let y = 0
  grid.map((row: any) => {
    const rowString = row.join('')
    let rowNum = y.toString().padStart(3, '0')
    console.log(rowNum + rowString.substring(minX, maxX + 1))
    y++
  })
}

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.trim().split(/\r\n|\n/)

  const rocks = []
  for (const line of lines) {
    const words = line.split(/ -> /)

    let prevPoint: Point
    rocks.push(
      words
        .map((pointString) => {
          const point = new Point(pointString)
          let ret: any
          if (!prevPoint) {
            ret = []
          } else {
            ret = [prevPoint, point]
          }
          prevPoint = point
          return ret
        })
        .filter((a: Point[]) => a.length === 2)
    )
  }
  // console.log({ minX, maxX, minY, maxY })

  const drawRock = (grid: any, pointPair: any) => {
    const p1 = pointPair[0]
    const p2 = pointPair[1]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    if (dx === 0) {
      // console.log('vertical')
      const inc = Math.sign(dy)
      for (let y = p1.y; y !== p2.y + inc; y += inc) {
        grid[y][p1.x] = '#'
      }
    } else if (dy === 0) {
      // console.log('horizontal')
      const inc = Math.sign(dx)
      for (let x = p1.x; x !== p2.x + inc; x += inc) {
        grid[p1.y][x] = '#'
      }
    }
  }

  const grid: any = []
  maxY += 2 // position of the bottom rock

  // to hopefully make the bottom rock wide enough
  minX -= 200
  maxX += 200

  for (let y = 0; y <= maxY; y++) {
    grid.push(new Array(maxX + 1).fill('.'))
  }

  grid[0][500] = '+'

  // draw rocks
  for (let rock of rocks) {
    for (let pair of rock) {
      drawRock(grid, pair)
    }
  }

  drawRock(grid, [new Point(`${minX},${maxY}`), new Point(`${maxX},${maxY}`)])

  const sandFallsToRest = () => {
    let sand = new Point('500,0')
    const path: Point[] = []
    while (true) {
      path.push(new Point(`${sand.x},${sand.y}`))
      if (grid[sand.y + 1][sand.x] === '.') {
        sand.y++
        continue
      } else if (grid[sand.y + 1][sand.x - 1] === '.') {
        sand.y++
        sand.x--
        continue
      } else if (grid[sand.y + 1][sand.x + 1] === '.') {
        sand.y++
        sand.x++
        continue
      }

      if (sand.x === 500 && sand.y === 0) {
        // sand hit the bottom rock
        return false
      }
      // sand fell to rest
      grid[sand.y][sand.x] = 'o'
      return true
    }
  }

  let units = 1
  while (sandFallsToRest()) {
    units++
  }
  // printGrid(grid)
  return units
}

export { main }
