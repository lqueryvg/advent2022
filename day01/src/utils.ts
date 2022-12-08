import { readFileSync } from 'fs'

const loadData = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  let thisTotal = 0
  const totals: number[] = []

  lines.forEach((line) => {
    if (line === '') {
      totals.push(thisTotal)
      thisTotal = 0
      return
    }
    thisTotal += parseInt(line)
  })
  return totals.sort((a: number, b: number) => b - a)
}

export { loadData }
