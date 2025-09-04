// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import SalesTrendsChart from './components/SalesTrendsChart';
import TopProductsChart from './components/TopProductsChart';
import CustomerSegmentsChart from './components/CustomerSegmentsChart';
import GeographicChart from './components/GeographicChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import KPICard from './components/KPICard';

// Services
import { dashboardService } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  // State management
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Data state
  const [dashboardData, setDashboardData] = useState({
    overview: null,
    salesTrends: [],
    topProducts: [],
    customerSegments: [],
    geographicData: [],
    recentOrders: []
  });

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 30,
    category: 'all',
    customerType: 'all'
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        overview,
        salesTrends,
        topProducts,
        customerSegments,
        geographicData,
        recentOrders
      ] = await Promise.all([
        dashboardService.getDashboardOverview(filters.dateRange),
        dashboardService.getSalesTrends('daily', filters.dateRange),
        dashboardService.getTopProducts(10, filters.category),
        dashboardService.getCustomerSegments(),
        dashboardService.getGeographicSales(),
        dashboardService.getRecentOrders(10)
      ]);

      setDashboardData({
        overview,
        salesTrends,
        topProducts,
        customerSegments,
        geographicData,
        recentOrders
      });

      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard data. Please try again.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto refresh setup
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchDashboardData]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchDashboardData();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Button onClick={fetchDashboardData} variant="contained" sx={{ mt: 2 }}>
            Retry
          </Button>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        {/* Top Navigation */}
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Retail Analytics Dashboard
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  color="secondary"
                />
              }
              label="Auto Refresh"
              sx={{ color: 'white', mr: 2 }}
            />
            <Button
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={toggleDrawer}
          variant="temporary"
        >
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
            <List>
              <ListItem sx={{ px: 0 }}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={filters.dateRange}
                    label="Date Range"
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  >
                    <MenuItem value={7}>Last 7 days</MenuItem>
                    <MenuItem value={30}>Last 30 days</MenuItem>
                    <MenuItem value={90}>Last 3 months</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="clothing">Clothing</MenuItem>
                    <MenuItem value="home">Home & Kitchen</MenuItem>
                    <MenuItem value="books">Books</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem sx={{ px: 0 }}>
                <FormControl fullWidth>
                  <InputLabel>Customer Type</InputLabel>
                  <Select
                    value={filters.customerType}
                    label="Customer Type"
                    onChange={(e) => handleFilterChange('customerType', e.target.value)}
                  >
                    <MenuItem value="all">All Customers</MenuItem>
                    <MenuItem value="new">New Customers</MenuItem>
                    <MenuItem value="returning">Returning Customers</MenuItem>
                    <MenuItem value="vip">VIP Customers</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {loading && (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          )}

          {!loading && dashboardData.overview && (
            <>
              {/* Last Updated Info */}
              {lastUpdated && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last updated: {lastUpdated.toLocaleString()}
                </Typography>
              )}

              {/* KPI Cards */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Total Revenue"
                    value={`$${dashboardData.overview.total_revenue?.toLocaleString()}`}
                    icon={<AttachMoneyIcon />}
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Total Orders"
                    value={dashboardData.overview.total_orders?.toLocaleString()}
                    icon={<ShoppingCartIcon />}
                    color="secondary"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Avg Order Value"
                    value={`$${dashboardData.overview.avg_order_value}`}
                    icon={<TrendingUpIcon />}
                    color="success"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <KPICard
                    title="Repeat Customers"
                    value={dashboardData.overview.repeat_customers?.toLocaleString()}
                    icon={<PeopleIcon />}
                    color="info"
                  />
                </Grid>
              </Grid>

              {/* Charts Section */}
              <Grid container spacing={3}>
                {/* Sales Trends */}
                <Grid item xs={12} lg={8}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Sales Trends
                    </Typography>
                    <SalesTrendsChart data={dashboardData.salesTrends} />
                  </Paper>
                </Grid>

                {/* Customer Segments */}
                <Grid item xs={12} lg={4}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Customer Segments
                    </Typography>
                    <CustomerSegmentsChart data={dashboardData.customerSegments} />
                  </Paper>
                </Grid>

                {/* Top Products */}
                <Grid item xs={12} lg={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Top Products
                    </Typography>
                    <TopProductsChart data={dashboardData.topProducts} />
                  </Paper>
                </Grid>

                {/* Geographic Sales */}
                <Grid item xs={12} lg={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Sales by Country
                    </Typography>
                    <GeographicChart data={dashboardData.geographicData} />
                  </Paper>
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Recent Orders
                    </Typography>
                    <RecentOrdersTable data={dashboardData.recentOrders} />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;