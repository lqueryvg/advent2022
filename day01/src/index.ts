import { loadData } from './utils'

let totals = loadData('./input.txt')

console.log({ part1: totals[0] })
console.log({ part2: totals[0] + totals[1] + totals[2] })
