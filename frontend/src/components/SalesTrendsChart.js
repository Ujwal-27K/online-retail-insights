// src/components/SalesTrendsChart.js
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';

const SalesTrendsChart = ({ data }) => {
  const theme = useTheme();

  // Format currency for tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
            {formatDate(label)}
          </Typography>
          {payload.map((entry) => (
            <Typography
              key={entry.dataKey}
              variant="body2"
              sx={{ color: entry.color }}
            >
              {entry.dataKey === 'revenue' 
                ? `Revenue: ${formatCurrency(entry.value)}`
                : `Orders: ${entry.value}`
              }
            </Typography>
          ))}
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
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.grey[300]} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke={theme.palette.text.secondary}
          />
          <YAxis 
            yAxisId="revenue"
            orientation="left"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            stroke={theme.palette.primary.main}
          />
          <YAxis 
            yAxisId="orders"
            orientation="right"
            stroke={theme.palette.secondary.main}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke={theme.palette.primary.main}
            strokeWidth={3}
            dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
            name="Revenue"
          />
          <Line
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            stroke={theme.palette.secondary.main}
            strokeWidth={3}
            dot={{ fill: theme.palette.secondary.main, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: theme.palette.secondary.main, strokeWidth: 2 }}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SalesTrendsChart;