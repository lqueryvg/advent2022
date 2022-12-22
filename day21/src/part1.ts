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

  const getMonkeyNumber = (monkeyName: string): number => {
    const monkey = monkeyMap.get(monkeyName)!
    let number = monkey?.number
    if (number !== undefined) {
      return number
    }

    const number1 = getMonkeyNumber(monkey.requires![0])
    const number2 = getMonkeyNumber(monkey.requires![1])
    switch (monkey.operation) {
      case '+':
        return number1 + number2
      case '*':
        return number1 * number2
      case '/':
        return number1 / number2
      case '-':
        return number1 - number2
    }

    throw new Error('invalid operation')
  }

  return getMonkeyNumber('root')
}

export { main }
