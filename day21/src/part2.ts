import { readFileSync } from 'fs'

interface Monkey {
  name: string
  number?: number
  requires?: string[]
  operation?: string
}
const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)

  const monkeys = lines.map((line) => {
    const [name, job] = line.split(/: /)
    const jobWords = job.split(/\s+/)
    const monkey: Monkey = { name }

    if (jobWords.length === 1) {
      monkey.number = Number(jobWords[0])
    } else {
      monkey.requires = [jobWords[0], jobWords[2]]
      monkey.operation = jobWords[1]
    }
    return monkey
  })

  return monkeys
}

const main = () => {
  const monkeys = getInput('input.txt')

  const monkeyMap = new Map<string, Monkey>()

  // update map
  monkeys.forEach((monkey) => {
    monkeyMap.set(monkey.name, monkey)
  })
  // console.log({ monkeys })
  // console.log({ monkeyMap })

  const getMonkeyNumber = (monkeyName: string): number | string => {
    const monkey = monkeyMap.get(monkeyName)!
    if (monkey.name === 'humn') return '(x)'
    if (monkey.name === 'root') monkey.operation = '='

    const number = monkey.number

    if (number !== undefined) {
      return number
    }

    const left = getMonkeyNumber(monkey.requires![0])
    const right = getMonkeyNumber(monkey.requires![1])
    // console.log({ left, right })

    // if both sides are known, compute result and return it
    if (typeof left === 'number' && typeof right === 'number') {
      switch (monkey.operation) {
        case '+':
          return left + right
        case '*':
          return left * right
        case '/':
          return left / right
        case '-':
          return left - right
        default:
          throw new Error('invalid operation')
      }
    }

    // only one is known
    let knownNumber = left as number
    let equationString = right as string
    if (typeof left === 'string') {
      knownNumber = right as number
      equationString = left as string
    }

    // console.log({ operation: monkey.operation })
    switch (monkey.operation) {
      case '=':
        return eval(equationString.replace(/x/, `(${knownNumber})`))
      case '*':
        return equationString.replace(/x/, `(x / ${knownNumber})`)
      case '+':
        return equationString.replace(/x/, `(x - ${knownNumber})`)
      case '-':
        if (typeof right === 'number')
          return equationString.replace(/x/, `(x + ${knownNumber})`)
        return equationString.replace(/x/, `(${knownNumber} - x)`)
      case '/':
        if (typeof right === 'number')
          return equationString.replace(/x/, `(x * ${knownNumber})`)
        else return equationString.replace(/x/, `(${knownNumber} / x)`)
    }
    throw new Error('something went wrong!')
  }

  return getMonkeyNumber('root')
}

export { main }
