// ========================interfaces========================
interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {}

// ========================main page========================
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;

    // =========================================================
    const balances = useWalletBalances();
    const prices = usePrices();

    // takes in currency and returns a priority number
    const getPriority = (blockchain: string): number => {
        // priority is descending
        switch (blockchain) {
            case "Osmosis":
                return 100;
            case "Ethereum":
                return 50;
            case "Arbitrum":
                return 30;
            case "Zilliqa":
                return 20;
            case "Neo":
                return 20;
            default:
                return -99;
        }
    };

    // takes anything that is more than 0 and are in piority?
    const sortedBalances = useMemo(() => {
        const filteredBalance: WalletBalance[] = balances.filter(
            (balance: WalletBalance) => {
                // filter out existing  currencies that have the positive balance
                const balancePriority = getPriority(balance.currency);
                return balancePriority > -99 && balance.amount >= 0;
            }
        );
        return filteredBalance.sort(
            (lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.currency);
                const rightPriority = getPriority(rhs.currency);
                return leftPriority - rightPriority;
            }
        );
    }, [balances, prices]);

    // this adds the formatted property to the sortedBalances
    const formattedBalances: FormattedWalletBalance[] = sortedBalances.map(
        (balance: WalletBalance) => {
            // toFixed returns string
            return {
                ...balance,
                formatted: balance.amount.toFixed(),
            };
        }
    );

    const rows: WalletRow[] = formattedBalances.map(
        (balance: FormattedWalletBalance, index: number) => {
            const usdValue: number = prices[balance.currency] * balance.amount;
            return (
                <WalletRow
                    className={classes.row}
                    key={index}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            );
        }
    );

    return <div {...rest}>{rows}</div>;
};
