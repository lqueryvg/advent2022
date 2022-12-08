import { readFileSync } from 'fs'

let height = 0
let width = 0

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let visible: number[][] = []
  let forest: number[][] = []

  const countVisible = () => {
    let count = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const treeVisible = visible[y][x]
        if (treeVisible === 1) {
          count++
        }
      }
    }
    return count
  }

  const lookRight = () => {
    for (let y = 0; y < height; y++) {
      let max = -1
      for (let x = 0; x < width; x++) {
        if (forest[y][x] > max) {
          max = forest[y][x]
          visible[y][x] = 1
        }
      }
    }
  }
  const lookLeft = () => {
    for (let y = 0; y < height; y++) {
      let max = -1
      for (let x = width - 1; x >= 0; x--) {
        if (forest[y][x] > max) {
          max = forest[y][x]
          visible[y][x] = 1
        }
      }
    }
  }

  const lookDown = () => {
    for (let x = 0; x < width; x++) {
      let max = -1
      for (let y = 0; y < height; y++) {
        const treeSize = forest[y][x]
        if (treeSize > max) {
          max = treeSize
          visible[y][x] = 1
        }
      }
    }
  }

  const lookUp = () => {
    for (let x = 0; x < width; x++) {
      let max = -1
      for (let y = height - 1; y >= 0; y--) {
        const treeSize = forest[y][x]
        if (treeSize > max) {
          max = treeSize
          visible[y][x] = 1
        }
      }
    }
  }

  for (const line of lines) {
    if (line === '') continue // skip blank lines
    height++
    width = line.length

    visible.push([])
    forest.push([])
    // console.log({ line })
    for (let x = 0; x < width; x++) {
      visible[height - 1][x] = 0
      forest[height - 1][x] = Number(line.charAt(x))
    }
  }
  lookRight()
  lookLeft()
  lookUp()
  lookDown()
  // console.log({ forest, visible })

  // console.log({ height, width })
  console.log({ part1: countVisible() })
}

export default part1
