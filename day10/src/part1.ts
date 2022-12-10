import { readFileSync } from 'fs'

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let cycle = 1
  let x = 1
  let nextInterestingCycle = 20
  let totalSignalStrength = 0

  const checkCycle = () => {
    if (cycle === nextInterestingCycle) {
      const thisSignalStrength = cycle * x
      totalSignalStrength += thisSignalStrength
      nextInterestingCycle += 40
      // console.log({ cycle, thisSignalStrength, totalSignalStrength })
    }
  }

  checkCycle()

  for (const line of lines) {
    if (line === '') continue // skip blank lines

    cycle++
    checkCycle()

    if (line === 'noop') {
      checkCycle()
    } else {
      // add
      const words = line.split(/\s+/)
      const v = Number(words[1])
      cycle++
      x += v
      checkCycle()
    }
  }
  console.log({ part1: totalSignalStrength })
}

export { main }
