import React from 'react'
import { Heading, Box } from '@chakra-ui/react'

function AboutCoin({ coinData }) {
    return (
        <>
            <Heading
                as="h3"
                mb={4}
                fontSize="xl"
                textAlign="center"
                color="gray.800"
            >
                About {coinData.name}
            </Heading>

            <Box
                fontSize={coinData.description.en.length > 250 ? "md" : "lg"}
                maxH={"380px"}
                maxW={"530px"}
                sx={{
                    // For Webkit browsers
                    '&::-webkit-scrollbar': {
                        width: '3px',
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'gray.600',
                        borderRadius: '5px',
                        transition: 'background-color 0.3s'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#555'
                    },
                    // For Firefox
                    scrollbarColor: '#000 #F5F5F5',
                    scrollbarWidth: '1px',
                }}
                overflow={"auto"}
                color="gray.600"
                textAlign="center"
                lineHeight="1.6"
                dangerouslySetInnerHTML={{ __html: coinData.description.en }}>

            </Box>
        </>
    )
}

export default AboutCoin