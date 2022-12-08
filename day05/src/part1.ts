import { timeStamp } from 'console'
import { readFileSync } from 'fs'

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let numStacks = 0
  const stackLines = []
  let stacks: string[][] = []
  for (const line of lines) {
    if (line === '') continue // skip blank lines

    if (line.startsWith(' 1')) {
      // this is the line containing the stack numbers
      const words = line.split(/\s+/)
      numStacks = Number(words[words.length - 2])

      // initialise empty stacks
      for (let i = 1; i <= numStacks; i++) {
        stacks[i - 1] = []
      }

      // build the initial stacks
      for (let stackLine of stackLines.reverse()) {
        stackLine = stackLine.padEnd(4 * numStacks, ' ')

        for (let stackNum = 1; stackNum <= numStacks; stackNum++) {
          const c = stackLine.charAt((stackNum - 1) * 4 + 1)
          if (c !== ' ') {
            stacks[stackNum - 1].push(c)
          }
        }
      }
      continue
    }

    if (line.startsWith('move ')) {
      const words = line.split(/\s+/)
      const [, itemCount, , from, , to] = words.map(Number)

      for (let i = 0; i < itemCount; i++) {
        stacks[to - 1].push(stacks[from - 1].pop()!)
      }
      continue
    }

    // capture stack picture line
    stackLines.push(line)
  }

  const part1 = stacks.map((stack) => stack.pop()).join('')
  console.log({ part1 })
}

export default part1
