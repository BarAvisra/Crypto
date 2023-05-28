import axios from 'axios'
import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Table, Thead, Tbody, Tr, Th, Td, Text, Image, Flex, } from '@chakra-ui/react';
import btcIcon from '../../src/icons/Bitcoin.svg';
import debounce from '../hooks/Debounce'
import Nav from '../components/partials/Nav';

const trendingUrl = 'https://api.coingecko.com/api/v3/search/trending'
const searchUrl = 'https://api.coingecko.com/api/v3/search?query='

function Home() {

    const [coins, setCoins] = useState([]);
    const [trending, setTrending] = useState([]);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [prcBtc, setPrcBtc] = useState('')

    const handleSearch = (e) => {
        setQuery(e.target.value);
    };

    const debouncedSearch = debounce(handleSearch, 700);

    const handleDebouncedSearch = useCallback(debouncedSearch, []);

    useEffect(() => {
        setIsSearching(query.length > 2);
    }, [query]);

    useEffect(() => {

        const fetchTrendingCoins = async () => {
            const [res, btcRes] = await Promise.all([
                axios.get(trendingUrl),
                axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`)
            ])

            const btcPrice = btcRes.data.bitcoin.usd
            setPrcBtc(btcPrice);

            const trendingCoins = res.data.coins.map((coin) => {
                return {
                    name: coin.item.name,
                    image: coin.item.large,
                    id: coin.item.id,
                    priceBtc: coin.item.price_btc,
                };
            });
            console.log(trendingCoins);
            setCoins(trendingCoins);
            setTrending(trendingCoins);
        };

        fetchTrendingCoins();

    }, []);

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
            else {
                setCoins(trending.map((coin) => ({
                    ...coin,
                    priceBtc: coin.priceBtc || 0
                })));
            }
        };

        searchCoins();

    }, [isSearching, query, trending]);

    return (
        <>
            <Box backgroundColor="#f9f9f9" minHeight="100vh">
                <Nav onSearchChange={handleDebouncedSearch} />
                <Container maxWidth="container.lg" py={8}>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.500" mb={4} as="span"
                        _hover={{ textDecoration: 'underline' }}>
                        {isSearching ? 'Results' : 'Trending'}
                    </Text>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Coin</Th>
                                {!isSearching && <Th textAlign='center'>Price</Th>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {coins.length === 0 ? (
                                <Tr>
                                    <Td colSpan={3} textAlign="center" fontSize={30}>
                                        NO COINS FOUND
                                    </Td>
                                </Tr>
                            ) : (
                                coins.map((coin) => (
                                    <Tr key={coin.id}>
                                        <Td><Image boxSize='60px' src={coin.image} /></Td>
                                        <Td _hover={{ textDecoration: 'underline' }}>
                                            <Link to={`/${coin.id}`}>{coin.name}</Link>
                                        </Td>
                                        {!isSearching && coin.priceBtc && (
                                            <Td>
                                                <Flex alignItems="center" direction="column">
                                                    <Text>${coin.priceBtc.toFixed(7) * prcBtc}</Text>
                                                    {/* {coin.priceBtc.toFixed(7)} */}
                                                    {/* <Image boxSize="20px" src={btcIcon} mr={1} /> */}
                                                </Flex>
                                            </Td>
                                        )}
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Container>
            </Box>
        </>
    );
}

export default Home;
