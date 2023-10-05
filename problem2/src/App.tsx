import { yupResolver } from "@hookform/resolvers/yup"
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ReactSVG } from "react-svg"
import * as yup from "yup"
import "./App.css"
import { exchange, fetcher } from "./fetcher"

type TSwapForm = {
  inputAmount: number
  inputCurrency: string
  outputCurrency: string
}
export interface ICoin {
  currency: string
  price: number
  date: string
}

const schema = yup.object({
  inputAmount: yup
    .number()
    .integer("Please enter a valid amount")
    .required("Please enter an amount"),
  inputCurrency: yup.string().required("Please select a currency"),
  outputCurrency: yup.string().required("Please select a currency"),
})

function App() {
  const [coinList, setCoinList] = useState<ICoin[]>([])
  const [isReady, setIsReady] = useState<boolean>(false)
  const [outputAmount, setOutputAmount] = useState<number>(0)

  const fetchCoins = useCallback(async () => {
    const coins = await fetcher<ICoin[]>(
      "https://interview.switcheo.com/prices.json"
    )
    const sortedCoins = coins.sort((a, b) => {
      return a.currency.localeCompare(b.currency)
    })
    setIsReady(true)
    setCoinList(sortedCoins)
  }, [])

  useEffect(() => {
    fetchCoins()
  }, [fetchCoins])
  const { handleSubmit, control } = useForm<TSwapForm>({
    defaultValues: {
      inputAmount: 0,
      inputCurrency: "USD",
      outputCurrency: "ETH",
    },
    resolver: yupResolver(schema),
  })
  const onSubmit = useCallback(
    (data: TSwapForm) => {
      const result = exchange(
        data.inputAmount,
        data.inputCurrency,
        data.outputCurrency,
        coinList
      )
      setOutputAmount(result)
    },
    [coinList]
  )
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Exchange Crypto</h1>
        <Box className="flex items-center justify-between ">
          <Controller
            name="inputAmount"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <TextField
                  // error={!!errors.inputAmount}
                  id="input-amount"
                  label="Amount"
                  variant="outlined"
                  type="number"
                  // helperText={errors.inputAmount?.message}
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  {...field}
                />
              </FormControl>
            )}
          />
          <Controller
            name="inputCurrency"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="input-currency">Currency</InputLabel>
                <Select
                  labelId="input-currency"
                  id="input-currency-select"
                  label="Currency"
                  disabled={!isReady}
                  {...field}
                >
                  {coinList.map((coin, index) => (
                    <MenuItem key={index} value={coin.currency}>
                      <div className="flex items-center">
                        <span className="svg_icon">
                          <ReactSVG
                            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${coin.currency}.svg`}
                          />
                        </span>
                        {coin.currency}
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <span>=</span>
          <FormControl fullWidth>
            <TextField
              id="output-amount"
              // label="Amount exchange"
              variant="outlined"
              disabled
              value={outputAmount}
            />
          </FormControl>
          <Controller
            name="outputCurrency"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="input-currency">Currency</InputLabel>
                <Select
                  labelId="input-currency"
                  id="input-currency-select"
                  disabled={!isReady}
                  label="Currency"
                  {...field}
                >
                  {coinList.map((coin, index) => (
                    <MenuItem key={index} value={coin.currency}>
                      <div className="flex">
                        <span className="svg_icon">
                          <ReactSVG
                            src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${coin.currency}.svg`}
                          />
                        </span>
                        {coin.currency}
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          <span>
            <CircularProgress
              style={{
                height: 20,
                width: 20,
                visibility: isReady ? "hidden" : "visible",
              }}
            />
          </span>
        </Box>
        <Button variant="contained" type="submit">
          EXCHANGE
        </Button>
      </form>
    </div>
  )
}

export default App
