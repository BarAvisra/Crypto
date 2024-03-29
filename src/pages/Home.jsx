import axios from 'axios'
import React, { useState, useCallback } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Box, Container, Table, Thead, Tbody, Tr, Th, Td, Text, Image, Flex, Center } from '@chakra-ui/react';
import btcIcon from '../../src/icons/Bitcoin.svg';
import Loader from '../../src/icons/loader.gif';
import debounce from '../hooks/Debounce'
import Nav from '../components/partials/Nav';
import missingCrypto from '../../src/icons/missingcrypto.png'
import Footer from '../components/partials/Footer';

const trendingUrl = 'https://api.coingecko.com/api/v3/search/trending'
const searchUrl = 'https://api.coingecko.com/api/v3/search?query='

function Home() {

    const [coins, setCoins] = useState([]);
    const [trending, setTrending] = useState([]);
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [prcBtc, setPrcBtc] = useState('')
    const [searchCompleted, setSearchCompleted] = useState(false);


    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        setIsSearching(newQuery.length > 2);
    };


    const debouncedSearch = debounce(handleSearch, 700);

    const handleDebouncedSearch = useCallback(debouncedSearch, []);

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
            setCoins(trendingCoins);
            setTrending(trendingCoins);
        };

        fetchTrendingCoins();

    }, []);

    useEffect(() => {
        const searchCoins = async () => {
            if (isSearching) {
                setSearchCompleted(false); // This line is added
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
                setSearchCompleted(true); // This line is added
            }
            else if (!isSearching && query.length < 3) {
                setCoins(trending.map((coin) => ({
                    ...coin
                })));
            }
        };

        searchCoins();
    }, [isSearching, query, trending]);


    return (
        <>
            <Flex direction="column" minHeight="100vh">
                <Nav handleSearch={handleDebouncedSearch} />
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
                                {!isSearching && <Th textAlign='center'>Price</Th>}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {coins.length === 0 ? (
                                <Tr>
                                    <Td colSpan={3} textAlign="center" fontSize={30}>
                                        <Center>
                                            {searchCompleted ? (
                                                <Image src={missingCrypto} w={400} alt="No coins found" />
                                            ) : (
                                                <Image src={Loader} alt="Loading..." />
                                            )}
                                        </Center>
                                    </Td>
                                </Tr>
                            ) : (
                                coins.map((coin) => (
                                    <Tr key={coin.id}>
                                        <Td w={108}>
                                            <Link to={`/${coin.id}`}><Image w={"70px"} src={coin.image}
                                                borderRadius="full"
                                                boxShadow="lg"
                                                mr={4}
                                                transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                                _hover={{
                                                    transform: "scale(1.1)",
                                                }} />
                                            </Link>
                                        </Td>
                                        <Td textAlign="center"
                                            _hover={{
                                                textDecoration: 'underline',
                                                opacity: 0.8,
                                                transition: 'opacity 0.2s ease-in'
                                            }}>
                                            <Link to={`/${coin.id}`}>{coin.name}</Link>
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
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Container>
                <Footer />
            </Flex>

        </>
    );
}

export default Home;
