import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Legend } from 'recharts';
import { Box, Flex, Image, Text, Button, Container, Table, Thead, Tbody, Th, Td, Tr, Heading, Stack } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';
import debounce from '../hooks/Debounce'
import { LinkIcon, AddIcon } from '@chakra-ui/icons';


function Show() {
    const [graphData, setGraphData] = useState([]);
    const [graphMarkCapData, SetgraphMarkCapData] = useState([]);
    const [coinData, setCoinData] = useState(null);
    const [timeFrameDays, setTimeFrameDays] = useState(1);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [coins, setCoins] = useState([]);

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
        <div>
            <Nav handleSearch={handleDebouncedSearch} />
            {isSearching == false ? (
                <div>
                    <Flex isSearching direction="column" alignItems="center" p={8}>
                        <Flex align="flex-start" w="100%" justify="space-around" marginTop={5}>
                            {coinData && (
                                <Flex align="center" flexDirection={"column"} mb={6}>

                                    <Flex direction="column" spacing={4}>
                                        <Flex flexDirection="row" mb={5}>
                                            <Image
                                                src={coinData.image.large}
                                                alt={coinData.name}
                                                w={32}
                                                h={32}
                                                borderRadius="full"
                                                boxShadow="lg"
                                                mr={4}
                                                transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                                _hover={{
                                                    transform: "scale(1.1)",
                                                }}
                                            />
                                            <Flex flexDirection="column">
                                                <Text fontSize="4xl" fontWeight="bold" color="#9C68A0">
                                                    {coinData.name} ({coinData.symbol.toUpperCase()})
                                                </Text>

                                                <Text fontSize="2xl" color="#9C68A0">
                                                    Current price: ${coinData.market_data.current_price.usd.toLocaleString()}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                        <Flex direction="row" wrap="wrap" spacing={4} p={4} borderRadius="md" boxShadow="lg" bgColor="white" justify="space-between">
                                            <Box w="48%">
                                                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                                                    Market Cap Rank
                                                </Text>
                                                <Text fontSize="xl" color="#9C68A0">
                                                    #{coinData.market_data.market_cap_rank}
                                                </Text>
                                            </Box>
                                            <Box w="48%">
                                                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                                                    Market Cap
                                                </Text>
                                                <Text fontSize="xl" color="#9C68A0">
                                                    ${coinData.market_data.market_cap.usd.toLocaleString()}
                                                </Text>
                                            </Box>
                                            <Box w="48%">
                                                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                                                    24h High
                                                </Text>
                                                <Text fontSize="xl" color="#9C68A0">
                                                    ${coinData.market_data.high_24h.usd.toLocaleString()}
                                                </Text>
                                            </Box>
                                            <Box w="48%">
                                                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                                                    24h Low
                                                </Text>
                                                <Text fontSize="xl" color="#9C68A0">
                                                    ${coinData.market_data.low_24h.usd.toLocaleString()}
                                                </Text>
                                            </Box>
                                            <Box w="100%">
                                                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                                                    24h Volume
                                                </Text>
                                                <Text fontSize="xl" color="#9C68A0">
                                                    ${coinData.market_data.total_volume.usd.toLocaleString()}
                                                </Text>
                                            </Box>
                                        </Flex>
                                    </Flex>
                                    <Stack spacing={6} direction="row" mt={5} justifyContent="center">
                                        <Button
                                            onClick={() => addToWatchlist(coinData)}

                                            leftIcon={<AddIcon size="lg" />}
                                            fontSize="xl"
                                            px={8}
                                            py={6}
                                            borderRadius="xl"
                                            bgGradient="linear(to-r, purple.500, purple.200)"
                                            _hover={{
                                                bgGradient: "linear(to-r, purple.600, purple.300)",
                                                boxShadow: "xl"
                                            }}
                                            _active={{
                                                bgGradient: "linear(to-r, purple.700, purple.400)",
                                            }}
                                        >
                                            Add to Watchlist
                                        </Button>


                                        <Link to={coinData.links.homepage[0]} target="_blank"
                                        >
                                            <Button
                                                leftIcon={<LinkIcon size="lg" />}
                                                fontSize="xl"
                                                px={8}
                                                py={6}
                                                borderRadius="xl"
                                                bgGradient="linear(to-r, purple.200, purple.500)"
                                                _hover={{
                                                    bgGradient: "linear(to-r, purple.300, purple.600)",
                                                    boxShadow: "xl"
                                                }}
                                                _active={{
                                                    bgGradient: "linear(to-r, purple.400, purple.700)",
                                                }}
                                                as={"a"}
                                            >
                                                Crypto homepage
                                            </Button>
                                        </Link>

                                    </Stack>
                                    <Flex>
                                        {coinData && (
                                            <Flex flexDirection={"column"}
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
                                                <Heading
                                                    as="h3"
                                                    mb={4}
                                                    fontSize="xl"
                                                    textAlign="center"
                                                    color="gray.800"
                                                >
                                                    About {coinData.name}
                                                </Heading>

                                                <Box
                                                    fontSize={coinData.description.en.length > 250 ? "md" : "lg"}
                                                    maxH={"380px"}
                                                    sx={{
                                                        // For Webkit browsers
                                                        '&::-webkit-scrollbar': {
                                                            width: '3px',
                                                            backgroundColor: 'transparent',
                                                        },
                                                        '&::-webkit-scrollbar-thumb': {
                                                            backgroundColor: 'gray.600',
                                                            borderRadius: '5px',
                                                            transition: 'background-color 0.3s'
                                                        },
                                                        '&::-webkit-scrollbar-thumb:hover': {
                                                            backgroundColor: '#555'
                                                        },
                                                        // For Firefox
                                                        scrollbarColor: '#000 #F5F5F5',
                                                        scrollbarWidth: '1px',
                                                    }}
                                                    overflow={"auto"}
                                                    color="gray.600"
                                                    textAlign="center"
                                                    lineHeight="1.6"
                                                    dangerouslySetInnerHTML={{ __html: coinData.description.en }}>

                                                </Box>
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
                                        marginTop={4}
                                    >
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
                                    <Flex flexDirection={"column"}>
                                        <Text fontSize="30px" fontWeight="semibold" color="#9C68A0" mb={1} ml={"10%"} mt={"10px"}>
                                            Price Chart
                                        </Text>
                                        <AreaChart
                                            width={900}
                                            height={400}
                                            data={graphData}
                                            margin={{
                                                top: 30,
                                                right: 30,
                                                left: 30,
                                                bottom: 0,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#9C68A0" stopOpacity={0.7} />
                                                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.2} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date" tick={{ fontSize: '12px' }} />
                                            <YAxis tick={{ fontSize: '12px' }} />
                                            <Tooltip contentStyle={{ fontSize: '14px' }} />
                                            <Area type="monotone"
                                                dataKey="price"
                                                stroke="#9C27B0"
                                                fill="url(#colorUv)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                        <Text fontSize="30px" fontWeight="semibold" color="#9C68A0" mb={1} ml={"10%"} mt={"10px"}>
                                            Market Cap Chart
                                        </Text>
                                        <ResponsiveContainer width={900} height={400}>
                                            <BarChart
                                                data={graphMarkCapData}
                                                margin={{
                                                    top: 40,
                                                    right: 28,
                                                    left: 30,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" tick={{ fontSize: '12px' }} />
                                                <YAxis tickFormatter={(value) => abbreviateNumber(value)} tick={{ fontSize: '12px' }} />
                                                <Tooltip formatter={(value) => formatCurrency(value)} volume={{ fontSize: '14px' }} />
                                                <Legend />
                                                <Bar dataKey="marketCap" name="Market Cap" fill="#8884d8" />
                                                <Bar dataKey="volume" name="Volume" fill="#82ca9d" />
                                            </BarChart>
                                        </ResponsiveContainer>

                                    </Flex>
                                </Flex>
                            </Box>
                        </Flex>
                    </Flex>
                </div>
            ) : (
                <div>
                    <Container maxWidth="container.lg" py={8}>
                        <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={4} as="span"
                            _hover={{ textDecoration: 'underline' }}>
                            {isSearching ? 'Results' : 'Trending'}
                        </Text>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th textAlign="center">Coin</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {coins.map((coin) => (
                                    <Tr key={coin.id}>
                                        <Td w={108}>
                                            <Link to={`/${coin.id}`}><Image boxSize='60px' src={coin.image}
                                                borderRadius="full"
                                                boxShadow="lg"
                                                mr={4}
                                                transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                                _hover={{
                                                    transform: "scale(1.1)",
                                                }} /></Link>
                                        </Td>
                                        <Td textAlign="center"
                                            _hover={{
                                                textDecoration: 'underline',
                                                opacity: 0.8,
                                                transition: 'opacity 0.2s ease-in'
                                            }}>
                                            <button onClick={handleRefreshPage} style={{ border: "none", background: "none", cursor: "pointer" }}>
                                                <Link to={`/${coin.id}`}>{coin.name}</Link>
                                            </button>
                                        </Td>
                                        {!isSearching && coin.priceBtc && (
                                            <Td>
                                                <Flex alignItems="center" direction="column">
                                                    <Text>USD {(coin.priceBtc * prcBtc).toFixed(6)}</Text>
                                                </Flex>
                                                <Flex alignItems="right" direction="row" justifyContent="center">
                                                    <Image boxSize="20px" src={btcIcon} mr={1} />

                                                    {coin.priceBtc.toFixed(7)}
                                                </Flex>
                                            </Td>
                                        )}
                                    </Tr>
                                )
                                )}
                            </Tbody>
                        </Table>
                    </Container>
                </div>
            )}
        </div>
    );
}

export default Show;
