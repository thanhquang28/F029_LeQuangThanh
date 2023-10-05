// these interface can be extended from other interface
interface WalletBalance {
  currency: string
  amount: number
}
interface FormattedWalletBalance {
  currency: string
  amount: number
  formatted: string
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  // children is not used
  const { children, ...rest } = props

  // this hooks doesn't have any type
  const balances = useWalletBalances()
  const prices = usePrices()

  // use any instead of string
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100
      case "Ethereum":
        return 50
      case "Arbitrum":
        return 30

      // duplicate case
      case "Zilliqa":
        return 20
      case "Neo":
        return 20
      default:
        return -99
    }
  }

  // doesn't have any type
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // WalletBalance doesn't have blockchain property
        const balancePriority = getPriority(balance.blockchain)
        // lhsPriority doesn't exist, use balancePriority instead
        if (lhsPriority > -99) {
          // not optimize code for readability
          if (balance.amount <= 0) {
            return true
          }
        }
        return false
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // WalletBalance doesn't have blockchain property
        const leftPriority = getPriority(lhs.blockchain)
        const rightPriority = getPriority(rhs.blockchain)
        // simplify code by using return leftPriority - rightPriority
        if (leftPriority > rightPriority) {
          return -1
        } else if (rightPriority > leftPriority) {
          return 1
        }
      })
  }, [balances, prices])

  // unused variable
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    }
  })

  const rows = sortedBalances.map(
    // because of not define type for sortedBalances, this code need to be defined in order to use type
    (balance: FormattedWalletBalance, index: number) => {
      // prices[balance.currency] can be undefined
      const usdValue = prices[balance.currency] * balance.amount
      return (
        <WalletRow
          // no idea what is classes
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    }
  )

  return <div {...rest}>{rows}</div>
}
