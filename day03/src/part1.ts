import { readFileSync } from 'fs'

const getCommonChar = (s1: string, s2: string) => {
  for (let i = 0; i < s1.length; i++) {
    const character = s1.charAt(i)
    if (s2.includes(s1[i])) {
      return character
    }
  }
}

const getPriority = (char: string) => {
  let code = char.charCodeAt(0) - 96
  if (code < 0) code += 31 + 27
  return code
}

const part1 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let total = 0
  for (const line of lines) {
    if (line === '') continue
    const s1 = line.substring(0, line.length / 2)
    const s2 = line.substring(line.length / 2, line.length)
    const commonChar = getCommonChar(s1, s2)
    total += getPriority(commonChar!)
  }
  console.log({ part1: total })
}

export default part1
