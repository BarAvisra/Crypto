import React from 'react'
import { Box, Text } from '@chakra-ui/react'; // Import any required components or libraries.


function CoinStats({ coinData }) {
    return (
        <>
            <Box w="48%">
                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                    Market Cap Rank
                </Text>
                <Text fontSize="xl" color="#9C68A0">
                    #{coinData.market_data.market_cap_rank}
                </Text>
            </Box>
            <Box w="48%">
                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                    Market Cap
                </Text>
                <Text fontSize="xl" color="#9C68A0">
                    ${coinData.market_data.market_cap.usd.toLocaleString()}
                </Text>
            </Box>
            <Box w="48%">
                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                    24h High
                </Text>
                <Text fontSize="xl" color="#9C68A0">
                    ${coinData.market_data.high_24h.usd.toLocaleString()}
                </Text>
            </Box>
            <Box w="48%">
                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                    24h Low
                </Text>
                <Text fontSize="xl" color="#9C68A0">
                    ${coinData.market_data.low_24h.usd.toLocaleString()}
                </Text>
            </Box>
            <Box w="100%">
                <Text fontSize="lg" fontWeight="semibold" color="#9C68A0" mb={1}>
                    24h Volume
                </Text>
                <Text fontSize="xl" color="#9C68A0">
                    ${coinData.market_data.total_volume.usd.toLocaleString()}
                </Text>
            </Box>
        </>
    )
}

export default CoinStats