import { Box, Container, Flex, Text, IconButton, Link, useColorMode } from '@chakra-ui/react';
import { SettingsIcon, MoonIcon } from '@chakra-ui/icons';
import React from 'react';

function Footer() {
    const { colorMode, toggleColorMode } = useColorMode();

    const handleToggleColorMode = () => {
        toggleColorMode();
    };

    return (
        <Box backgroundColor="#333" py={4}>
            <Container maxWidth="container.lg" display="flex" alignItems="center" justifyContent="space-between">
                <Flex alignItems="center">
                    <Text color="white" fontSize="lg" fontWeight="bold">
                        &copy; 2023 CryptoTracker
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
}

export default Footer;
