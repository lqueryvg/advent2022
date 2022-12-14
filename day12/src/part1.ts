import { readFileSync } from 'fs'

const pointToInt = (x: number, y: number) => {
  return y * 1e3 + x
}
const intToPoint = (int: number) => {
  return {
    y: Math.floor(int / 1e3),
    x: int % 1e3,
  }
}

const getNeighbors = (x: number, y: number, map: any) => {
  const res = []
  if (y + 1 < map.length && map[y + 1][x] <= map[y][x] + 1) {
    res.push(pointToInt(x, y + 1))
  }
  if (y - 1 >= 0 && map[y - 1][x] <= map[y][x] + 1) {
    res.push(pointToInt(x, y - 1))
  }
  if (x + 1 < map[y].length && map[y][x + 1] <= map[y][x] + 1) {
    res.push(pointToInt(x + 1, y))
  }
  if (x - 1 >= 0 && map[y][x - 1] <= map[y][x] + 1) {
    res.push(pointToInt(x - 1, y))
  }
  return res
}

const dijkstra = (map: any, start: any, end: any) => {
  const dist: any = {}
  const prev: any = {}
  let queue = []

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const id = pointToInt(x, y)
      dist[id] = Infinity
      queue.push(id)
    }
  }
  dist[pointToInt(start.x, start.y)] = 0

  while (queue.length) {
    let u: any = null
    for (const current of queue) {
      if (u === null || dist[current] < dist[u]) {
        u = current
      }
    }

    if (u === pointToInt(end.x, end.y)) {
      break
    }

    queue = queue.filter((x) => x !== u)

    const point = intToPoint(u)
    const neighbors = getNeighbors(point.x, point.y, map)
    for (const v of neighbors) {
      if (queue.includes(v)) {
        const alt = dist[u] + 1
        if (alt < dist[v]) {
          dist[v] = alt
          prev[v] = u
        }
      }
    }
  }
  return { dist, prev }
}

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.trim().split(/\r\n|\n/)

  let start: any
  let end: any

  const grid = lines.map((line, y) =>
    [...line].map((value, x) => {
      if (value === 'S') {
        start = {
          y,
          x,
        }
        return 0
      }
      if (value === 'E') {
        end = { y, x }
        return 25
      }
      return value.charCodeAt(0) - 'a'.charCodeAt(0)
    })
  )

  const data = dijkstra(grid, start, end)
  const distance = data.dist[pointToInt(end.x, end.y)]

  return distance
}

export { main }
