import { readFileSync } from 'fs'

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  for (const line of lines) {
    if (line === '') continue // skip blank lines
  }
  return 'TBD'
}

export { main }
