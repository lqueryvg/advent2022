import { readFileSync } from 'fs'

type Range = [number, number]

const rangeIncludesPoint = (range: Range, point: number) => {
  return point >= range[0] && point <= range[1]
}

const rangeIncludesRange = (r1: Range, r2: Range) => {
  return r1[0] <= r2[0] && r1[1] >= r2[1]
}

const stringToRange = (s: string) => {
  return s.split('-').map(Number) as Range
}

const rangesOverlap = (r1: Range, r2: Range) => {
  return (
    rangeIncludesPoint(r2, r1[0]) ||
    rangeIncludesPoint(r2, r1[1]) ||
    rangeIncludesRange(r1, r2)
  )
}

const part2 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let count = 0
  for (const line of lines) {
    if (line === '') continue
    const ranges = line.split(',').map(stringToRange)
    if (rangesOverlap(ranges[0], ranges[1])) {
      // console.log(line, 'yes')
      count++
    } else {
      // console.log(line, 'no')
    }
  }
  console.log({ part2Improved: count })
}

export default part2
