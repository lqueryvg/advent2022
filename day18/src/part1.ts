import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const cubes = new Map<string, Cube>()
class Cube {
  x: number
  y: number
  z: number
  neighborCount = 0

  updateNeighborCountIfExists(x: number, y: number, z: number) {
    const s = `${x},${y},${z}`
    // console.log({ x, y, z })
    if (cubes.has(s)) {
      // console.log('yes')
      cubes.get(s)!.neighborCount++
      return 1
    }
    return 0
  }
  constructor(thisString: string) {
    const [x, y, z] = thisString.split(',').map(Number)
    this.x = x
    this.y = y
    this.z = z
    this.neighborCount += this.updateNeighborCountIfExists(x - 1, y, z)
    this.neighborCount += this.updateNeighborCountIfExists(x + 1, y, z)
    this.neighborCount += this.updateNeighborCountIfExists(x, y - 1, z)
    this.neighborCount += this.updateNeighborCountIfExists(x, y + 1, z)
    this.neighborCount += this.updateNeighborCountIfExists(x, y, z - 1)
    this.neighborCount += this.updateNeighborCountIfExists(x, y, z + 1)
  }
}

const main = () => {
  const input = getInput('input.txt')
  for (let line of input) {
    cubes.set(line, new Cube(line))
  }
  // console.log({ cubes })
  let totalNeighbors = 0
  for (let cube of cubes.values()) {
    totalNeighbors += cube.neighborCount
  }
  return cubes.size * 6 - totalNeighbors
}

export { main }
