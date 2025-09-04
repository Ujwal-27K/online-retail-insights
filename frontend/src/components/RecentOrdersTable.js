// src/components/RecentOrdersTable.js
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Box
} from '@mui/material';

const RecentOrdersTable = ({ data }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status chip color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'processing':
        return 'warning';
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  if (!data || data.length === 0) {
    return (
      <Box 
        sx={{ 
          height: 200, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Typography color="text.secondary">No orders available</Typography>
      </Box>
    );
  }

  return (
    <TableContainer sx={{ maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><strong>Order ID</strong></TableCell>
            <TableCell><strong>Customer</strong></TableCell>
            <TableCell><strong>Product</strong></TableCell>
            <TableCell align="right"><strong>Amount</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((order, index) => (
            <TableRow 
              key={order.id || index}
              sx={{ 
                '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                '&:hover': { backgroundColor: 'action.selected' }
              }}
            >
              <TableCell>
                <Typography variant="body2" fontFamily="monospace">
                  {order.id}
                </Typography>
              </TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(order.amount)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {formatDate(order.date)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentOrdersTable;