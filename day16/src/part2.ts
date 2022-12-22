import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  const regexp =
    /Valve (?<name>-?.*) has flow rate=(?<rate>-?.*); tunnels* leads* to valves* (?<exits>-?.*)/
  return lines.map((line) => {
    const match = line.match(regexp)!.groups
    return {
      name: match!.name,
      rate: Number(match!.rate),
      isOpen: false,
      exits: match!.exits.split(', '),
    }
  })
}

const main = () => {
  const nodes = getInput('input.txt')
  return 'TBD'
}

export { main }
