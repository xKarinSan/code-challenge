## Codes

``original.ts`` is where the original code from the question is
``refactored.ts `` is where the refactored code from the question is

## Assumptions

1. useWalletBalances() and usePrices() are states in other parts of code outside the scope
2. BoxProps comes from MaterialUI

## Changes

1. For formatting, the page is structured and separated for better code readability
2. Line 19: "any" is replaced with "string" for type safety
3. Lines 37, 46, 47: replaced "blockchain" with "currency" because getPriority takes in a string value (blockchain) as its parameter; therefore the types must match.
4. Line 37: Separated the sort and return methods with a variable to increase readability
5. Line 39: Simplified the return statement for improved readeability
6. Line 48: Replaced with return leftPriority>rightPriority; for code simplicity so that the leftPriority is in front.
7. Line 56: declared the type for formattedBalances as FormattedWalletBalance[], as the return JSON object matches the interface FormattedWalletBalance
8. Line 63: declared the type for rows as WalletRow[] for type safety and the a WalletRow component is returned inside the map part of "sortedBalances" in the same line
9. Line 65: declared the type for usdValue as number for type safety
