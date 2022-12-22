import { readFileSync } from 'fs'
import { off } from 'process'

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)
  return lines
}

interface OffsetObject {
  number: number
  prev?: Offset
  next?: Offset
}

type Offset = OffsetObject | undefined

const removeOffsetFromCircle = (offset: Offset) => {
  const previous = offset!.prev
  const next = offset!.next
  previous!.next = next
  next!.prev = previous
}

const insertOffsetBeforeOther = (offset: Offset, other: Offset) => {
  const previous = other!.prev
  previous!.next = offset
  other!.prev = offset
  offset!.prev = previous
  offset!.next = other
}

const moveOffsetBeforeOther = (offset: Offset, other: Offset) => {
  if (offset === other) {
    throw new Error('unable to move an offset before itself')
  }
  removeOffsetFromCircle(offset)
  insertOffsetBeforeOther(offset, other)
}

const getOffsetNumPlacesToTheRight = (offset: Offset, numPlaces: number) => {
  let currentOffset = offset
  for (let i = 0; i < numPlaces; i++) {
    currentOffset = currentOffset!.next
  }
  return currentOffset
}

const getOffsetNumPlacesToTheLeft = (offset: Offset, numPlaces: number) => {
  let currentOffset = offset
  for (let i = 0; i < numPlaces; i++) {
    currentOffset = currentOffset!.prev
  }
  return currentOffset
}

const moveOffsetNumPlacesRight = (offset: Offset, numPlaces: number) => {
  const targetOffset = getOffsetNumPlacesToTheRight(offset, numPlaces)
  if (targetOffset === offset) {
    console.log('moveOffsetNumPlacesRight', { offset, numPlaces })
    return
  }
  moveOffsetBeforeOther(offset, targetOffset?.next)
}

const moveOffsetNumPlacesLeft = (offset: Offset, numPlaces: number) => {
  const targetOffset = getOffsetNumPlacesToTheLeft(offset, numPlaces)
  if (targetOffset === offset) {
    console.log('moveOffsetNumPlacesLeft', { offset, numPlaces })
    return
  }
  moveOffsetBeforeOther(offset, targetOffset)
}

const printNumbers = (zero: Offset) => {
  let currentOffset = zero
  do {
    console.log(currentOffset!.number)
    currentOffset = currentOffset!.next
  } while (currentOffset !== zero)
}

const main = () => {
  const numberStrings = getInput('input.txt')

  let previousOffset: Offset
  let offset: Offset

  const originalList: Offset[] = []
  let zero: Offset
  for (let i = 0; i < numberStrings.length; i++) {
    const number = Number(numberStrings[i])
    offset = {
      number,
      prev: previousOffset,
    }
    if (number === 0) {
      zero = offset
    }
    originalList.push(offset)
    if (previousOffset) {
      previousOffset.next = offset
    }
    previousOffset = offset
  }

  const first = originalList[0]
  const last = originalList[originalList.length - 1]

  first!.prev = last
  last!.next = first

  // console.log('un-mixed')
  // printNumbers(zero)

  // console.log('mixing')
  for (let i = 0; i < originalList.length; i++) {
    const offset = originalList[i]
    const numSpaces = offset?.number!

    const mod = originalList.length - 1

    if (numSpaces < 0) {
      moveOffsetNumPlacesLeft(offset, Math.abs(numSpaces) % mod)
    } else if (numSpaces > 0) {
      moveOffsetNumPlacesRight(offset, Math.abs(numSpaces) % mod)
    } else {
      zero = offset
      // console.log({ zero })
    }
  }

  // console.log('mixed')
  // printNumbers(zero)

  const oneThousand = getOffsetNumPlacesToTheRight(zero, 1000)?.number!
  const twoThousand = getOffsetNumPlacesToTheRight(zero, 2000)?.number!
  const threeThousand = getOffsetNumPlacesToTheRight(zero, 3000)?.number!

  // console.log({ oneThousand, twoThousand, threeThousand })
  const result = oneThousand + twoThousand + threeThousand
  // console.log({ result })

  return result
}

export { main }
