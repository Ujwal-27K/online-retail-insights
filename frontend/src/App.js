import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import RevenueChart from './components/RevenueChart';
import TopProductsChart from './components/TopProductsChart';
import CustomerSegmentsPie from './components/CustomerSegmentsPie';
import apiService from './services/api';

function App() {
  const [theme, setTheme] = useState('light');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    loadDashboardStats();
    const intervalId = setInterval(loadDashboardStats, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const stats = await apiService.getDashboardStats();
      setDashboardStats(stats.stats);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const formatNumber = (num) => num?.toLocaleString();
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" component="a" href="/" sx={{ color: 'inherit', textDecoration: 'none' }}>
            Online Retail Insights
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme} title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
            {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Real-time insights from retail data
        </Typography>

        {loading && (
          <Typography variant="body1" sx={{ my: 4 }}>
            Loading dashboard statistics...
          </Typography>
        )}

        {error && (
          <Typography variant="body1" color="error" sx={{ my: 4 }}>
            {error}
          </Typography>
        )}

        {dashboardStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Customers
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatNumber(dashboardStats.total_customers)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatNumber(dashboardStats.total_orders)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Products Sold
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatNumber(dashboardStats.total_products)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: 'background.paper' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {formatCurrency(dashboardStats.total_revenue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'background.paper', p: 2 }}>
              <RevenueChart />
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'background.paper', p: 2 }}>
              <TopProductsChart />
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'background.paper', p: 2 }}>
              <CustomerSegmentsPie />
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 2, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          © {new Date().getFullYear()} Online Retail Insights - Version 1.0.0
        </Container>
      </Box>
    </Box>
  );
}

export default App;
