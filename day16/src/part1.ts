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

  const valves = new Map<string, any>()

  // const scores = new Map<string, number>([
  //   ['A X', 1 + 3],
  //   ['A Y', 2 + 6],
  //   ['A Z', 3 + 0],
  //   ['B X', 1 + 0],
  //   ['B Y', 2 + 3],
  //   ['B Z', 3 + 6],
  //   ['C X', 1 + 6],
  //   ['C Y', 2 + 0],
  //   ['C Z', 3 + 3],
  // ])

  console.log('graph {')
  for (let node of nodes) {
    valves.set(node.name, node)
    // console.log({ valves })
  }

  for (let node of nodes) {
    for (let exit of node.exits) {
      console.log(
        `  "${node.name}-${node.rate}" -- "${exit}-${valves.get(exit)!.rate}";`
      )
    }
  }
  // console.log(JSON.stringify(nodes, null, 4))
  console.log('}')

  // console.log(JSON.stringify(nodes, null, 4))
  return 'TBD'
}

export { main }
