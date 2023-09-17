import React from 'react'
import { Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LinkIcon, AddIcon } from '@chakra-ui/icons';


function Buttons({ coinData, addToWatchlist }) {
    return (
        <>
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
        </>
    )
}

export default Buttons