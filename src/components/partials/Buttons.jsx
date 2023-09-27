import { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LinkIcon, AddIcon, MinusIcon, Icon } from '@chakra-ui/icons';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

function Buttons({ coinData }) {
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        setIsInWatchlist(isCoinInWatchlist());
    }, []);

    const isCoinInWatchlist = () => {
        const watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        return watchlist.some(coin => coin.id === coinData.id);
    };

    const addToWatchlist = () => {
        let watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        watchlist.push(coinData);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        setIsInWatchlist(true);
    };

    const removeFromWatchlist = () => {
        const currentWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
        const updatedWatchlist = currentWatchlist.filter(coin => coin.id !== coinData.id);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
        setIsInWatchlist(false);
    };

    return (
        <>
            {isInWatchlist ? (
                <Button
                    w={"270px"}
                    onClick={removeFromWatchlist}
                    leftIcon={<Icon as={AiOutlineMinus} size="90px" />}
                    fontSize="xl"
                    px={8}
                    py={6}
                    borderRadius="lg"
                    bgColor="purple.400"
                    _hover={{
                        bgColor: "purple.500",
                        boxShadow: "xl"
                    }}
                    _active={{
                        bgColor: "purple.600",
                    }}
                >
                    Remove from Watchlist
                </Button>
            ) : (
                <Button
                    w={"270px"}

                    onClick={addToWatchlist}
                    leftIcon={<Icon as={AiOutlinePlus} size="lg" />}
                    fontSize="xl"
                    px={8}
                    py={6}
                    borderRadius="lg"
                    bgColor="purple.400"
                    _hover={{
                        bgColor: "purple.500",
                        boxShadow: "xl"
                    }}
                    _active={{
                        bgColor: "purple.600",
                    }}
                >
                    Add to Watchlist
                </Button>
            )}

            <Link to={coinData.links.homepage[0]} target="_blank"
            >
                <Button
                    w={"270px"}

                    leftIcon={<LinkIcon size="lg" />}
                    fontSize="xl"
                    px={8}
                    py={6}
                    borderRadius="lg"
                    bgColor="purple.400"
                    _hover={{
                        bgColor: "purple.500",
                        boxShadow: "xl"
                    }}
                    _active={{
                        bgColor: "purple.600",
                    }}
                    as={"a"}
                >
                    Crypto homepage
                </Button>
            </Link>
        </>
    )
}

export default Buttons



