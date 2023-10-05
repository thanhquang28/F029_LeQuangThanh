import { ICoin } from "./App"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url)
  await sleep(5000)
  if (!res.ok) {
    throw new Error("Something went wrong")
  }
  return res.json()
}

export const exchange = (
  amount: number,
  inputCurrency: string,
  outputCurrency: string,
  listCoins: ICoin[]
) => {
  const inputCoin = listCoins.find((coin) => coin.currency === inputCurrency)
  const outputCoin = listCoins.find((coin) => coin.currency === outputCurrency)
  if (!inputCoin || !outputCoin) {
    return 0
  }
  const result = (amount * inputCoin.price) / outputCoin.price
  return result
}
