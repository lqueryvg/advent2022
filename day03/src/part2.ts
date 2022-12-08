import { readFileSync } from 'fs'

const getCommonChars2 = (s1: string, s2: string) => {
  const commonChars: string[] = []

  for (let i = 0; i < s1.length; i++) {
    const character = s1.charAt(i)
    if (s2.includes(s1[i])) {
      commonChars.push(s1[i])
    }
  }
  return commonChars.join('')
}

const getCommonChars3 = (s1: string, s2: string, s3: string) => {
  return getCommonChars2(getCommonChars2(s1, s2), s3)
}

const getPriority = (char: string) => {
  let code = char.charCodeAt(0) - 96
  if (code < 0) code += 31 + 27
  return code
}

const part2 = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let total = 0
  let group: string[] = []

  for (const line of lines) {
    if (line === '') continue
    group.push(line)
    if (group.length === 3) {
      total += getPriority(getCommonChars3(group[0], group[1], group[2])[0])
      group = []
    }
  }
  console.log({ part2: total })
}

export default part2
