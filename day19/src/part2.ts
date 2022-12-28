import { readFileSync, stat } from 'fs'

interface RobotCost {
  ore: number
  clay: number
  obsidian: number
}
interface ResourceCounts {
  ore: number
  clay: number
  obsidian: number
  geode: number
}

interface State {
  minuteNumber: number
  maxMinutes: number
  robots: ResourceCounts
  resources: ResourceCounts
  path: string[]
}

interface Blueprint {
  oreRobotCost: RobotCost
  clayRobotCost: RobotCost
  obsidianRobotCost: RobotCost
  geodeRobotCost: RobotCost
}

const getInput = (filename: string) => {
  const file = readFileSync(filename, 'utf-8').trim()
  const lines = file.split(/\r\n|\n/)

  const regexp =
    /Blueprint (?<number>-?\d*): Each ore robot costs (?<oreRobotOreCost>-?\d*) ore. Each clay robot costs (?<clayRobotOreCost>-?\d*) ore. Each obsidian robot costs (?<obsidianRobotOreCost>-?\d*) ore and (?<obsidianRobotClayCost>-?\d*) clay. Each geode robot costs (?<geodeRobotOreCost>-?\d*) ore and (?<geodeRobotObsidianCost>-?\d*) obsidian./
  // Blueprint 28:             Each ore robot costs 4 ore.                 Each clay robot costs 4 ore.                  Each obsidian robot costs 2 ore                      and 11 clay.                      Each geode robot costs 3                   ore and 14 obsidian.
  const nodes = lines.map((line) => {
    // console.log({ line })
    const match = line.match(regexp)!.groups
    // return { ...match! }
    return {
      oreRobotCost: {
        ore: Number(match!.oreRobotOreCost),
        clay: 0,
        obsidian: 0,
      },
      clayRobotCost: {
        ore: Number(match!.clayRobotOreCost),
        clay: 0,
        obsidian: 0,
      },
      obsidianRobotCost: {
        ore: Number(match!.obsidianRobotOreCost),
        clay: Number(match!.obsidianRobotClayCost),
        obsidian: 0,
      },
      geodeRobotCost: {
        ore: Number(match!.geodeRobotOreCost),
        clay: 0,
        obsidian: Number(match!.geodeRobotObsidianCost),
      },
    } as Blueprint
  })
  return nodes
}

// let cache: Map<number, number>
let cache: Map<string, number>

const copyState = (state: State) => {
  return JSON.parse(JSON.stringify(state))
}

// const getCacheKey = (state: State) => {
//   const cacheKey =
//     `${state.minuteNumber} ${state.resources.ore},${state.resources.clay},` +
//     `${state.resources.obsidian},${state.resources.geode} ` +
//     `${state.robots.ore},${state.robots.clay},${state.robots.obsidian},${state.robots.geode}`
//   return cacheKey
// }

const executeMinutes = (state: State, blueprint: Blueprint): number => {
  if (state.minuteNumber > state.maxMinutes) {
    const result = state.resources.geode
    return result
  }

  // const cacheKey = getCacheKey(state)
  // `${state.minuteNumber} ${state.resources.ore},${state.resources.clay},` +
  // `${state.resources.obsidian},${state.resources.geode} ` +
  // `${state.robots.ore},${state.robots.clay},${state.robots.obsidian},${state.robots.geode}`

  // if (cache.has(cacheKey)) {
  //   const result = cache.get(cacheKey)!
  //   return result
  // }

  const outcomes: number[] = []

  // const setCache = (state: State, value: number) => {
  //   const cacheKey = getCacheKey(state)
  // `${state.minuteNumber},${state.resources.ore},${state.resources.clay},` +
  // `${state.resources.obsidian},${state.resources.geode},` +
  // `${state.robots.ore},${state.robots.clay},${state.robots.obsidian},${state.robots.geode}`
  // cache.set(cacheKey, value)
  // }

  // buy geode robot
  if (
    state.resources.ore >= blueprint.geodeRobotCost.ore &&
    state.resources.obsidian >= blueprint.geodeRobotCost.obsidian
  ) {
    const newState = copyState(state)
    newState.resources.ore -= blueprint.geodeRobotCost.ore
    newState.resources.obsidian -= blueprint.geodeRobotCost.obsidian
    newState.minuteNumber++
    newState.resources.ore += newState.robots.ore
    newState.resources.clay += newState.robots.clay
    newState.resources.obsidian += newState.robots.obsidian
    newState.resources.geode += newState.robots.geode
    newState.robots.geode++

    const result = executeMinutes(newState, blueprint)
    return result
    // setCache(newState, result)
    // outcomes.push(result)
  }

  // buy obsidian robot
  if (
    state.resources.ore >= blueprint.obsidianRobotCost.ore &&
    state.resources.clay >= blueprint.obsidianRobotCost.clay
  ) {
    const newState = copyState(state)
    newState.resources.ore -= blueprint.obsidianRobotCost.ore
    newState.resources.clay -= blueprint.obsidianRobotCost.clay
    newState.minuteNumber++
    newState.resources.ore += newState.robots.ore
    newState.resources.clay += newState.robots.clay
    newState.resources.obsidian += newState.robots.obsidian
    newState.resources.geode += newState.robots.geode
    newState.robots.obsidian++
    const result = executeMinutes(newState, blueprint)
    if (newState.minuteNumber > 15) {
      return result
    } else {
      // setCache(newState, result)
      outcomes.push(result)
    }
  }

  // buy ore robot
  if (state.resources.ore >= blueprint.oreRobotCost.ore) {
    const newState = copyState(state)
    newState.resources.ore -= blueprint.oreRobotCost.ore
    newState.minuteNumber++
    newState.resources.ore += newState.robots.ore
    newState.resources.clay += newState.robots.clay
    newState.resources.obsidian += newState.robots.obsidian
    newState.resources.geode += newState.robots.geode
    newState.robots.ore++
    const result = executeMinutes(newState, blueprint)
    // setCache(newState, result)
    outcomes.push(result)
  }

  // buy clay robot
  if (state.resources.ore >= blueprint.clayRobotCost.ore) {
    const newState = copyState(state)
    newState.resources.ore -= blueprint.clayRobotCost.ore
    newState.minuteNumber++
    newState.resources.ore += newState.robots.ore
    newState.resources.clay += newState.robots.clay
    newState.resources.obsidian += newState.robots.obsidian
    newState.resources.geode += newState.robots.geode
    newState.robots.clay++
    const result = executeMinutes(newState, blueprint)
    // setCache(newState, result)
    outcomes.push(result)
  }

  {
    const newState = copyState(state)
    newState.minuteNumber++
    newState.resources.ore += newState.robots.ore
    newState.resources.clay += newState.robots.clay
    newState.resources.obsidian += newState.robots.obsidian
    newState.resources.geode += newState.robots.geode
    const result = executeMinutes(newState, blueprint)

    // setCache(newState, result)
    outcomes.push(result)
  }

  const result = Math.max(...outcomes)
  // cache.set(cacheKey, result)
  return result
}

const main = () => {
  const blueprints = getInput('input.txt')

  const initialResources: ResourceCounts = {
    clay: 0,
    geode: 0,
    obsidian: 0,
    ore: 0,
  }
  const initialRobots: ResourceCounts = {
    clay: 0,
    geode: 0,
    obsidian: 0,
    ore: 1,
  }
  const initialState: State = {
    maxMinutes: 32,
    minuteNumber: 1,
    resources: initialResources,
    robots: initialRobots,
    path: [],
  }

  let answer = 1
  for (let blueprintNumber = 0; blueprintNumber < 3; blueprintNumber++) {
    console.log({ blueprintNumber })
    cache = new Map<string, number>()
    const result = executeMinutes(initialState, blueprints[blueprintNumber])
    console.log({ result })
    answer *= result
  }

  return answer
}

export { main }
