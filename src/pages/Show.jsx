import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Nav from '../components/partials/Nav';

function Show() {
    const [graphData, setGraphData] = useState([]);
    const [coinData, setCoinData] = useState(null);
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [graphRes, coinRes] = await Promise.all([
                    axios.get(`https://api.coingecko.com/api/v3/coins/${params.id}/market_chart?vs_currency=usd&days=7`),
                    axios.get(`https://api.coingecko.com/api/v3/coins/${params.id}?localization=false&market_data=true`)
                ]);

                const data = graphRes.data.prices.map(price => {
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
    }, []);

    return (
        <div>
            <Nav />
            <Flex direction="column" alignItems="center" p={8}>
                <Flex align={'flex-start'} w={'100%'} justify={'space-around'}>
                    {coinData && (
                        <Flex align="center" mb={6}>
                            <Image src={coinData.image.large} alt={coinData.name} w={32} h={32} borderRadius="full" boxShadow="lg" mr={4} />
                            <Flex direction="column">
                                <Text fontSize="4xl" fontWeight="bold" color="#9C68A0" mb={2}>
                                    {coinData.name}
                                </Text>
                                <Text fontSize="2xl" color="#9C68A0" mb={0}>
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
