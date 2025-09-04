// src/components/CustomerSegmentsChart.js
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const CustomerSegmentsChart = ({ data }) => {
  const theme = useTheme();

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            p: 2,
            border: 1,
            borderColor: 'grey.300',
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {data.segment}
          </Typography>
          <Typography variant="body2">
            Count: {data.count?.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            Percentage: {data.percentage}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ segment, percentage }) => `${segment}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CustomerSegmentsChart;