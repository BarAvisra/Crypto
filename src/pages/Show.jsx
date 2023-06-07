import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Flex, Image, Text, Button } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';

function Show() {
    const [graphData, setGraphData] = useState([]);
    const [coinData, setCoinData] = useState(null);
    const [timeFrameDays, setTimeFrameDays] = useState(1);
    const params = useParams();

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

    return (
        <div>
            <Nav />
            <Flex direction="column" alignItems="center" p={8}>
                <Flex align={'flex-start'} w={'100%'} justify={'space-around'} marginTop={5}>
                    {coinData && (
                        <Flex align="center" mb={6}>
                            <Image src={coinData.image.large}
                                alt={coinData.name} w={32} h={32}
                                borderRadius="full"
                                boxShadow="lg"
                                mr={4}
                                transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                _hover={{
                                    transform: "scale(1.1)",
                                }} />
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
                        <Flex w="77%" justify="center" position="absolute" top="-40px" left="0" right="0" gap={4} marginTop={4}>
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
                            width={600}
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
                            <Area type="monotone" dataKey="price" stroke="#9C27B0" fill="#9C58A0" />  </AreaChart>
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
    );
}

export default Show;
