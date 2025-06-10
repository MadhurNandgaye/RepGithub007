import React, { useState, useEffect, useRef } from 'react';
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
  Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

// Define a custom theme for a modern look and feel
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
      main: '#1976d2', // A vibrant blue
    },
    secondary: {
      main: '#dc004e', // A deep pink
    },
    success: {
      main: '#4caf50', // Green
    },
    warning: {
      main: '#ff9800', // Yellow/Orange
    },
    error: {
      main: '#f44336', // Red
    },
    background: {
      default: '#f4f6f8', // Light grey background for the page
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Rounded corners for cards
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Subtle shadow
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Rounded corners for chips
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
          backgroundColor: '#e0e0e0', // Slightly darker header for tables
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
  internalLatencyHistory: number[]; // Store a short history of internal latencies
  externalLatencyHistory: number[]; // Store a short history of external latencies
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
    internalLatencyHistory: [],
    externalLatencyHistory: [],
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
    internalLatencyHistory: [],
    externalLatencyHistory: [],
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
    internalLatencyHistory: [],
    externalLatencyHistory: [],
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
    internalLatencyHistory: [],
    externalLatencyHistory: [],
  },
];

// Helper function to simulate API call and determine health status based on latency
const simulateApiCall = (baseline: number): { latency: number; health: 'Red' | 'Yellow' | 'Green' } => {
  // Simulate network conditions:
  // 70% chance of Green (normal/good performance)
  // 20% chance of Yellow (slightly degraded performance)
  // 10% chance of Red (severely degraded performance or simulated error)
  const randomFactor = Math.random();
  let latency: number;
  let health: 'Red' | 'Yellow' | 'Green';

  if (randomFactor < 0.7) {
    // Green: Latency within or slightly below baseline (80%-100% of baseline)
    latency = baseline * (0.8 + Math.random() * 0.2);
    health = 'Green';
  } else if (randomFactor < 0.9) {
    // Yellow: Latency 100-200% of baseline (degraded but not critical)
    latency = baseline * (1.0 + Math.random() * 1.0);
    health = 'Yellow';
  } else {
    // Red: Latency >200% of baseline (critical or very slow)
    latency = baseline * (2.0 + Math.random() * 2.0);
    health = 'Red';
  }

  // Add some slight extra randomness for more variability in latency
  latency += Math.random() * 20;

  return { latency: Math.round(latency), health };
};

// Helper function to determine trend based on recent latency history
const getTrend = (history: number[], currentLatency: number | null): 'improving' | 'degrading' | 'stable' | 'unknown' => {
  if (history.length < 2 || currentLatency === null) {
    return 'unknown'; // Need at least two historical points to determine a trend
  }

  const prevLatency = history[history.length - 1]; // The immediate previous recorded latency

  if (currentLatency < prevLatency * 0.9) { // Significantly better (10% improvement)
    return 'improving';
  } else if (currentLatency > prevLatency * 1.1) { // Significantly worse (10% degradation)
    return 'degrading';
  } else {
    return 'stable'; // Within a reasonable range
  }
};


const App: React.FC = () => {
  // State to hold the list of endpoints and their current status
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  // State to control the loading spinner visibility
  const [loading, setLoading] = useState<boolean>(true);
  // Ref to hold the interval ID for cleanup
  const intervalRef = useRef<number | null>(null);

  // Function to update endpoint status by simulating API calls
  const updateEndpointStatus = () => {
    // Set loading to true only for a brief moment to show the check is happening
    setLoading(true);

    const updatedEndpoints = endpoints.map((endpoint) => {
      // Simulate calls for internal and external networks
      const internalResult = simulateApiCall(endpoint.baselineLatency);
      const externalResult = simulateApiCall(endpoint.baselineLatency);

      // Update latency history, keeping only the last few entries (e.g., last 5)
      const newInternalHistory = [...endpoint.internalLatencyHistory, internalResult.latency].slice(-5);
      const newExternalHistory = [...endpoint.externalLatencyHistory, externalResult.latency].slice(-5);

      return {
        ...endpoint,
        internalLatency: internalResult.latency,
        internalHealth: internalResult.health,
        externalLatency: externalResult.latency,
        externalHealth: externalResult.health,
        lastChecked: new Date(),
        internalLatencyHistory: newInternalHistory,
        externalLatencyHistory: newExternalHistory,
      };
    });
    setEndpoints(updatedEndpoints);
    // Set loading to false after a short delay to simulate network call time
    setTimeout(() => setLoading(false), 500);
  };

  // useEffect to handle initial API check and set up recurring interval
  useEffect(() => {
    // Perform an immediate update on component mount
    updateEndpointStatus();

    // Set up interval for continuous monitoring (e.g., every 15 seconds)
    // Store the interval ID in a ref so it can be cleared later
    intervalRef.current = window.setInterval(updateEndpointStatus, 15000); // 15 seconds

    // Cleanup function: This runs when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // Calculate summary status based on current endpoint healths
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

  // Helper function to get props for Material UI Chip based on health status
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

  // Helper function to get icon and tooltip for trend
  const getTrendIcon = (trend: 'improving' | 'degrading' | 'stable' | 'unknown') => {
    switch (trend) {
      case 'improving':
        return (
          <Tooltip title="Latency Improving">
            <ArrowDownwardIcon color="success" fontSize="small" sx={{ ml: 0.5 }} />
          </Tooltip>
        );
      case 'degrading':
        return (
          <Tooltip title="Latency Degrading">
            <ArrowUpwardIcon color="error" fontSize="small" sx={{ ml: 0.5 }} />
          </Tooltip>
        );
      case 'stable':
        return (
          <Tooltip title="Latency Stable">
            <HorizontalRuleIcon color="action" fontSize="small" sx={{ ml: 0.5 }} />
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets browser default styles */}
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: theme.palette.primary.main }}>
          API Performance Monitoring Dashboard
        </Typography>

        {/* Loading spinner display */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6">Simulating API Checks...</Typography>
            <Typography variant="body2" color="textSecondary">Updates every 15 seconds</Typography>
          </Box>
        )}

        {/* Main content displayed once loading is complete */}
        {!loading && (
          <Grid container spacing={3}>
            {/* Section 1: Overall Summary Status */}
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
                      {overallStatus === 'Operational' && 'All monitored endpoints are currently healthy and performing within expected baselines.'}
                      {overallStatus === 'Degraded' && `Some endpoints (${yellowEndpoints} yellow) are experiencing degraded performance. Further investigation may be needed.`}
                      {overallStatus === 'Critical' && `Critical issues detected! ${redEndpoints} endpoints are experiencing severe problems. Immediate attention required!`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Total Endpoints Monitored: {totalEndpoints} | Healthy: {healthyEndpoints} | Degraded: {yellowEndpoints} | Critical: {redEndpoints}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 2: Individual Endpoint Health Status Table */}
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
                        {endpoints.map((endpoint) => {
                          // Determine internal and external trends
                          const internalTrend = getTrend(endpoint.internalLatencyHistory.slice(0, -1), endpoint.internalLatency);
                          const externalTrend = getTrend(endpoint.externalLatencyHistory.slice(0, -1), endpoint.externalLatency);

                          return (
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
                              <TableCell align="right" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {endpoint.internalLatency !== null ? endpoint.internalLatency : 'N/A'}
                                {getTrendIcon(internalTrend)}
                              </TableCell>
                              <TableCell align="right" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                {endpoint.externalLatency !== null ? endpoint.externalLatency : 'N/A'}
                                {getTrendIcon(externalTrend)}
                              </TableCell>
                              <TableCell align="right">{endpoint.baselineLatency}</TableCell>
                              <TableCell align="center">
                                {endpoint.lastChecked ? endpoint.lastChecked.toLocaleTimeString() : 'N/A'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
                    This Logic App can be configured to send summary status and alerts via various notification mechanisms based on defined thresholds:
                  </Typography>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    <AlertTitle>Email Notifications</AlertTitle>
                    Automated emails can be sent to designated recipients or distribution lists for critical alerts (Red status) and daily/weekly performance summaries. This ensures key stakeholders are immediately informed of incidents.
                  </Alert>
                  <Alert severity="info" sx={{ mb: 1 }}>
                    <AlertTitle>RSS Feed</AlertTitle>
                    A dedicated RSS feed can be published, allowing users or other monitoring systems to subscribe and receive real-time updates on endpoint health changes, providing a low-friction subscription model.
                  </Alert>
                  <Alert severity="info">
                    <AlertTitle>Subscription-based Notifications</AlertTitle>
                    Integration with popular communication and incident management platforms (e.g., Slack, Microsoft Teams, PagerDuty, Opsgenie) can be established to push alerts directly to relevant channels or on-call teams for rapid response.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>

            {/* Section 4: Automated Self-Healing Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Automated Self-Healing Actions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Under predefined conditions (e.g., an endpoint remains 'Red' for more than 5 minutes), this Logic App can trigger automated self-healing resolutions to mitigate issues without manual intervention. These actions are crucial for maintaining application availability:
                  </Typography>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    <AlertTitle>Auto-Restart Application Service</AlertTitle>
                    If an endpoint consistently shows a 'Red' status due to application-level errors (e.g., unhandled exceptions, memory leaks), the Logic App can automatically trigger a restart of the associated application service to clear its state.
                  </Alert>
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    <AlertTitle>IIS App Pool Recycle</AlertTitle>
                    For web applications hosted on IIS, if an endpoint becomes unresponsive or shows degraded performance, the Logic App can initiate an automatic recycle of the relevant IIS application pool, often resolving minor resource contention issues.
                  </Alert>
                  <Alert severity="warning">
                    <AlertTitle>Failover to Secondary Instance</AlertTitle>
                    In a multi-instance or high-availability setup, if a primary instance's API endpoint consistently fails, the Logic App could trigger an automated failover to a healthy secondary instance, redirecting traffic and minimizing downtime.
                  </Alert>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Note: The specific automation steps would involve secure API integrations with cloud providers' APIs (e.g., Azure Resource Manager, AWS CloudWatch/Lambda, GCP Cloud Functions) or on-premise orchestration tools and runbooks.
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
