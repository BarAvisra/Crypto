import { Box, Container, Flex, Text } from '@chakra-ui/react';

function Footer() {
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
