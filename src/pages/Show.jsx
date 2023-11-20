import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Image, Text, Button, Container, Stack, useBreakpointValue, ButtonGroup, Grid, GridItem } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';
import debounce from '../hooks/Debounce'
import CoinStats from '../components/partials//CoinStats';
import Buttons from '../components/partials//Buttons';
import AboutCoin from '../components/partials/AboutCoin';
import CandleChart from '../components/partials/CandleChart';
import PriceChart from '../components/partials/PriceChart';
import SearchTable from '../components/partials/SearchTable';
import { ResponsiveContainer } from 'recharts';


function Show() {
    const [graphData, setGraphData] = useState([]);
    const [graphMarkCapData, SetgraphMarkCapData] = useState([]);
    const [coinData, setCoinData] = useState(null);
    const [timeFrameDays, setTimeFrameDays] = useState(1);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [coins, setCoins] = useState([]);

    const isTableLayout = useBreakpointValue({ base: false, md: true });
    const containerWidth = useBreakpointValue({ base: "90%", sm: "80%", md: "70%", lg: "70%" });
    const imageSize = useBreakpointValue({ base: "40px", sm: "50px", md: "60px", lg: "120px" });
    const flexDir = useBreakpointValue({ base: "row", md: "column" });
    const justifyContent = useBreakpointValue({ base: "flex-start", md: "center" });
    const alignItems = useBreakpointValue({ base: "flex-start", md: "center" });
    const flexDirCoinInfo = useBreakpointValue({ base: "column", sm: "row" });
    const justifyContentCoinInfo = useBreakpointValue({ base: "center", sm: "space-between" });


    const params = useParams();

    const searchUrl = 'https://api.coingecko.com/api/v3/search?query='

    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setIsSearching(newQuery.length > 2);
    };

    const debouncedSearch = debounce(handleSearch, 700);

    const handleDebouncedSearch = useCallback(debouncedSearch, []);


    useEffect(() => {

        const searchCoins = async () => {
            if (isSearching) {
                const res = await axios.get(`${searchUrl}${query}`);
                const coinsResults = res.data.coins.map((coin) => {
                    return {
                        name: coin.name,
                        image: coin.large,
                        id: coin.id,
                        priceBtc: coin.price_btc
                    };
                });
                setCoins(coinsResults);
            }
        };

        searchCoins();

    }, [isSearching, query, coinData]);

    function abbreviateNumber(value) {
        if (Math.abs(value) >= 1.0e+9) {
            return (value / 1.0e+9).toFixed(2) + "B";
        }
        else if (Math.abs(value) >= 1.0e+6) {
            return (value / 1.0e+6).toFixed(2) + "M";
        }
        else if (Math.abs(value) >= 1.0e+3) {
            return (value / 1.0e+3).toFixed(2) + "K";
        }
        else {
            return value.toFixed(2);
        }
    }


    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    }

    useEffect(() => {
        axios.get(`https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=usd&days=${timeFrameDays}`)
            .then(response => {
                const dataFromAPI = response.data;
                const transformedData = dataFromAPI.prices.map((item, index) => {
                    return {
                        date: new Date(item[0]).toLocaleDateString(),
                        price: item[1],
                        marketCap: dataFromAPI.market_caps[index][1], // keep as numeric
                        volume: dataFromAPI.total_volumes[index][1]   // keep as numeric
                    };
                });



                SetgraphMarkCapData(transformedData);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

    }, [timeFrameDays])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [graphRes1, coinRes] = await Promise.all([
                    axios.get(`https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=usd&days=${timeFrameDays}`),
                    axios.get(`https://api.coingecko.com/api/v3/coins/${params.id}?localization=false&market_data=true`)
                ]);

                const data = graphRes1.data.prices.map(price => {
                    const [timestamp, p] = price;
                    const date = new Date(timestamp).toLocaleDateString('en-GB');
                    return {
                        date: date,
                        price: p.toFixed(6),
                    };
                });
                setGraphData(data);
                setCoinData(coinRes.data);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, [timeFrameDays]);

    const buttonsStyle = {
        bg: 'gray.600',
        color: 'white',
        borderRadius: '25px',
        border: '2px solid transparent',
        _hover: {
            bg: 'gray.700',
            boxShadow: 'lg',
        },
        _active: {
            bg: 'gray.800',
            boxShadow: 'inner',
            transform: 'scale(0.97)',
        },

    };

    const selectedButtonStyle = {
        ...buttonsStyle,
        bg: "purple.500",
        color: 'white',
        _hover: {
            bg: "purple.600",
        },
        _active: {
            bg: "#9C27B0",
            transform: 'scale(0.97)',
        },
    };


    const handleTimeframeDateDay = () => {
        setTimeFrameDays(1);
    }

    const handleTimeframeDateWeek = () => {
        setTimeFrameDays(7);
    }

    const handleTimeframeDateMonth = () => {
        setTimeFrameDays(30);
    }

    const handleTimeframeDateYear = () => {
        setTimeFrameDays(365);
    }

    const handleRefreshPage = () => {
        window.location.reload();
    };

    const primaryTextColor = "purple.500";
    console.log("Current flex direction: ", flexDir);


    return (
        <>
            <Nav handleSearch={handleDebouncedSearch} />
            {isSearching === false ? (
                <Flex justify={"center"} m={[2, 4, 5]} direction={["column", "row"]} wrap={["wrap", "nowrap"]}>
                    {coinData && (
                        <Flex direction="column" spacing={4} mb={[4, 0]} maxWidth={["100%", "initial"]} >
                            <Flex flexDirection={["column", "row"]} mb={5} alignItems="center">
                                <Image
                                    src={coinData.image.large}
                                    alt={coinData.name}
                                    w={["30%", "auto"]}
                                    h={[imageSize / 2, imageSize]}
                                    borderRadius="full"
                                    boxShadow="lg"
                                    mb={[4, 0]}
                                    mr={[0, 4]}
                                    transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    _hover={{ transform: "scale(1.1)" }}
                                />
                                <Flex flexDirection="column" alignItems={["center", "flex-start"]} textAlign={["center", "left"]}>
                                    <Text fontSize={["3xl", "2xl", "3xl"]} fontWeight="bold" color={primaryTextColor}>
                                        {coinData.name} ({coinData.symbol.toUpperCase()})
                                    </Text>
                                    <Text fontSize={["xl", "xl", "2xl"]} color={primaryTextColor}>
                                        Current price: ${coinData.market_data.current_price.usd.toLocaleString()}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex
                                ml={["15%", "0%", "0%", "0%"]} // Margin left: 15% on mobile, 0% on larger screens
                                wrap="wrap"
                                justify="space-between"
                            >
                                <CoinStats coinData={coinData} />
                            </Flex>

                            <Stack spacing={7} direction={["column", "row"]} mt={5} justifyContent="space-between" alignItems="center">
                                <Buttons coinData={coinData} />
                            </Stack>
                            <Flex direction="column" mt={8} py={5} px={8} borderRadius="md" boxShadow="0 4px 12px rgba(0,0,0,0.05)">
                                <AboutCoin coinData={coinData} />
                            </Flex>
                        </Flex>
                    )}

                    <Flex direction="column" alignItems="center" mt={[5, 0]}>
                        <ButtonGroup spacing={4}>
                            <Button
                                sx={timeFrameDays === 1 ? selectedButtonStyle : buttonsStyle}
                                onClick={handleTimeframeDateDay}
                            >
                                Day
                            </Button>
                            <Button
                                sx={timeFrameDays === 7 ? selectedButtonStyle : buttonsStyle}
                                onClick={handleTimeframeDateWeek}
                            >
                                Week
                            </Button>
                            <Button
                                sx={timeFrameDays === 30 ? selectedButtonStyle : buttonsStyle}
                                onClick={handleTimeframeDateMonth}
                            >
                                Month
                            </Button>
                            <Button
                                sx={timeFrameDays === 365 ? selectedButtonStyle : buttonsStyle}
                                onClick={handleTimeframeDateYear}
                            >
                                Year
                            </Button>
                        </ButtonGroup>

                        <Text fontSize={["2xl", "3xl"]} fontWeight="semibold" color={primaryTextColor} mb={1} textAlign="center">
                            Price chart
                        </Text>

                        <PriceChart graphData={graphData} />


                        <Text fontSize={["2xl", "3xl"]} fontWeight="semibold" color={primaryTextColor} mb={1} textAlign="center">
                            Market cap chart
                        </Text>
                        <CandleChart graphMarkCapData={graphMarkCapData} abbreviateNumber={abbreviateNumber} formatCurrency={formatCurrency} />

                    </Flex>
                </Flex>
            ) : (
                <div>
                    <Container maxWidth="container.lg" py={8} >
                        <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={4} as="span">
                            Results
                        </Text>
                        <SearchTable coins={coins} handleRefreshPage={handleRefreshPage} />
                    </Container>
                </div>
            )}
        </>
    );

};


export default Show;