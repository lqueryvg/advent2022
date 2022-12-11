import { readFileSync } from 'fs'

function isEmpty(obj: any) {
  return Object.keys(obj).length === 0
}

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.split(/\r\n|\n/)

  const monkeys: any[] = []
  let monkey: any = {}

  for (const line of lines) {
    if (line === '') continue // skip blank lines

    const words = line.split(/: /)
    if (words[0].startsWith('Monkey')) {
      if (!isEmpty(monkey)) {
        monkeys.push(monkey)
      }
      monkey = {
        inspectedItemsCount: 0,
      } // start new monkey

      continue
    }
    switch (words[0]) {
      case '  Starting items':
        monkey.items = words[1].split(/,\s+/).map(Number)
        break
      case '  Operation':
        monkey.operation = words[1].split(/ = /)[1]
        break
      case '  Test':
        monkey.testDivisibleBy = Number(words[1].split(/\s+/).pop()!)
        break
      case '    If true':
        monkey.trueTarget = words[1].split('monkey ')[1]
        break
      case '    If false':
        monkey.falseTarget = words[1].split('monkey ')[1]
        break
      default:
        throw new Error(`unhandled word: ${words[0]}`)
    }
  }
  monkeys.push(monkey)

  const numRounds = 20
  for (let round = 1; round <= numRounds; round++) {
    for (let monkey of monkeys) {
      for (let item of monkey.items) {
        monkey.inspectedItemsCount++
        switch (monkey.operation) {
          case 'old * 19':
            item *= 19
            break
          case 'old + 6':
            item += 6
            break
          case 'old * old':
            item *= item
            break
          case 'old + 3':
            item += 3
            break
          case 'old * 3':
            item *= 3
            break
          case 'old + 7':
            item += 7
            break
          case 'old + 5':
            item += 5
            break
          case 'old + 8':
            item += 8
            break
          case 'old + 4':
            item += 4
            break
          case 'old * 2':
            item *= 2
            break
          default:
            throw new Error(`unexpected operation: ${monkey.operation}`)
        }
        item = Math.floor(item / 3)

        // tests
        if (item % monkey.testDivisibleBy === 0) {
          monkeys[monkeys[monkey.trueTarget].items.push(item)]
        } else {
          monkeys[monkeys[monkey.falseTarget].items.push(item)]
        }
      }
      monkey.items = []
    }
    const logMonkeyItems = () => {
      for (
        let monkeyNumber = 0;
        monkeyNumber < monkeys.length;
        monkeyNumber++
      ) {
        const monkey = monkeys[monkeyNumber]
        console.log({ monkeyNumber, items: monkey.items })
      }
    }

    // logMonkeyItems()
  } // round

  const counts = monkeys.map((monkey) => monkey.inspectedItemsCount)

  const sorted = counts.sort((a: number, b: number) => b - a)
  return sorted[0] * sorted[1]
}

export { main }
