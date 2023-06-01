import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Flex, Image, Text, Button } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';

function Show() {
    const [graphData, setGraphData] = useState([]);
    const [coinData, setCoinData] = useState(null);
    const [timeFrameDays, setTimeFrameDays] = useState(30);
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
            } catch (error) {
                console.log(error.message);
            }
        };
        console.log(timeFrameDays);

        fetchData();
    }, [timeFrameDays]);

    const buttonsStyle = {
        color: "#9C18A0",
        bg: "transparent",
        border: "1px solid #9C18A0",
        _hover: {
            bg: "transparent",
        }
    };

    const handleTimeframeDateDay = () => {
        setTimeFrameDays(1);
        console.log(timeFrameDays);
    }

    const handleTimeframeDateWeek = () => {
        setTimeFrameDays(7);
        console.log(timeFrameDays);
    }

    const handleTimeframeDateMonth = () => {
        setTimeFrameDays(30);
        console.log(timeFrameDays);
    }

    const handleTimeframeDateYear = () => {
        setTimeFrameDays(365);
    }

    return (
        <div>
            <Nav />

            <Flex direction="column" alignItems="center" p={8}>
                <Text color="#9C18A0" size="5px" marginTop={'-25px'} marginLeft={'13.9rem'} paddingBottom={3} textDecoration="underline" fontSize={18}>Change timeframe</Text>
                <Flex w="59.5%" justifyContent={"flex-end"} gap="17px">
                    <Button sx={buttonsStyle} onClick={handleTimeframeDateDay}>
                        Day
                    </Button>
                    <Button sx={buttonsStyle} onClick={handleTimeframeDateWeek}>
                        Week
                    </Button>
                    <Button sx={buttonsStyle} onClick={handleTimeframeDateMonth}>
                        Month
                    </Button>
                    <Button sx={buttonsStyle} onClick={handleTimeframeDateYear}>
                        Year
                    </Button>
                </Flex>
                <Flex align={'flex-start'} w={'100%'} justify={'space-around'}>
                    {coinData && (
                        <Flex align="center" mb={6}>
                            <Image src={coinData.image.large} alt={coinData.name} w={32} h={32} borderRadius="full" boxShadow="lg" mr={4} transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                _hover={{
                                    transform: "scale(1.1)",
                                }} />
                            <Flex direction="column">
                                <Text fontSize="4xl" fontWeight="bold" color="#9C68A0" mb={2}>
                                    {coinData.name}
                                </Text>
                                <Text fontSize="2xl" color="#9C68A0" mb={0} >
                                    {coinData.symbol.toUpperCase()}
                                </Text>
                            </Flex>
                        </Flex>
                    )}

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
                        <Area type="monotone" dataKey="price" stroke="#9C27B0" fill="#9C58A0" />
                    </AreaChart>
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
