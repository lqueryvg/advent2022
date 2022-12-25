import { readFileSync } from 'fs'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

const snafuStringToNumber = (snafuString: string) => {
  const digits = snafuString.split('').reverse()
  let decimalAnswer = 0
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i]
    switch (digit) {
      case '=':
        decimalAnswer += -2 * Math.pow(5, i)
        break
      case '-':
        decimalAnswer += -1 * Math.pow(5, i)
        break
      default:
        decimalAnswer += Number(digit) * Math.pow(5, i)
    }
  }
  return decimalAnswer
}

const numberToSnafuString = (decimalValue: number) => {
  let dec_value = decimalValue
  let snafuString = ''
  let carry = 0
  while (dec_value > 0) {
    const digit = (dec_value % 5) + carry
    // console.log({ dec_value, digit, carry })
    switch (digit) {
      case 3:
        snafuString = '=' + snafuString
        carry = 1
        break
      case 4:
        snafuString = '-' + snafuString
        carry = 1
        break
      default:
        snafuString = `${digit}` + snafuString
    }
    dec_value = (dec_value - (dec_value % 5)) / 5 + carry
    carry = 0
  }
  return snafuString || '0'
}

const sumSnafuStrings = (snafuStrings: string[]) =>
  snafuStrings
    .map((snafuString) => snafuStringToNumber(snafuString))
    .reduce((acc: number, current: number) => {
      return acc + current
    })

const main = () => {
  const snafuStrings = getInput('input.txt')
  const total = sumSnafuStrings(snafuStrings)

  return numberToSnafuString(total)
}

export { main }
