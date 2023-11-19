import React from 'react';
import { Text } from '@chakra-ui/react';

function CoinStats({ coinData }) {
    return (
        <>
            <div style={{ width: '48%' }}>
                <Text fontSize="lg" fontWeight="semibold" color="purple.500" mb={1}>
                    Market Cap Rank
                </Text>
                <Text fontSize="xl" color="purple.500">
                    #{coinData.market_data.market_cap_rank}
                </Text>
            </div>
            <div style={{ width: '48%' }}>
                <Text fontSize="lg" fontWeight="semibold" color="purple.500" mb={1}>
                    Market Cap
                </Text>
                <Text fontSize="xl" color="purple.500">
                    ${coinData.market_data.market_cap.usd.toLocaleString()}
                </Text>
            </div>
            <div style={{ width: '48%' }}>
                <Text fontSize="lg" fontWeight="semibold" color="purple.500" mb={1}>
                    24h High
                </Text>
                <Text fontSize="xl" color="purple.500">
                    ${coinData.market_data.high_24h.usd.toLocaleString()}
                </Text>
            </div>
            <div style={{ width: '48%' }}>
                <Text fontSize="lg" fontWeight="semibold" color="purple.500" mb={1}>
                    24h Low
                </Text>
                <Text fontSize="xl" color="purple.500">
                    ${coinData.market_data.low_24h.usd.toLocaleString()}
                </Text>
            </div>
            <div style={{ width: '100%' }}>
                <Text fontSize="lg" fontWeight="semibold" color="purple.500" mb={1}>
                    24h Volume
                </Text>
                <Text fontSize="xl" color="purple.500">
                    ${coinData.market_data.total_volume.usd.toLocaleString()}
                </Text>
            </div>
        </>
    )
}

export default CoinStats;
