import React from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Legend } from 'recharts';
import { Box } from '@chakra-ui/react';

function CandleChart({ graphMarkCapData, abbreviateNumber, formatCurrency }) {
    return (
        <>
            <Box width={["100%", "100%", "850px"]} height="400px">

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={graphMarkCapData}
                        margin={{
                            top: 40,
                            right: 28,
                            left: 30,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: '12px' }} />
                        <YAxis tickFormatter={(value) => abbreviateNumber(value)} tick={{ fontSize: '12px' }} />
                        <Tooltip formatter={(value) => formatCurrency(value)} volume={{ fontSize: '14px' }} />
                        <Legend />
                        <Bar dataKey="marketCap" name="Market Cap" fill="#8884d8" />
                        <Bar dataKey="volume" name="Volume" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

        </>
    )
}

export default CandleChart