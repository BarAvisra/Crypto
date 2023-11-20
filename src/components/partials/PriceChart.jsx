import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Box } from '@chakra-ui/react';

function PriceChart({ graphData }) {
    return (
        <Box width={["100%", "100%", "850px"]} height="400px">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={graphData}
                    margin={{
                        top: 30,
                        right: 30,
                        left: 30,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9C68A0" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.2} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: '12px' }} />
                    <YAxis tick={{ fontSize: '12px' }} />
                    <Tooltip contentStyle={{ fontSize: '14px' }} />
                    <Area type="monotone" dataKey="price" stroke="#9C27B0" fill="url(#colorUv)" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default PriceChart;
