import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const rockCubes = new Map<string, RockCube>()
const airCubes = new Set<string>()
class RockCube {
  x: number
  y: number
  z: number
  neighborCount = 0

  updateNeighborCountIfExists(x: number, y: number, z: number) {
    const s = `${x},${y},${z}`
    if (rockCubes.has(s)) {
      rockCubes.get(s)!.neighborCount++
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

const printBounds = () => {
  let maxX = Number.MIN_VALUE
  let minX = Number.MAX_VALUE
  let maxY = Number.MIN_VALUE
  let minY = Number.MAX_VALUE
  let maxZ = Number.MIN_VALUE
  let minZ = Number.MAX_VALUE
  for (let cube of rockCubes.values()) {
    maxX = Math.max(maxX, cube.x)
    maxY = Math.max(maxY, cube.y)
    maxZ = Math.max(maxZ, cube.z)
    minX = Math.min(minX, cube.x)
    minY = Math.min(minY, cube.y)
    minZ = Math.min(minZ, cube.z)
  }
  console.log({ minX, maxX, minY, maxY, minZ, maxZ })
}

let totalSurfaceArea = 0
let min = 0
let max = 7

const fillAir = (startCoordsString: string) => {
  const airToExplore = [startCoordsString]

  while (true) {
    const coordsString = airToExplore.pop()
    if (!coordsString) break // we are done

    const [x, y, z] = coordsString.split(',').map(Number)

    if (x < min || x > max || y < min || y > max || z < min || z > max) {
      // console.log('out of bounds')
      continue
    }

    if (airCubes.has(coordsString)) {
      // console.log('air already visited')
      continue
    }
    // console.log({ coordsString })

    if (rockCubes.has(coordsString)) {
      // console.log('hit rock')
      totalSurfaceArea++
      continue
    }

    // console.log('add air')
    airCubes.add(coordsString)
    airToExplore.push(`${x - 1},${y},${z}`)
    airToExplore.push(`${x + 1},${y},${z}`)
    airToExplore.push(`${x},${y - 1},${z}`)
    airToExplore.push(`${x},${y + 1},${z}`)
    airToExplore.push(`${x},${y},${z - 1}`)
    airToExplore.push(`${x},${y},${z + 1}`)
  }
}

const main = () => {
  const input = getInput('input.txt')
  const addCube = (s: string) => {
    rockCubes.set(s, new RockCube(s))
  }

  for (let line of input) {
    addCube(line)
  }

  if (input.length === 26) {
    // example input
    min = 0
    max = 7
    fillAir('0,0,0')
  } else {
    // printBounds()
    // { minX: 0, maxX: 19, minY: 0, maxY: 19, minZ: 0, maxZ: 19 }
    // full input
    min = -1
    max = 20
    fillAir('-1,-1,-1')
  }

  return totalSurfaceArea
}

export { main }
