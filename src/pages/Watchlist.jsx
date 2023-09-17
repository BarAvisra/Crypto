import React, { useEffect, useState } from 'react';
import {
    Table, Thead, Tbody, Tr, Th, Td, Text, Image, Container, Button, Flex,
    useBreakpointValue
} from '@chakra-ui/react';
import Nav from '../components/partials/Nav';
import { Link } from 'react-router-dom';
import { CloseIcon } from '@chakra-ui/icons';

function Watchlist() {

    const [watchlist, setWatchlist] = useState([]);

    const isTableLayout = useBreakpointValue({ base: false, md: true });
    const containerWidth = useBreakpointValue({ base: "100%", md: "90%" });
    const textSize = useBreakpointValue({ base: "xl", md: "2xl" });

    const updateWatchlistFromLocalStorage = () => {
        const storedWatchlist = localStorage.getItem('watchlist');
        if (storedWatchlist) {
            setWatchlist(JSON.parse(storedWatchlist));
        }
    }

    const removeCoin = (id) => {
        const storedCoins = localStorage.getItem('watchlist');
        if (storedCoins) {
            const coinArray = JSON.parse(storedCoins);
            const updatedCoinArray = coinArray.filter(coin => coin.id !== id);
            localStorage.setItem('watchlist', JSON.stringify(updatedCoinArray));

            updateWatchlistFromLocalStorage();
        }
    }

    useEffect(() => {
        updateWatchlistFromLocalStorage();

        window.addEventListener('storage', updateWatchlistFromLocalStorage);

        return () => {
            window.removeEventListener('storage', updateWatchlistFromLocalStorage);
        };
    }, []);

    return (
        <div>
            <Nav />
            <Container maxWidth={containerWidth} py={8}>
                <Text fontSize={textSize} fontWeight="bold" color="purple.500" mb={4}>
                    Watchlist
                </Text>

                {isTableLayout ? (
                    <Table variant="striped">
                        <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Coin</Th>
                                <Th>Current Price</Th>
                                <Th>Market Cap Rank</Th>
                                <Th>Market Cap</Th>
                                <Th>24h High</Th>
                                <Th>24h Low</Th>
                                <Th>24h Volume</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {watchlist.length === 0 ? (
                                <Tr>
                                    <Td colSpan={8} textAlign="center" fontSize={textSize}>
                                        NO COINS WERE ADDED TO HERE YET..
                                    </Td>
                                </Tr>
                            ) : (
                                watchlist.map((coin) => (
                                    <Tr key={coin.id}>
                                        <Td>
                                            <Image
                                                w={"70px"} src={coin.image.large}
                                                borderRadius="full"
                                                boxShadow="lg"
                                                mr={4}
                                                transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                                _hover={{
                                                    transform: "scale(1.1)",
                                                }}
                                            />
                                        </Td>
                                        <Td>
                                            <Link to={`/${coin.id}`}>
                                                {coin.name} ({coin.symbol.toUpperCase()})
                                            </Link>
                                        </Td>
                                        <Td>${coin.market_data.current_price.usd.toLocaleString()}</Td>
                                        <Td>#{coin.market_data.market_cap_rank}</Td>
                                        <Td>${coin.market_data.market_cap.usd.toLocaleString()}</Td>
                                        <Td>${coin.market_data.high_24h.usd.toLocaleString()}</Td>
                                        <Td>${coin.market_data.low_24h.usd.toLocaleString()}</Td>
                                        <Td>${coin.market_data.total_volume.usd.toLocaleString()}</Td>
                                        <Td>
                                            <Button
                                                bg="transparent"
                                                _hover={{ bg: "transparent" }}
                                                onClick={() => removeCoin(coin.id)}
                                            >
                                                <CloseIcon />
                                            </Button>
                                        </Td>
                                    </Tr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                ) : (
                    <Flex direction="column" w="100%" overflowX="auto">
                        {watchlist.length === 0 ? (
                            <Text textAlign="center" fontSize={textSize} my={4}>
                                NO COINS WERE ADDED TO HERE YET..
                            </Text>
                        ) : (
                            watchlist.map((coin) => (
                                <Flex
                                    my={2}
                                    p={2}
                                    bg="gray.50"
                                    borderRadius="md"
                                    alignItems="center"
                                    justifyContent="space-between"
                                >
                                    <Flex alignItems="center" spacing={3}>
                                        <Image
                                            boxSize='40px'
                                            src={coin.image.large}
                                            borderRadius="full"
                                            boxShadow="lg"
                                            alt={coin.name}
                                            mr={2}
                                        />
                                        <Link key={coin.id} to={`/${coin.id}`} w="100%">
                                            <Text fontSize={textSize}>
                                                {coin.name} ({coin.symbol.toUpperCase()})
                                            </Text>
                                        </Link>

                                    </Flex>
                                    <Text>
                                        ${coin.market_data.current_price.usd.toLocaleString()}
                                    </Text>
                                    <Button
                                        bg="transparent"
                                        _hover={{ bg: "transparent" }}
                                        onClick={() => removeCoin(coin.id)}
                                    >
                                        <CloseIcon />
                                    </Button>
                                </Flex>
                            ))
                        )}
                    </Flex>
                )}
            </Container>
        </div>
    );

}

export default Watchlist;
