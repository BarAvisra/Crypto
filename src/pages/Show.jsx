import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Flex, Image, Text, Button, Container, Table, Thead, Tbody, Th, Td, Tr } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';
import debounce from '../hooks/Debounce'


function Show() {
    const [graphData, setGraphData] = useState([]);
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
                console.log(coinRes.data.market_data.current_price.usd);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, [timeFrameDays]);

    const buttonsStyle = {
        color: "#9C18A0",
        bg: "transparent",
        border: "1px solid #9C18A0",
        _hover: {
            bg: "#9C78A0",
        },
        padding: "10px",
        height: "30px",
    };
    const selectedButtonStyle = {
        color: "white",
        bg: "#9C18A0",
        _hover: {
            bg: "#9C78A0",
        },
        border: "1px solid #9C18A0",
        padding: "10px",
        height: "30px",
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
                                <Flex align="center" mb={6}>
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
                                    <Flex direction="column">
                                        <Text fontSize="4xl" fontWeight="bold" color="#9C68A0" mb={2}>
                                            {coinData.name} ({coinData.symbol.toUpperCase()})
                                        </Text>
                                        <Text fontSize="2xl" color="#9C68A0" mb={0}>
                                            Current price ${coinData.market_data.current_price.usd}
                                        </Text>
                                    </Flex>
                                </Flex>
                            )}

                            <Box position="relative">
                                <Flex w="39%" justify="center" position="absolute" top="-40px" left="0" right="0" gap={4} marginTop={4}>
                                    <Button sx={timeFrameDays === 1 ? selectedButtonStyle : buttonsStyle} onClick={handleTimeframeDateDay}>
                                        Day
                                    </Button>
                                    <Button sx={timeFrameDays === 7 ? selectedButtonStyle : buttonsStyle} onClick={handleTimeframeDateWeek}>
                                        Week
                                    </Button>
                                    <Button sx={timeFrameDays === 30 ? selectedButtonStyle : buttonsStyle} onClick={handleTimeframeDateMonth}>
                                        Month
                                    </Button>
                                    <Button sx={timeFrameDays === 365 ? selectedButtonStyle : buttonsStyle} onClick={handleTimeframeDateYear}>
                                        Year
                                    </Button>
                                </Flex>

                                <AreaChart
                                    width={1200}
                                    height={400}
                                    data={graphData}
                                    margin={{
                                        top: 30,
                                        right: 30,
                                        left: 30,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: '12px' }} />
                                    <YAxis tick={{ fontSize: '12px' }} />
                                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                                    <Area type="monotone" dataKey="price" stroke="#9C27B0" fill="#9C58A0" />
                                </AreaChart>
                            </Box>
                        </Flex>

                        {coinData && (
                            <Text
                                fontSize="xl"
                                color="gray"
                                textAlign="center"
                                mt={6}
                                dangerouslySetInnerHTML={{ __html: coinData.description.en }}
                            />
                        )}
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
