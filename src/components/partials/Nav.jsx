import { Box, Container, Image, Heading, Input, IconButton, InputGroup, InputRightElement, Button, useColorMode, Flex } from '@chakra-ui/react';
import { SearchIcon, SettingsIcon, MoonIcon } from '@chakra-ui/icons';
import React from 'react'
import { Link } from 'react-router-dom'
import siteLogo from '../../icons/cryptocurrencies.png'


function Nav({ handleSearch }) {

    const { colorMode, toggleColorMode } = useColorMode();

    const handleToggleColorMode = () => {
        toggleColorMode();
    };

    return (
        <>
            <Box backgroundColor="#333" py={4}>
                <Container maxWidth="container.lg" display="flex" alignItems="center" justifyContent="space-between">
                    <Heading color="white" as="h1" fontSize="xl">
                        <Flex gap={1}>
                            <Image src={siteLogo} w={"42px"} />
                            <Button bg={"transparent"} size={30} _hover={{
                                color: "purple.500"
                            }}
                            >
                                <Link to="/">CryptoTracker</Link>
                            </Button>
                        </Flex>
                    </Heading>
                    <Box display="flex" alignItems="center">
                        <InputGroup maxWidth="sm" mr={2}>
                            <Input type='text' textColor={'#718096'} placeholder="Search a coin" onChange={handleSearch} />
                            <InputRightElement>
                                <IconButton
                                    aria-label="Search"
                                    icon={<SearchIcon color="purple.500" />}
                                    colorScheme="whiteAlpha"
                                    variant="ghost"
                                />
                            </InputRightElement>
                        </InputGroup>
                        <Flex alignItems="center">
                            <IconButton
                                aria-label="Settings"
                                icon={<SettingsIcon />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                mr={2}
                                _hover={{ color: 'purple.500' }}
                            />
                            <IconButton
                                onClick={handleToggleColorMode}
                                aria-label="Theme"
                                icon={<MoonIcon />}
                                colorScheme="whiteAlpha"
                                variant="ghost"
                                _hover={{ color: 'purple.500' }}
                            />
                        </Flex>
                    </Box>
                </Container>
            </Box>
        </>
    )
}

export default Nav