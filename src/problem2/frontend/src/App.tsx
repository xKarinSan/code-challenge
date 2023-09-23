// =================== imports ===================
// ======== react ========
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

// ======== chakraUI ========

import {
    useToast,
    Card,
    Heading,
    Text,
    IconButton,
    Tooltip,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalContent,
    Progress,
} from "@chakra-ui/react";

// ========== components ==========
import { CustomNumberInput } from "./components/CustomNumberInput";

// ========== icons ==========
import { IoSwapVerticalSharp } from "react-icons/io5";

// ======== types ========
import { CurrencyDetails, Currency } from "./types/CurrencyTypes";

// =================== main function ===================

function App() {
    // =================== constants ===================
    const toast = useToast({
        duration: 5000,
        isClosable: true,
        position: "top",
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    // =================== states ===================
    const [loading, setLoading] = useState<boolean>(false);

    const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
    const [giveCurrency, setGiveCurrency] = useState<Currency | null>(null);

    const [giveCurrencyValue, setGiveCurrencyValue] = useState<number>(0);

    const [receiveCurrency, setReceiveCurrency] = useState<Currency | null>(
        null
    );
    const [receiveCurrencyValue, setReceiveCurrencyValue] = useState<number>(0);

    // for the modal
    // check if this is for "You Pay" or "You Get"
    const [isPayingCurrency, setIsPayingCurrency] = useState<boolean>(false);

    // =================== main functions ===================
    // ======== swaps the currencies ========
    const swapCurrencies = () => {
        if (receiveCurrency && giveCurrency) {
            const temp: Currency = giveCurrency;
            setGiveCurrency(receiveCurrency);
            setReceiveCurrency(temp);

            // check amounts
            if (giveCurrency && receiveCurrency && giveCurrencyValue) {
                const { price: givePrice } = giveCurrency;
                const { price: receivePrice } = receiveCurrency;
                // conver to 5dp
                let convertedValue: number =
                    giveCurrencyValue * (receivePrice / givePrice);
                setReceiveCurrencyValue(parseFloat(convertedValue.toFixed(5)));
            }
        }
    };

    // ======== open currency modal ========
    // takes in currency state (give or receive)
    const openCurrencyModal = (currencyMode: boolean) => {
        setIsPayingCurrency(currencyMode);
        onOpen();
    };

    // ======== submit swap ========
    const submitSwap = () => {
        if (
            giveCurrency &&
            receiveCurrency &&
            parseFloat(giveCurrencyValue.toString())
        ) {
            const { price: givePrice } = giveCurrency;
            const { price: receivePrice } = receiveCurrency;
            // conver to 5dp
            let convertedValue: number =
                giveCurrencyValue * (givePrice / receivePrice);
            setReceiveCurrencyValue(parseFloat(convertedValue.toFixed(5)));
            toast({
                title: "Swap Successful",
                description: "Your swap was successful",
                status: "success",
            });
        } else {
            toast({
                title: "Swap Unsuccessful",
                description: "Your swap was unsuccessful",
                status: "error",
            });
        }
    };

    // ======== retrieve all prices ========
    const retrieveAllPrices = async () => {
        setLoading(true);
        await axios
            .get("https://interview.switcheo.com/prices.json")
            .then((res: any) => {
                const uniquePrices: { [key: string]: CurrencyDetails } = {};

                for (const price of res.data) {
                    const currencyCode = price.currency;
                    const latestPrice = price.price;
                    if (uniquePrices.hasOwnProperty(currencyCode)) {
                        // take the more updated price
                        if (uniquePrices[currencyCode].date < price.date) {
                            uniquePrices[currencyCode] = {
                                price: latestPrice,
                                date: price.date,
                            };
                        }
                    } else {
                        uniquePrices[currencyCode] = {
                            price: latestPrice,
                            date: price.date,
                        };
                    }
                }
                let currencies: Currency[] = [];

                for (const currency of Object.keys(uniquePrices)) {
                    const price = uniquePrices[currency].price;
                    const date = uniquePrices[currency].date;
                    const newCurrency: Currency = {
                        currency,
                        price,
                        date,
                    };
                    currencies.push(newCurrency);
                }
                setAllCurrencies(currencies);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    // =================== useEFfect ===================
    useEffect(() => {
        retrieveAllPrices();
    }, []);
    // =================== main component ===================
    return (
        <>
            {loading ? (
                <Card
                    margin={"10px auto"}
                    width={["90vw", "70vw", "60vw", "40vw"]}
                    padding={"15px"}
                    background={"#0E1629"}
                >
                    <Heading fontWeight="normal" color={"white"} margin="10px">
                        Loading ...
                    </Heading>
                    <Progress
                        size="sm"
                        isIndeterminate
                        colorScheme="twitter"
                        background="black"
                        margin="10px"
                        borderRadius={"50%"}
                    />
                </Card>
            ) : (
                <>
                    <Card
                        margin={"10px auto"}
                        background={"#0E1629"}
                        width={["90vw", "70vw", "60vw", "40vw"]}
                        padding={"15px"}
                    >
                        <Heading
                            as={"h4"}
                            color="white"
                            fontWeight="normal"
                            margin="5px"
                        >
                            Currency Swapper
                        </Heading>
                        <CustomNumberInput
                            isDisabled={false}
                            label={"You pay"}
                            value={giveCurrencyValue}
                            currentCurrency={giveCurrency}
                            isPayingCurrency={true}
                            valueChangeHandler={setGiveCurrencyValue}
                            openCurrencyModalFunction={openCurrencyModal}
                        />

                        <Tooltip label="Swap currencies">
                            <IconButton
                                icon={<IoSwapVerticalSharp color="white" />}
                                background={"#243F72"}
                                _hover={{ background: "#2D539B" }}
                                aria-label="swap"
                                width="fit-content"
                                margin="0 auto"
                                onClick={swapCurrencies}
                            />
                        </Tooltip>
                        <CustomNumberInput
                            isDisabled={true}
                            label={"You get"}
                            value={receiveCurrencyValue}
                            currentCurrency={receiveCurrency}
                            isPayingCurrency={false}
                            valueChangeHandler={setReceiveCurrencyValue}
                            openCurrencyModalFunction={openCurrencyModal}
                        />
                        <Button
                            borderRadius={"5px"}
                            color="white"
                            background="#2955F8"
                            _hover={{ background: "#1444FA" }}
                            onClick={submitSwap}
                        >
                            Swap
                        </Button>
                        <SelectionModal isOpen={isOpen} />
                    </Card>
                </>
            )}
        </>
    );

    // =================== sub components ===================
    function SelectionModal({ isOpen }: { isOpen: boolean }) {
        return (
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent
                    background={"#0E1629"}
                    color="white"
                    maxHeight="80vh"
                >
                    <ModalHeader>Select a currency</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody overflow="scroll">
                        {allCurrencies.map(
                            (currency: Currency, index: number) => (
                                <Card
                                    key={index}
                                    margin="5px"
                                    background={
                                        isPayingCurrency
                                            ? giveCurrency &&
                                              giveCurrency?.currency ==
                                                  currency.currency
                                                ? "#4E73FD"
                                                : "#14223D"
                                            : receiveCurrency &&
                                              receiveCurrency?.currency ==
                                                  currency.currency
                                            ? "#4E73FD"
                                            : "#14223D"
                                    }
                                    _hover={{ cursor: "pointer" }}
                                    padding="10px"
                                    onClick={() => {
                                        if (isPayingCurrency) {
                                            if (
                                                giveCurrency?.currency !=
                                                currency.currency
                                            ) {
                                                setGiveCurrency(currency);
                                                onClose();
                                            }
                                        } else {
                                            if (
                                                receiveCurrency?.currency !=
                                                currency.currency
                                            ) {
                                                setReceiveCurrency(currency);
                                                onClose();
                                            }
                                        }
                                    }}
                                >
                                    <Text
                                        color="white"
                                        margin="5px"
                                        textAlign={"left"}
                                        variant="subtitle2"
                                        fontSize="13px"
                                    >
                                        {currency.currency}
                                    </Text>
                                </Card>
                            )
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        );
    }
}

export default App;
