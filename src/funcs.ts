export const randomNumber = (min: number, max: number): number =>
  Math.round(Math.random() * (max-min) + min)

export const asyncSleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
