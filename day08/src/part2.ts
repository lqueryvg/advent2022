import { readFileSync } from 'fs'

let height = 0
let width = 0

const part2 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let forest: number[][] = []

  for (const line of lines) {
    if (line === '') continue // skip blank lines
    height++
    width = line.length

    forest.push([])
    for (let x = 0; x < width; x++) {
      forest[height - 1][x] = Number(line.charAt(x))
    }
  }

  const lookRightFrom = (x: number, y: number) => {
    let score = 0
    const startHeight = forest[y][x]

    for (let ix = x + 1; ix < width; ix++) {
      score++
      const thisHeight = forest[y][ix]
      if (thisHeight >= startHeight) {
        break
      }
    }
    return score
  }

  const lookLeftFrom = (x: number, y: number) => {
    let score = 0
    const startHeight = forest[y][x]

    for (let ix = x - 1; ix >= 0; ix--) {
      score++
      const thisHeight = forest[y][ix]
      if (thisHeight >= startHeight) {
        break
      }
    }
    return score
  }

  const lookDownFrom = (x: number, y: number) => {
    let score = 0
    const startHeight = forest[y][x]

    for (let iy = y + 1; iy < height; iy++) {
      score++
      const thisHeight = forest[iy][x]
      if (thisHeight >= startHeight) {
        break
      }
    }
    return score
  }

  const lookUpFrom = (x: number, y: number) => {
    let score = 0
    const startHeight = forest[y][x]

    for (let iy = y - 1; iy >= 0; iy--) {
      score++
      const thisHeight = forest[iy][x]
      if (thisHeight >= startHeight) {
        break
      }
    }
    return score
  }

  let maxScore = 0

  const getScore = (x: number, y: number) => {
    return (
      lookLeftFrom(x, y) *
      lookRightFrom(x, y) *
      lookDownFrom(x, y) *
      lookUpFrom(x, y)
    )
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const score = getScore(x, y)
      if (score > maxScore) {
        maxScore = score
      }
    }
  }

  console.log({ part2: maxScore })
}

export default part2
