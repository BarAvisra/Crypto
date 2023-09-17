import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Flex, Image, Text, Button, Container, Table, Thead, Tbody, Th, Td, Tr, Heading, Stack, useBreakpointValue } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';
import debounce from '../hooks/Debounce'
import CoinStats from '../components/partials//CoinStats';
import Buttons from '../components/partials//Buttons';
import AboutCoin from '../components/partials/AboutCoin';
import CandleChart from '../components/partials/CandleChart';
import PriceChart from '../components/partials/PriceChart';
import SearchTable from '../components/partials/SearchTable';



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
    const flexDir = useBreakpointValue({ base: "row", sm: "column" });
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

    const addToWatchlist = (coin) => {
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        if (!currentWatchlist.some((item) => item.id === coin.id)) {
            const updatedWatchlist = [...currentWatchlist, coin];

            localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        }
    };

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
        bg: "#9C27B0",
        color: 'white',
        _hover: {
            bg: "#9C27B0",
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


    return (
        <>
            <Nav handleSearch={handleDebouncedSearch} />
            <Flex flexDirection={"column"} alignItems={"center"}>
                {isSearching == false ? (
                    <Flex justify="center" marginTop={5}>
                        {coinData && (
                            <Flex align="center" flexDirection={flexDir} mb={6} >
                                <Flex direction="column" spacing={4}>
                                    <Flex flexDirection="row" mb={5}>
                                        <Image
                                            src={coinData.image.large}
                                            alt={coinData.name}
                                            w={imageSize}
                                            h={imageSize}
                                            borderRadius="full"
                                            boxShadow="lg"
                                            mr={4}
                                            transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                            _hover={{
                                                transform: "scale(1.1)",
                                            }}
                                        />
                                        <Flex flexDirection={flexDir}>
                                            <Text fontSize="4xl" fontWeight="bold" color="#9C68A0">
                                                {coinData.name} ({coinData.symbol.toUpperCase()})
                                            </Text>

                                            <Text fontSize="2xl" color="#9C68A0">
                                                Current price: ${coinData.market_data.current_price.usd.toLocaleString()}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Flex direction="row" wrap="wrap" spacing={4} p={4} borderRadius="md" boxShadow="lg" bgColor="white" justify="space-between">
                                        <CoinStats coinData={coinData} />
                                    </Flex>
                                </Flex>
                                <Stack spacing={6} direction="row" mt={5} justifyContent={justifyContent}>
                                    <Buttons coinData={coinData} addToWatchlist={addToWatchlist} />
                                </Stack>
                                <Flex>
                                    {coinData && (
                                        <Flex flexDirection={flexDir}
                                            w={"100%"}
                                            mt={8}
                                            py={5}
                                            px={8}
                                            borderRadius="md"
                                            bgColor="white"
                                            boxShadow="0 4px 12px rgba(0,0,0,0.05)"
                                            maxW="800px"
                                            border="1px solid #E2E8F0"
                                        >
                                            <AboutCoin coinData={coinData} />
                                        </Flex>
                                    )}
                                </Flex>
                            </Flex>
                        )}

                        <Box position="relative">
                            <Flex>
                                <Flex
                                    justify="center"
                                    position="absolute"
                                    top="-40px"
                                    left="0"
                                    right="0"
                                    gap={4}
                                    marginTop={"50px"}>
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
                                </Flex>
                                <Flex flexDirection={flexDir}>
                                    <Text fontSize="30px" fontWeight="semibold" color="#9C68A0" mb={1} ml={"10%"} mt={"10px"}>
                                        Price Chart
                                    </Text>
                                    <PriceChart graphData={graphData} />
                                    <Text fontSize="30px" fontWeight="semibold" color="#9C68A0" mb={1} ml={"10%"} mt={"10px"}>
                                        Market Cap Chart
                                    </Text>
                                    <CandleChart graphMarkCapData={graphMarkCapData} abbreviateNumber={abbreviateNumber} formatCurrency={formatCurrency} />
                                </Flex>
                            </Flex>
                        </Box>
                    </Flex>
                ) : (
                    <div>
                        <Container maxWidth="container.lg" py={8} display={isTableLayout}>
                            <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={4} as="span"
                                _hover={{ textDecoration: 'underline' }}>
                                Results
                            </Text>
                            <SearchTable coins={coins} handleRefreshPage={handleRefreshPage} />
                        </Container>
                    </div>
                )}
            </Flex>
        </>
    );

}

export default Show;
