import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const rockCubes = new Set<string>()
const airCubes = new Set<string>()

const printBounds = () => {
  let maxX = Number.MIN_VALUE
  let minX = Number.MAX_VALUE
  let maxY = Number.MIN_VALUE
  let minY = Number.MAX_VALUE
  let maxZ = Number.MIN_VALUE
  let minZ = Number.MAX_VALUE
  for (let coordsString of rockCubes.values()) {
    const [x, y, z] = coordsString.split(',').map(Number)
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
    minZ = Math.min(minZ, z)
    maxZ = Math.max(maxZ, z)
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

  for (let line of input) {
    rockCubes.add(line)
  }

  if (input.length === 26) {
    // we are using the example input
    min = 0
    max = 7
    fillAir('0,0,0')
  } else {
    // we are using the full input
    // printBounds()
    // { minX: 0, maxX: 19, minY: 0, maxY: 19, minZ: 0, maxZ: 19 }
    min = -1
    max = 20
    fillAir('-1,-1,-1')
  }

  return totalSurfaceArea
}

export { main }
