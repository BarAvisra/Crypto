import { Box, Container, Heading, Input, IconButton, InputGroup, InputRightElement, Button, ColorModeScript, useColorMode } from '@chakra-ui/react';
import { SearchIcon, SettingsIcon, MoonIcon } from '@chakra-ui/icons';
import React from 'react'
import { Link } from 'react-router-dom'


function Nav({ handleSearch }) {

    const { colorMode, toggleColorMode } = useColorMode();

    const handleToggleColorMode = () => {
        toggleColorMode();
    };

    return (
        <Box backgroundColor="#333" py={4}>
            <Container maxWidth="container.lg" display="flex" alignItems="center" justifyContent="space-between">
                <Heading color="white" as="h1" fontSize="xl">
                    <MoonIcon mr={2} color="purple.500" />
                    <Button bg={"transparent"} size={30} _hover={{
                        textDecoration: 'underline',
                        color: "purple.500"
                    }}
                    >
                        <Link to="/">CryptoTracker</Link>
                    </Button>
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
                    <IconButton
                        aria-label="Settings"
                        icon={<SettingsIcon />}
                        colorScheme="whiteAlpha"
                        variant="outline"
                        mr={2}
                    />
                    <IconButton
                        onClick={handleToggleColorMode}
                        aria-label="Theme"
                        icon={<MoonIcon />}
                        colorScheme="whiteAlpha"
                        variant="outline"
                    />
                </Box>
            </Container>
        </Box>)
}

export default Nav