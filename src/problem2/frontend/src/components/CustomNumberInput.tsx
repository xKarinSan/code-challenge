import {
    Box,
    Button,
    NumberInput,
    NumberInputField,
    Tooltip,
    Card,
    Text,
} from "@chakra-ui/react";
import { IoArrowDown } from "react-icons/io5";

import { Currency } from "../types/CurrencyTypes";

export function CustomNumberInput({
    isDisabled,
    label,
    value,
    currentCurrency,
    isPayingCurrency,
    valueChangeHandler,
    openCurrencyModalFunction,
}: {
    isDisabled: boolean;
    label: string;
    value: number;
    currentCurrency: Currency | null;
    isPayingCurrency: boolean;
    valueChangeHandler: (value: number) => void;
    openCurrencyModalFunction: (value: boolean) => void;
}) {
    return (
        <Card
            width="100%"
            margin="5px auto"
            background="#14223D"
            padding="10px"
        >
            <Text
                color="white"
                margin="5px"
                textAlign={"left"}
                variant="subtitle2"
                fontSize="13px"
            >
                {label}
            </Text>
            <Box display="flex">
                <NumberInput
                    focusBorderColor="none"
                    min={0}
                    defaultValue={0}
                    step={0.01}
                    precision={5}
                    value={isPayingCurrency ? undefined : value}
                    color="white"
                >
                    <NumberInputField
                        inputMode="decimal"
                        border="none"
                        padding="5px"
                        fontSize="35px"
                        value={isPayingCurrency ? value : undefined}
                        onChange={(e) =>
                            valueChangeHandler(parseFloat(e.target.value))
                        }
                        disabled={isDisabled}
                        _disabled={{ color: "white" }}
                    />
                </NumberInput>
                <Tooltip label="Select a currency">
                    <Button
                        rightIcon={<IoArrowDown />}
                        onClick={() =>
                            openCurrencyModalFunction(isPayingCurrency)
                        }
                        borderRadius={"25px"}
                        background={"#4E73FD"}
                        color="white"
                        _hover={{ background: "#2852EC" }}
                    >
                        {currentCurrency
                            ? currentCurrency.currency
                            : "Currency"}
                    </Button>
                </Tooltip>
            </Box>
        </Card>
    );
}
