// src/components/GeographicChart.js
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const GeographicChart = ({ data }) => {
  const theme = useTheme();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
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
            {label}
          </Typography>
          <Typography variant="body2" sx={{ color: payload[0].color }}>
            Sales: {formatCurrency(payload[0].value)}
          </Typography>
          <Typography variant="body2">
            Orders: {data.orders?.toLocaleString()}
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
        <BarChart 
          data={data.slice(0, 8)} 
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.grey[300]} />
          <XAxis 
            dataKey="country"
            stroke={theme.palette.text.secondary}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            stroke={theme.palette.text.secondary}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="sales" 
            fill={theme.palette.info.main}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GeographicChart;