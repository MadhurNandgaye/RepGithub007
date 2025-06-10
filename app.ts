import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  AlertTitle,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Define a custom theme for a modern look
const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: {
      fontWeight: 700,
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 600,
      marginBottom: '0.8rem',
    },
    h6: {
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50', // Green
    },
    warning: {
      main: '#ff9800', // Yellow
    },
    error: {
      main: '#f44336', // Red
    },
    background: {
      default: '#f4f6f8', // Light grey background
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          minWidth: 80,
          justifyContent: 'center',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#e0e0e0', // Slightly darker header
        },
      },
    },
  },
});

// Interface for a single API endpoint
interface Endpoint {
  id: string;
  name: string;
  url: string;
  baselineLatency: number; // Expected normal latency in ms
  internalLatency: number | null; // Simulated latency from internal network
  externalLatency: number | null; // Simulated latency from external public internet
  internalHealth: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  externalHealth: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  lastChecked: Date | null;
}

// Dummy data for initial endpoints
const initialEndpoints: Endpoint[] = [
  {
    id: '1',
    name: 'User Service API',
    url: 'https://api.example.com/users',
    baselineLatency: 100,
    internalLatency: null,
    externalLatency: null,
    internalHealth: 'Unknown',
    externalHealth: 'Unknown',
    lastChecked: null,
  },
  {
    id: '2',
    name: 'Product Catalog API',
    url: 'https://api.example.com/products',
    baselineLatency: 150,
    internalLatency: null,
    externalLatency: null,
    internalHealth: 'Unknown',
    externalHealth: 'Unknown',
    lastChecked: null,
  },
  {
    id: '3',
    name: 'Payment Gateway API',
    url: 'https://api.example.com/payments',
    baselineLatency: 200,
    internalLatency: null,
    externalLatency: null,
    internalHealth: 'Unknown',
    externalHealth: 'Unknown',
    lastChecked: null,
  },
  {
    id: '4',
    name: 'Notification Service',
    url: 'https://api.example.com/notifications',
    baselineLatency: 80,
    internalLatency: null,
    externalLatency: null,
    internalHealth: 'Unknown',
    externalHealth: 'Unknown',
    lastChecked: null,
  },
];

// Helper function to simulate API call and determine health
const simulateApiCall = (baseline: number): { latency: number; health: 'Red' | 'Yellow' | 'Green' } => {
  // Simulate network conditions:
  // 70% chance of Green (normal/good)
  // 20% chance of Yellow (slightly degraded)
  // 10% chance of Red (severely degraded or error)
  const randomFactor = Math.random();
  let latency: number;
  let health: 'Red' | 'Yellow' | 'Green';

  if (randomFactor < 0.7) {
    // Green: Latency within or slightly below baseline
    latency = baseline * (0.8 + Math.random() * 0.2); // 80%-100% of baseline
    health = 'Green';
  } else if (randomFactor < 0.9) {
    // Yellow: Latency 100-200% of baseline
    latency = baseline * (1.0 + Math.random() * 1.0); // 100%-200% of baseline
    health = 'Yellow';
  } else {
    // Red: Latency >200% of baseline or simulated error
    latency = baseline * (2.0 + Math.random() * 2.0); // 200%-400% of baseline
    health = 'Red';
  }

  // Add some slight extra randomness for more variability
  latency += Math.random() * 20;

  return { latency: Math.round(latency), health };
};

const App: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to update endpoint status
  const updateEndpointStatus = () => {
    setLoading(true);
    const updatedEndpoints = endpoints.map((endpoint) => {
      const internalResult = simulateApiCall(endpoint.baselineLatency);
      const externalResult = simulateApiCall(endpoint.baselineLatency);

      return {
        ...endpoint,
        internalLatency: internalResult.latency,
        internalHealth: internalResult.health,
        externalLatency: externalResult.latency,
        externalHealth: externalResult.health,
        lastChecked: new Date(),
      };
    });
    setEndpoints(updatedEndpoints);
    setLoading(false);
  };

  // Initial check on component mount
  useEffect(() => {
    updateEndpointStatus();
    // Set up interval for continuous monitoring (e.g., every 15 seconds)
    const interval = setInterval(updateEndpointStatus, 15000); // 15 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Empty dependency array means this runs once on mount

  // Calculate summary status
  const totalEndpoints = endpoints.length;
  const healthyEndpoints = endpoints.filter(
    (ep) => ep.internalHealth === 'Green' && ep.externalHealth === 'Green'
  ).length;
  const yellowEndpoints = endpoints.filter(
    (ep) => ep.internalHealth === 'Yellow' || ep.externalHealth === 'Yellow'
  ).length;
  const redEndpoints = endpoints.filter(
    (ep) => ep.internalHealth === 'Red' || ep.externalHealth === 'Red'
  ).length;

  let overallStatus: 'Operational' | 'Degraded' | 'Critical' = 'Operational';
  if (redEndpoints > 0) {
    overallStatus = 'Critical';
  } else if (yellowEndpoints > 0) {
    overallStatus = 'Degraded';
  }

  // Helper for status chip color and icon
  const getStatusProps = (health: 'Red' | 'Yellow' | 'Green' | 'Unknown') => {
    switch (health) {
      case 'Green':
        return { color: 'success' as const, label: 'Healthy', icon: <CheckCircleOutlineIcon fontSize="small" /> };
      case 'Yellow':
        return { color: 'warning' as const, label: 'Degraded', icon: <WarningAmberIcon fontSize="small" /> };
      case 'Red':
        return { color: 'error' as const, label: 'Critical', icon: <ErrorOutlineIcon fontSize="small" /> };
      default:
        return { color: 'default' as const, label: 'Unknown', icon: <CircularProgress size={16} /> };
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: theme.palette.primary.main }}>
          API Performance Monitoring Dashboard
        </Typography>

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Simulating API Checks...</Typography>
          </Box>
        )}

        {!loading && (
          <Grid container spacing={3}>
            {/* Section 1: Summary Status */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Overall System Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip
                      label={overallStatus}
                      color={
                        overallStatus === 'Operational'
                          ? 'success'
                          : overallStatus === 'Degraded'
                          ? 'warning'
                          : 'error'
                      }
                      sx={{ fontSize: '1rem', padding: '0.5rem 1rem', height: 'auto' }}
                    />
                    <Typography variant="body1">
                      {overallStatus === 'Operational' && 'All monitored endpoints are currently healthy.'}
                      {overallStatus === 'Degraded' && `Some endpoints (${yellowEndpoints} yellow) are experiencing degraded performance.`}
                      {overallStatus === 'Critical' && `Critical issues detected! ${redEndpoints} endpoints are red.`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Endpoints: {totalEndpoints} | Healthy: {healthyEndpoints} | Degraded: {yellowEndpoints} | Critical: {redEndpoints}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 2: Individual Endpoint Health Status */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Individual Endpoint Health Status
                  </Typography>
                  <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                    <Table stickyHeader aria-label="endpoint health table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Endpoint Name</TableCell>
                          <TableCell>URL</TableCell>
                          <TableCell align="center">Internal Health</TableCell>
                          <TableCell align="center">External Health</TableCell>
                          <TableCell align="right">Internal Latency (ms)</TableCell>
                          <TableCell align="right">External Latency (ms)</TableCell>
                          <TableCell align="right">Baseline (ms)</TableCell>
                          <TableCell align="center">Last Checked</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {endpoints.map((endpoint) => (
                          <TableRow key={endpoint.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                              {endpoint.name}
                            </TableCell>
                            <TableCell>{endpoint.url}</TableCell>
                            <TableCell align="center">
                              <Chip
                                {...getStatusProps(endpoint.internalHealth)}
                                size="small"
                                sx={{ width: 100 }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                {...getStatusProps(endpoint.externalHealth)}
                                size="small"
                                sx={{ width: 100 }}
                              />
                            </TableCell>
                            <TableCell align="right">{endpoint.internalLatency !== null ? endpoint.internalLatency : 'N/A'}</TableCell>
                            <TableCell align="right">{endpoint.externalLatency !== null ? endpoint.externalLatency : 'N/A'}</TableCell>
                            <TableCell align="right">{endpoint.baselineLatency}</TableCell>
                            <TableCell align="center">
                              {endpoint.lastChecked ? endpoint.lastChecked.toLocaleTimeString() : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 3: Notification Mechanisms */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Notification & Alerting
                  </Typography>
                  <Typography variant="body1" paragraph>
                    This Logic App can be configured to send summary status and alerts via various notification mechanisms:
                  </Typography>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    <AlertTitle>Email Notifications</AlertTitle>
                    Automated emails can be sent to designated recipients or distribution lists for critical alerts (Red status) and daily/weekly performance summaries.
                  </Alert>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    <AlertTitle>RSS Feed</AlertTitle>
                    A dedicated RSS feed can be published, allowing users or other systems to subscribe and receive real-time updates on endpoint health changes.
                  </Alert>
                  <Alert severity="info">
                    <AlertTitle>Subscription-based Notifications</AlertTitle>
                    Integration with popular notification platforms (e.g., Slack, Microsoft Teams, PagerDuty, Opsgenie) can be established to push alerts directly to relevant channels or on-call teams.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 4: Self-Healing Automation */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Automated Self-Healing Actions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Under predefined conditions, this Logic App can trigger automated self-healing resolutions to mitigate issues without manual intervention:
                  </Typography>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    <AlertTitle>Auto-Restart Application Service</AlertTitle>
                    If an endpoint consistently shows a 'Red' status due to application-level errors (e.g., unhandled exceptions, memory leaks), the Logic App can automatically trigger a restart of the associated application service.
                  </Alert>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    <AlertTitle>IIS App Pool Recycle</AlertTitle>
                    For web applications hosted on IIS, if an endpoint becomes unresponsive or shows degraded performance, the Logic App can initiate an automatic recycle of the relevant IIS application pool.
                  </Alert>
                  <Alert severity="warning">
                    <AlertTitle>Failover to Secondary Instance</AlertTitle>
                    In a multi-instance or high-availability setup, if a primary instance's API endpoint consistently fails, the Logic App could trigger a failover to a healthy secondary instance.
                  </Alert>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Note: The specific automation steps would involve integrations with cloud providers' APIs (Azure, AWS, GCP) or on-premise orchestration tools.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
