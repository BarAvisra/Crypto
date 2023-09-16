import { Box, Container, Image, Heading, Input, IconButton, InputGroup, InputRightElement, Button, useColorMode, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { SearchIcon, SettingsIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react'
import { Link } from 'react-router-dom'
import siteLogo from '../../icons/cryptocurrencies.png'


function Nav({ handleSearch }) {

    const { colorMode, toggleColorMode } = useColorMode();
    const displayText = useBreakpointValue({ base: "none", md: "block" }); // Hide the text on base and show from md upwards
    const inputSize = useBreakpointValue({ base: "md", md: "sm" });


    const handleToggleColorMode = () => {
        toggleColorMode();
    };

    return (
        <>
            <Box backgroundColor="#333" py={4}>
                <Container maxWidth="container.lg" display="flex" alignItems="center" justifyContent="space-between">
                    <Flex color="white" alignItems="center">
                        <Link to="/">
                            <Image src={siteLogo} w={"42px"} mr={3} />
                            <Text fontSize="xl" display={displayText}>
                                CryptoTracker
                            </Text>
                        </Link>
                    </Flex>
                    <Flex alignItems="center">
                        <InputGroup maxWidth={inputSize} mr={2}>
                            <Input
                                type='text'
                                textColor={'#718096'}
                                placeholder="Search a coin"
                                onChange={handleSearch}
                                size={inputSize}
                                pr="2.5rem" // to ensure the input text doesn't go behind the icon
                                borderRadius="md" // to give a rounded appearance
                            />
                            <InputRightElement height="full" mr={2} align="center">
                                <IconButton
                                    aria-label="Search"
                                    icon={<SearchIcon color="purple.500" />}
                                    colorScheme="whiteAlpha"
                                    variant="ghost"
                                    size={inputSize}
                                />
                            </InputRightElement>
                        </InputGroup>

                        <Link to='/watchlist' mr={3}>
                            <Text color="white" fontWeight={"bold"}>
                                Watchlist
                            </Text>
                        </Link>
                        <IconButton
                            onClick={handleToggleColorMode}
                            aria-label="Theme"
                            icon={colorMode === "dark" ? <MoonIcon /> : <SunIcon />}
                            colorScheme="white"
                            variant="ghost"
                            _hover={{ color: 'purple.500' }}
                        />
                    </Flex>
                </Container>
            </Box>
        </>
    )
}

export default Nav