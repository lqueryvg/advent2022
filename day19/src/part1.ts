import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  //   const regexp =
  //   /Valve (?<name>-?.*) has flow rate=(?<rate>-?.*); tunnels* leads* to valves* (?<exits>-?.*)/
  // const nodes = lines.map((line) => {
  //   const match = line.match(regexp)!.groups
  //   return {
  //     name: match!.name,
  //     rate: Number(match!.rate),
  //     isOpen: false,
  //     exits: match!.exits.split(', '),
  //   }
  // })

  // for (const line of lines) {
  //   if (line === '') continue // skip blank lines
  // }
  return lines

  // return {
  //   jetPattern: line,
  // }
  // throw new Error('no input lines found')
}

const main = () => {
  const input = getInput('input.txt')
  return 'TBA'
}

export { main }
