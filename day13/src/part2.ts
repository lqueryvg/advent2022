import { readFileSync } from 'fs'

/*
return:
1 = correct
0 = need to continue
-1 = incorrect
*/
const compare = (left: any, right: any): number => {
  if (typeof left === 'object' && typeof right === 'object') {
    let rightIndex = 0
    let result = 0
    for (let leftItem of left) {
      const rightItem = right[rightIndex]
      if (rightItem === undefined) {
        // console.log('ran out of items on right')
        return -1
      }
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
  for (const line of lines) {
    if (line === '') continue // skip blank lines
    newString += `${line},`
  }
  newString += '[[2]], [[6]] ]'

  const packets = eval(newString)

  const sorted = packets.sort((a: any, b: any) => compare(b, a))

  function arraysEqual(a1: any, a2: any) {
    return JSON.stringify(a1) === JSON.stringify(a2)
  }
  const firstIndex =
    sorted.findIndex((element: any) => arraysEqual(element, [[2]])) + 1
  const secondIndex =
    sorted.findIndex((element: any) => arraysEqual(element, [[6]])) + 1
  return firstIndex * secondIndex
}

export { main }
