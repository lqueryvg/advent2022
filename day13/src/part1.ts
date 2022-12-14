import { readFileSync } from 'fs'

const compare = (left: any, right: any): number => {
  // console.log('compare: ', { left, right })

  if (typeof left === 'object' && typeof right === 'object') {
    let rightIndex = 0
    let result = 0
    for (let leftItem of left) {
      const rightItem = right[rightIndex]
      if (rightItem === undefined) {
        // console.log('ran out of items on right')
        return -1
      }
      // console.log({ leftItem, rightItem })
      result = compare(leftItem, rightItem)
      if (result !== 0) {
        return result
      }
      rightIndex++
    }
    if (left.length < right.length) {
      // console.log('ran out of items on left')
      return 1
    }
    return result
  } else if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      // console.log('left side smaller')
      return 1
    } else if (left > right) {
      // console.log('right side smaller')
      return -1
    } else {
      return 0
    }
  } else if (typeof left === 'number' && typeof right === 'object') {
    return compare([left], right)
  } else if (typeof left === 'object' && typeof right === 'number') {
    return compare(left, [right])
  }
  /*
  return:
  1 = correct
  0 = need to continue
  -1 = incorrect
  */
  throw 'something went wrong'
}
const orderIsCorrect = (pair: any) => {
  const [left, right] = pair
  return compare(left, right) === 1
}

const main = (filename: string) => {
  const file = readFileSync(filename, 'utf-8')
  const lines = file.trim().split(/\r\n|\n/)

  let newString = '['
  let left, right
  for (const line of lines) {
    if (!left) {
      left = line
    } else {
      right = line
      newString += `[${left}, ${right}],    `
      left = undefined
    }
  }
  newString += ']'

  const pairs = eval(newString)

  let pairNum = 1
  let indexTotal = 0
  for (let pair of pairs) {
    if (orderIsCorrect(pair)) {
      indexTotal += pairNum
    }
    pairNum++
  }
  return indexTotal
}

export { main }
