import React from 'react'
import { Box, Flex, Image, Text, Button, Container, Table, Thead, Tbody, Th, Td, Tr, Heading, Stack, useBreakpointValue } from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';

function SearchTable({ coins, handleRefreshPage }) {

    const imageSize = useBreakpointValue({ base: "40px", sm: "50px", md: "60px", lg: "60px" });


    return (
        <>
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
                                <Link to={`/${coin.id}`}><Image
                                    boxSize={imageSize}
                                    src={coin.image}
                                    borderRadius="full"
                                    boxShadow="lg"
                                    mr={4}
                                    transition="transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                                    _hover={{
                                        transform: "scale(1.1)",
                                    }}
                                />
                                </Link>
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
                        </Tr>
                    )
                    )}
                </Tbody>
            </Table>
        </>
    )
}

export default SearchTable