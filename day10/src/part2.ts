import { readFileSync } from 'fs'

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let cycle = 1
  let x = 1
  let output = Array(6).fill('')

  const checkCycle = () => {
    const column = (cycle - 1) % 40
    const row = Math.floor((cycle - 1) / 40)
    const ab = Math.abs(column - x)
    output[row] += ab <= 1 ? 'Q' : '.'
  }

  checkCycle()

  for (const line of lines) {
    if (line === '') continue // skip blank lines

    cycle++
    checkCycle()

    if (line === 'noop') {
      // checkCycle()
    } else {
      // add
      const words = line.split(/\s+/)
      const v = Number(words[1])
      cycle++
      x += v
      checkCycle()
    }
  }
  console.log({ part1: output })
}

export { main }
