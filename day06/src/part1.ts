import { readFileSync } from 'fs'

const wordLength = 4

const charsAreUnique = (s: string) => {
  const set = new Set(s.split(''))
  return set.size === wordLength
}

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  const line = lines[0]
  for (let i = 0; i <= line.length - wordLength; i++) {
    const word = line.substring(i, i + wordLength)
    if (charsAreUnique(word)) {
      console.log({ part1: i + wordLength })
      return
    }
  }
}

export default part1
