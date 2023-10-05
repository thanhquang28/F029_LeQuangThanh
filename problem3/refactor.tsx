interface WalletBalance {
  currency: string
  amount: number
  blockchain: string
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string
}

interface Props extends BoxProps {}
export const WalletPage: React.FC<Props> = (props: Props) => {
  const { ...rest } = props
  const balances: WalletBalance[] = useWalletBalances()
  const prices: Record<string, number> = usePrices()

  // use any instead of string
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100
      case "Ethereum":
        return 50
      case "Arbitrum":
        return 30
      case "Zilliqa":
      case "Neo":
        return 20

      default:
        return -99
    }
  }

  const sortedBalances = useMemo<WalletBalance[]>(() => {
    return balances
      .filter((balance) => {
        const balancePriority = getPriority(balance.blockchain)
        return balancePriority > -99 && balance.amount <= 0
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        return leftPriority - rightPriority
      })
  }, [balances, prices]) as WalletBalance[]
  // i used 'as WalletBalance[]' for set type purpose

  const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
    (balance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      }
    }
  )

  const rows = formattedBalances.map((balance, index) => {
    const usdValue = prices[balance.currency] * balance.amount || undefined
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return <div {...rest}>{rows}</div>
}
