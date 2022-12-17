import { readFileSync } from 'fs'

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)

  const regexp =
    /Valve (?<name>-?.*) has flow rate=(?<rate>-?.*); tunnels* leads* to valves* (?<exits>-?.*)/
  const nodes = lines.map((line) => {
    const match = line.match(regexp)!.groups
    return {
      name: match!.name,
      rate: Number(match!.rate),
      isOpen: false,
      exits: match!.exits.split(', '),
    }
  })
  console.log(JSON.stringify(nodes, null, 4))
  return 'TBD'
}

export { main }
