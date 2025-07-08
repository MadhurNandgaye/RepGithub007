import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
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
  Tooltip, // This is Material-UI Tooltip
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Select, // Added Select for server name filter
  MenuItem, // Added MenuItem for Select options
  FormControl, // Added FormControl for Select
  InputLabel, // Added InputLabel for Select
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BugReportIcon from '@mui/icons-material/BugReport';
import MemoryIcon from '@mui/icons-material/Memory';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableChartIcon from '@mui/icons-material/TableChart';
import GridOnIcon from '@mui/icons-material/GridOn';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// Recharts are still used for the MiniTrendGraph
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip as RechartsTooltip, // Aliased Recharts Tooltip to avoid conflict
} from 'recharts';
import { blueGrey } from '@mui/material/colors';

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
    // Adding grey palette for the latency bar background
    grey: {
      300: '#e0e0e0',
      500: '#9e9e9e',
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

// Interface for a single history data point with timestamp
interface HistoryDataPoint {
  value: number;
  timestamp: Date;
}

// Interface for a single API endpoint
interface Endpoint {
  id: string;
  name: string; // Now includes method and path
  url: string;
  baselineLatency: number; // Expected normal latency in ms
  internalLatency: number | null; // Simulated latency from internal network
  externalLatency: number | null; // Simulated latency from external public internet
  internalHealth: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  externalHealth: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  lastChecked: Date | null;
  internalLatencyHistory: HistoryDataPoint[]; // Store a short history of internal latencies with timestamps
  externalLatencyHistory: HistoryDataPoint[]; // Store a short history of external latencies with timestamps
  errorRate: number; // New: Percentage of errors (0-100)
  traffic: number; // New: Simulated requests per second (RPS)
  errorRateHistory: HistoryDataPoint[]; // New: Store history for error rate with timestamps
  serverName: string; // New: Server name for the endpoint
}

const MAX_HISTORY_LENGTH = 20; // History length for the last 20 days

// Helper function to generate initial dummy history data with timestamps
const generateDummyHistory = (
  length: number,
  baseValue: number,
  amplitude: number,
  frequency: number,
  randomness: number,
  daysAgo: number // Number of days ago to start generating data
): HistoryDataPoint[] => {
  const history: HistoryDataPoint[] = [];
  const now = new Date();
  for (let i = 0; i < length; i++) {
    const value = Math.max(0, baseValue + Math.sin(i * frequency) * amplitude + Math.random() * randomness);
    // Distribute timestamps evenly over the specified number of days
    const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) + (i * (daysAgo * 24 * 60 * 60 * 1000 / length)));
    history.push({ value: parseFloat(value.toFixed(1)), timestamp });
  }
  return history;
};

// Generate initial endpoints across multiple servers
const generateInitialEndpoints = (): Endpoint[] => {
  const endpoints: Endpoint[] = [];
  const serverNames = ['Server Alpha', 'Server Beta', 'Server Gamma', 'Server Delta', 'Server Epsilon'];
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  const apiPaths = [
    '/users/{id}',
    '/products/search',
    '/orders',
    '/auth/login',
    '/data/analytics',
    '/swagger/swagger-ui.css',
    '/swagger/swagger-ui-bundle.js',
    '/api/v1/health',
    '/payments/process',
    '/notifications/send',
    '/dtocr/legalparser', // Example from user's request
    '/authentication/getbeartoken', // Example from user's request
  ];

  let endpointIdCounter = 1;

  serverNames.forEach(serverName => {
    const numEndpoints = Math.floor(Math.random() * (8 - 4 + 1)) + 4; // 4 to 8 endpoints per server

    for (let i = 0; i < numEndpoints; i++) {
      const baseline = Math.floor(Math.random() * (250 - 50 + 1)) + 50; // Random baseline between 50 and 250ms
      const randomMethod = httpMethods[Math.floor(Math.random() * httpMethods.length)];
      const randomPath = apiPaths[Math.floor(Math.random() * apiPaths.length)];
      
      // Format the endpoint name as "METHOD /path/to/endpoint"
      const endpointName = `${randomMethod} ${randomPath}`;

      endpoints.push({
        id: String(endpointIdCounter++),
        name: endpointName,
        url: `https://api.example.com/${serverName.toLowerCase().replace(' ', '-')}${randomPath}`,
        baselineLatency: baseline,
        internalLatency: null,
        externalLatency: null,
        internalHealth: 'Unknown',
        externalHealth: 'Unknown',
        lastChecked: null,
        internalLatencyHistory: generateDummyHistory(MAX_HISTORY_LENGTH, baseline, baseline * 0.2, 0.5, 10, MAX_HISTORY_LENGTH),
        externalLatencyHistory: generateDummyHistory(MAX_HISTORY_LENGTH, baseline * 1.2, baseline * 0.25, 0.5, 10, MAX_HISTORY_LENGTH),
        errorRate: 0,
        traffic: 0,
        errorRateHistory: generateDummyHistory(MAX_HISTORY_LENGTH, 1, 1, 0.3, 0.5, MAX_HISTORY_LENGTH),
        serverName: serverName,
      });
    }
  });
  return endpoints;
};

const initialEndpoints: Endpoint[] = generateInitialEndpoints();


// Helper function to simulate API call and determine health status based on latency
const simulateApiCall = (baseline: number): { latency: number; health: 'Red' | 'Yellow' | 'Green'; errorRate: number; traffic: number } => {
  const randomFactor = Math.random();
  let latency: number;
  let health: 'Red' | 'Yellow' | 'Green';
  let errorRate: number;
  let traffic: number;

  if (randomFactor < 0.7) {
    // Green: Latency within or slightly below baseline (80%-100% of baseline)
    latency = baseline * (0.8 + Math.random() * 0.2);
    health = 'Green';
    errorRate = Math.round(Math.random() * 2); // 0-2% error
    traffic = Math.round(50 + Math.random() * 100); // 50-150 RPS (normal)
  } else if (randomFactor < 0.9) {
    // Yellow: Latency 100-200% of baseline (degraded but not critical)
    latency = baseline * (1.0 + Math.random() * 1.0);
    health = 'Yellow';
    errorRate = Math.round(3 + Math.random() * 7); // 3-10% error
    traffic = Math.round(100 + Math.random() * 200); // 100-300 RPS (moderate to high)
  } else {
    // Red: Latency >200% of baseline (critical or very slow)
    latency = baseline * (2.0 + Math.random() * 2.0);
    health = 'Red';
    errorRate = Math.round(10 + Math.random() * 20); // 10-30% error
    traffic = Math.round(20 + Math.random() * 50); // 20-70 RPS (potentially low due to errors or very high burst, or very high traffic leading to issues)
  }

  // Add some slight extra randomness for more variability in latency
  latency += Math.random() * 20;

  return { latency: Math.round(latency), health, errorRate, traffic };
};

// Helper function to determine trend based on recent history
const getTrend = (history: HistoryDataPoint[]): 'improving' | 'degrading' | 'stable' | 'unknown' => {
  if (history.length < 2) {
    return 'unknown'; // Need at least two historical points (current and one previous)
  }

  const current = history[history.length - 1].value;
  const prev = history[history.length - 2].value;

  if (current < prev * 0.9) { // Significantly better (10% improvement)
    return 'improving';
  } else if (current > prev * 1.1) { // Significantly worse (10% degradation)
    return 'degrading';
  } else {
    return 'stable'; // Within a reasonable range
  }
};

// Interface for the LatencyBar component props
interface LatencyBarProps {
  currentLatency: number;
  baselineLatency: number;
  health: 'Red' | 'Yellow' | 'Green' | 'Unknown';
}

// LatencyBar component to visually represent latency against baseline
const LatencyBar: React.FC<LatencyBarProps> = ({ currentLatency, baselineLatency, health }) => {
  // Define a fixed width for the visual representation of the baseline (e.g., 80px)
  // Decreased from 80px to 60px to reduce overall column width
  const visualBaselineWidth = 60; // pixels

  // Calculate the actual width of the bar. It scales with currentLatency relative to baseline.
  const ratio = currentLatency / baselineLatency;
  let barWidth = visualBaselineWidth * ratio;

  // Cap the bar width for visual clarity if latency is extremely high.
  // This prevents the bar from becoming excessively long while still showing the severity.
  const maxVisualWidth = visualBaselineWidth * 2.0; // Reduced max visual width from 2.5 to 2.0
  if (barWidth > maxVisualWidth) {
    barWidth = maxVisualWidth;
  }

  // Determine the bar color based on the health status
  let barColor: string;
  switch (health) {
    case 'Green':
      barColor = theme.palette.success.main;
      break;
    case 'Yellow':
      barColor = theme.palette.warning.main;
      break;
    case 'Red':
      barColor = theme.palette.error.main;
      break;
    default:
      barColor = theme.palette.grey[500]; // Default color for unknown
      break;
  }

  return (
    <Tooltip title={`Current: ${currentLatency}ms (Baseline: ${baselineLatency}ms)`}>
      <Box
        sx={{
          width: visualBaselineWidth, // Fixed container width for the full baseline representation
          height: 8,
          backgroundColor: theme.palette.grey[300], // Background for the empty part of the bar
          borderRadius: 4,
          overflow: 'hidden', // Ensure the inner bar doesn't overflow rounded corners
          position: 'relative',
          mr: 1, // Margin right to separate from text and trend icon
        }}
      >
        <Box
          sx={{
            width: `${barWidth}px`, // Dynamic width of the actual colored bar
            height: '100%',
            backgroundColor: barColor,
            borderRadius: 4,
            transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out', // Smooth transition for updates
          }}
        />
      </Box>
    </Tooltip>
  );
};

// Interface for the OverallApiStatusGrid component props
interface OverallApiStatusGridProps {
  endpoints: Endpoint[];
  appliedStartDate: Date | null;
  appliedEndDate: Date | null;
}

// OverallApiStatusGrid component to visualize overall API health, error rate, traffic
const OverallApiStatusGrid: React.FC<OverallApiStatusGridProps> = ({ endpoints, appliedStartDate, appliedEndDate }) => {
  // Helper to determine the single overall health for an endpoint
  const getOverallHealth = (endpoint: Endpoint): 'Red' | 'Yellow' | 'Green' | 'Unknown' => {
    if (endpoint.internalHealth === 'Red' || endpoint.externalHealth === 'Red') {
      return 'Red';
    } else if (endpoint.internalHealth === 'Yellow' || endpoint.externalHealth === 'Yellow') {
      return 'Yellow';
    } else if (endpoint.internalHealth === 'Green' && endpoint.externalHealth === 'Green') {
      return 'Green';
    }
    return 'Unknown';
  };

  // Helper to get error rate color
  const getErrorRateColor = (errorRate: number) => {
    if (errorRate > 10) return theme.palette.error.main; // Critical error rate
    if (errorRate > 3) return theme.palette.warning.main; // Elevated error rate
    return theme.palette.success.main; // Acceptable error rate
  };

  // Helper to get traffic indicator color (can be adapted for more complex logic)
  const getTrafficColor = (traffic: number) => {
    if (traffic > 200) return theme.palette.primary.main; // High traffic
    if (traffic < 50) return theme.palette.warning.main; // Low traffic (might indicate an issue)
    return theme.palette.success.main; // Normal traffic
  };

  // Helper to calculate average from history based on date range
  const calculateAverage = (history: HistoryDataPoint[], startDate: Date | null, endDate: Date | null) => {
    let filteredHistory = history;
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filteredHistory = history.filter(point =>
        point.timestamp.getTime() >= start.getTime() &&
        point.timestamp.getTime() <= end.getTime()
      );
    }

    if (filteredHistory.length === 0) return 'N/A';
    const sum = filteredHistory.reduce((acc, val) => acc + val.value, 0);
    return (sum / filteredHistory.length).toFixed(1); // One decimal place
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          API Health Overview (Error Rate, Traffic)
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table aria-label="api status grid table">
            <TableHead>
              <TableRow>
                <TableCell>Server Name</TableCell><TableCell>Endpoint Name</TableCell><TableCell align="center">Overall Health</TableCell><TableCell align="right">Current Error Rate (%)</TableCell><TableCell align="right">Avg Error Rate (%)</TableCell><TableCell align="right">Traffic (RPS)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell>{endpoint.serverName}</TableCell>
                  <TableCell component="th" scope="row">
                    {endpoint.name}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={getOverallHealth(endpoint)}
                      color={
                        getOverallHealth(endpoint) === 'Green' ? 'success' :
                        getOverallHealth(endpoint) === 'Yellow' ? 'warning' :
                        getOverallHealth(endpoint) === 'Red' ? 'error' : 'default'
                      }
                      sx={{ width: 100 }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: getErrorRateColor(endpoint.errorRate), fontWeight: 500 }}>
                    {endpoint.errorRate}%
                  </TableCell>
                  <TableCell align="right">
                    {calculateAverage(endpoint.errorRateHistory, appliedStartDate, appliedEndDate)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: getTrafficColor(endpoint.traffic), fontWeight: 500 }}>
                    {endpoint.traffic}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

// New components for each section
const OverallSummaryStatus: React.FC<{ totalEndpoints: number; healthyEndpoints: number; yellowEndpoints: number; redEndpoints: number; overallStatus: string }> = ({ totalEndpoints, healthyEndpoints, yellowEndpoints, redEndpoints, overallStatus }) => (
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
);

const IndividualEndpointStatusTable: React.FC<{ endpoints: Endpoint[]; getStatusProps: Function; getTrendIcon: Function; appliedStartDate: Date | null; appliedEndDate: Date | null }> = ({ endpoints, getStatusProps, getTrendIcon, appliedStartDate, appliedEndDate }) => {
  // Filter endpoints based on the last checked date within the selected range
  const filteredEndpoints = useMemo(() => {
    if (!appliedStartDate || !appliedEndDate) {
      return endpoints;
    }
    const start = new Date(appliedStartDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(appliedEndDate);
    end.setHours(23, 59, 59, 999);

    return endpoints.filter(endpoint =>
      endpoint.lastChecked &&
      endpoint.lastChecked.getTime() >= start.getTime() &&
      endpoint.lastChecked.getTime() <= end.getTime()
    );
  }, [endpoints, appliedStartDate, appliedEndDate]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Individual Endpoint Health Status
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table stickyHeader aria-label="endpoint health table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: '150px' }}>Endpoint Name</TableCell><TableCell sx={{ minWidth: '200px' }}>URL</TableCell><TableCell align="center">Internal Health</TableCell><TableCell align="center">External Health</TableCell><TableCell align="right" sx={{ minWidth: '120px' }}>Internal Latency (ms)</TableCell><TableCell align="right" sx={{ minWidth: '120px' }}>External Latency (ms)</TableCell><TableCell align="right" sx={{ minWidth: '80px' }}>Baseline (ms)</TableCell><TableCell align="center" sx={{ minWidth: '100px' }}>Last Checked</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEndpoints.map((endpoint) => ( // Use filteredEndpoints here
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
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" sx={{ mr: 1, minWidth: '40px', textAlign: 'right' }}>
                        {endpoint.internalLatency !== null ? endpoint.internalLatency : 'N/A'}
                      </Typography>
                      {endpoint.internalLatency !== null && (
                        <LatencyBar
                          currentLatency={endpoint.internalLatency}
                          baselineLatency={endpoint.baselineLatency}
                          health={endpoint.internalHealth}
                        />
                      )}
                      {getTrendIcon(getTrend(endpoint.internalLatencyHistory))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" sx={{ mr: 1, minWidth: '40px', textAlign: 'right' }}>
                        {endpoint.externalLatency !== null ? endpoint.externalLatency : 'N/A'}
                      </Typography>
                      {endpoint.externalLatency !== null && (
                        <LatencyBar
                          currentLatency={endpoint.externalLatency}
                          baselineLatency={endpoint.baselineLatency}
                          health={endpoint.externalHealth}
                        />
                      )}
                      {getTrendIcon(getTrend(endpoint.externalLatencyHistory))}
                    </Box>
                  </TableCell>
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
  );
};

const NotificationAlerting: React.FC = () => (
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
);

const AutomatedSelfHealingActions: React.FC = () => (
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
);

// Navigation component
interface SidebarNavProps {
  onSelectView: (view: string) => void;
  activeView: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onSelectView, activeView }) => {
  const navItems = [
    { id: 'table', text: 'Endpoint Table', icon: <TableChartIcon /> },
    { id: 'grid', text: 'API Status Grid', icon: <GridOnIcon /> },
    { id: 'error_trends', text: 'Error Trends', icon: <DeveloperBoardIcon /> }, // Updated text
    { id: 'summary', text: 'Overall Summary', icon: <DashboardIcon /> },
    { id: 'notifications', text: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'selfHealing', text: 'Self-Healing', icon: <AutoFixHighIcon /> },
  ];

  return (
    <Box sx={{ width: 240, flexShrink: 0, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', height: '100vh', position: 'sticky', top: 0, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
        Dashboard Views
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeView === item.id}
              onClick={() => onSelectView(item.id)}
              sx={{ borderRadius: 2, '&.Mui-selected': { backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText, '& .MuiListItemIcon-root': { color: theme.palette.primary.contrastText } } }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

// Custom Mini Trend Graph component
interface MiniTrendGraphProps {
  history: HistoryDataPoint[]; // Updated to use HistoryDataPoint[]
  label: string;
  unit: string;
  color: string; // Keep this for the line color
  appliedStartDate: Date | null;
  appliedEndDate: Date | null;
}

const MiniTrendGraph: React.FC<MiniTrendGraphProps> = ({ history, label, unit, color, appliedStartDate, appliedEndDate }) => {
  // Filter history based on selected date range
  const filteredHistory = useMemo(() => {
    if (!appliedStartDate || !appliedEndDate) {
      return history; // If no date range applied, show full history
    }
    // Set hours to start and end of day for accurate filtering
    const start = new Date(appliedStartDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(appliedEndDate);
    end.setHours(23, 59, 59, 999);

    return history.filter(point =>
      point.timestamp.getTime() >= start.getTime() &&
      point.timestamp.getTime() <= end.getTime()
    );
  }, [history, appliedStartDate, appliedEndDate]);

  if (filteredHistory.length === 0) {
    console.log(`MiniTrendGraph: No data available for ${label} within selected date range.`); // Debugging log
    return (
      <Box sx={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'grey.400', borderRadius: 2, p: 2 }}>
        <Typography variant="body2">No data available for selected date range.</Typography>
      </Box>
    );
  }

  // Format data for Recharts: convert timestamp to a readable string for XAxis
  const chartData = filteredHistory.map(point => ({
    value: point.value,
    date: point.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Use 'date' as the dataKey for XAxis
    fullDate: point.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), // Added fullDate for tooltip
  }));

  return (
    <Box sx={{ width: '100%', height: 100 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`color${label}`} x1="0" y1="0" x2="0" y2="1">
              {/* Use the 'color' prop for the line, and theme.palette.grey[300] for the fill */}
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.palette.grey[300]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <RechartsTooltip // Using the aliased RechartsTooltip
            labelFormatter={(labelValue, payload) => {
              // The labelValue here is the 'date' property from chartData
              // The payload contains the full data point, including 'fullDate'
              if (payload && payload.length > 0 && payload[0].payload && payload[0].payload.fullDate) {
                return `Date: ${payload[0].payload.fullDate}`;
              }
              return `Date: ${labelValue}`; // Fallback
            }}
            formatter={(value) => [`${value} ${unit}`, label]}
          />
          {/* Use the 'color' prop for the stroke, and the gradient for the fill */}
          <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill="#607d8b" strokeWidth={2} dot={false} />
          {/* XAxis is hidden for mini graphs but can be useful for debugging */}
          {/* <XAxis dataKey="date" hide /> */}
          {/* YAxis is hidden for mini graphs */}
          {/* <YAxis hide /> */}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

// Component for Error Rate Trends
interface ErrorTrendsProps {
  endpoints: Endpoint[];
  appliedStartDate: Date | null;
  appliedEndDate: Date | null;
}

const ErrorTrends: React.FC<ErrorTrendsProps> = ({ endpoints, appliedStartDate, appliedEndDate }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Error Rate Trends
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          {endpoints.map((endpoint, index) => (
            <Card key={endpoint.id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>{endpoint.name}</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Error Rate Trend ({endpoint.errorRate}%)</Typography>
                  <MiniTrendGraph
                    history={endpoint.errorRateHistory}
                    label="Error Rate"
                    unit="%"
                    color={theme.palette.primary.main} // Navy blue line
                    appliedStartDate={appliedStartDate}
                    appliedEndDate={appliedEndDate}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};


const App: React.FC = () => {
  // State for date range (now storing as string for TextField compatibility)
  const [startDateString, setStartDateString] = useState<string>('');
  const [endDateString, setEndDateString] = useState<string>('');
  // State for server name filter
  const [serverNameFilter, setServerNameFilter] = useState<string>('');


  // States for applied date range (used for filtering)
  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(null);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(null);
  // State for applied server name filter
  const [appliedServerNameFilter, setAppliedServerNameFilter] = useState<string>('');


  // State for live endpoint data, continuously updated
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);

  // State to hold the snapshot of endpoints used for trends when filter is applied
  const [displayedEndpoints, setDisplayedEndpoints] = useState<Endpoint[]>(() => {
    // Initialize displayedEndpoints with a snapshot of initialEndpoints' histories
    return initialEndpoints.map(endpoint => ({
      ...endpoint,
      internalLatencyHistory: [...endpoint.internalLatencyHistory],
      externalLatencyHistory: [...endpoint.externalLatencyHistory],
      errorRateHistory: [...endpoint.errorRateHistory],
    }));
  });

  // State for active view in the sidebar navigation
  const [activeView, setActiveView] = useState<string>('summary'); // Default view


  // useRef for the interval ID
  const intervalRef = useRef<number | null>(null);

  // Get unique server names for the filter dropdown
  const uniqueServerNames = useMemo(() => {
    const names = new Set<string>();
    initialEndpoints.forEach(endpoint => names.add(endpoint.serverName));
    return Array.from(names).sort();
  }, []);


  // Function to update endpoint data
  const updateEndpointData = useCallback(() => {
    setEndpoints((prevEndpoints) =>
      prevEndpoints.map((endpoint) => {
        const internalSim = simulateApiCall(endpoint.baselineLatency);
        const externalSim = simulateApiCall(endpoint.baselineLatency * 1.2); // External usually higher

        // Update history, keeping only the last MAX_HISTORY_LENGTH entries
        const newInternalLatencyHistory = [...endpoint.internalLatencyHistory, { value: internalSim.latency, timestamp: new Date() }].slice(-MAX_HISTORY_LENGTH);
        const newExternalLatencyHistory = [...endpoint.externalLatencyHistory, { value: externalSim.latency, timestamp: new Date() }].slice(-MAX_HISTORY_LENGTH);
        const newErrorRateHistory = [...endpoint.errorRateHistory, { value: internalSim.errorRate, timestamp: new Date() }].slice(-MAX_HISTORY_LENGTH);

        return {
          ...endpoint,
          internalLatency: internalSim.latency,
          externalLatency: externalSim.latency, // Corrected to externalSim.latency
          internalHealth: internalSim.health,
          externalHealth: externalSim.health,
          errorRate: internalSim.errorRate,
          traffic: internalSim.traffic,
          lastChecked: new Date(),
          internalLatencyHistory: newInternalLatencyHistory,
          externalLatencyHistory: newExternalLatencyHistory,
          errorRateHistory: newErrorRateHistory,
        };
      })
    );
  }, []);

  // Set up interval for data updates (for live metrics and history accumulation)
  useEffect(() => {
    console.log("App component mounted. Starting data updates."); // Debugging log
    // Initial data load
    updateEndpointData();

    // Set interval to update data every 5 seconds
    intervalRef.current = window.setInterval(updateEndpointData, 5000); // Re-enabled interval

    // Clean up interval on component unmount
    return () => {
      console.log("App component unmounted. Clearing data update interval."); // Debugging log
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [updateEndpointData]);


  // Handler for "Apply Filter" button
  const handleApplyFilter = () => {
    const newStartDate = startDateString ? new Date(startDateString) : null;
    const newEndDate = endDateString ? new Date(endDateString) : null;

    setAppliedStartDate(newStartDate);
    setAppliedEndDate(newEndDate);
    setAppliedServerNameFilter(serverNameFilter); // Apply server name filter

    // Create a snapshot of the current 'endpoints' data to be used for trends
    // Filter by server name before creating the snapshot
    const filteredByServer = endpoints.filter(endpoint =>
      serverNameFilter === '' || endpoint.serverName === serverNameFilter
    );

    setDisplayedEndpoints(filteredByServer.map(endpoint => ({
      ...endpoint,
      internalLatencyHistory: [...endpoint.internalLatencyHistory],
      externalLatencyHistory: [...endpoint.externalLatencyHistory],
      errorRateHistory: [...endpoint.errorRateHistory],
    })));
  };

  // Handler for "Clear Dates" button
  const handleClearDates = () => {
    setStartDateString('');
    setEndDateString('');
    setServerNameFilter(''); // Clear server name filter
    setAppliedStartDate(null);
    setAppliedEndDate(null);
    setAppliedServerNameFilter(''); // Clear applied server name filter

    // When dates are cleared, revert displayed trends to a snapshot of the current full history (no server filter)
    setDisplayedEndpoints(endpoints.map(endpoint => ({
      ...endpoint,
      internalLatencyHistory: [...endpoint.internalLatencyHistory],
      externalLatencyHistory: [...endpoint.externalLatencyHistory],
      errorRateHistory: [...endpoint.errorRateHistory],
    })));
  };

  // Calculate overall status
  // These calculations should ideally use the 'endpoints' (live data), not 'displayedEndpoints'
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

  let overallStatus = 'Operational';
  if (redEndpoints > 0) {
    overallStatus = 'Critical';
  } else if (yellowEndpoints > 0) {
    overallStatus = 'Degraded';
  }

  // Helper to get Chip props based on health status
  const getStatusProps = (health: 'Red' | 'Yellow' | 'Green' | 'Unknown') => {
    switch (health) {
      case 'Green':
        return { label: 'Healthy', color: 'success', icon: <CheckCircleOutlineIcon /> };
      case 'Yellow':
        return { label: 'Degraded', color: 'warning', icon: <WarningAmberIcon /> };
      case 'Red':
        return { label: 'Critical', color: 'error', icon: <ErrorOutlineIcon /> };
      default:
        return { label: 'Unknown', color: 'default', icon: <HorizontalRuleIcon /> };
    }
  };

  // Helper to get trend icon
  const getTrendIcon = (trend: 'improving' | 'degrading' | 'stable' | 'unknown') => {
    switch (trend) {
      case 'improving':
        return <Tooltip title="Improving"><ArrowUpwardIcon color="success" fontSize="small" /></Tooltip>;
      case 'degrading':
        return <Tooltip title="Degrading"><ArrowDownwardIcon color="error" fontSize="small" /></Tooltip>;
      case 'stable':
        return <Tooltip title="Stable"><HorizontalRuleIcon color="action" fontSize="small" /></Tooltip>;
      default:
        return <Tooltip title="Unknown Trend"><HorizontalRuleIcon color="disabled" fontSize="small" /></Tooltip>;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <SidebarNav onSelectView={setActiveView} activeView={activeView} />
        <Container component="main" maxWidth="xl" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
            API Monitoring Dashboard
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-end' }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDateString}
              onChange={(e) => setStartDateString(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDateString}
              onChange={(e) => setEndDateString(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="server-name-select-label">Server Name</InputLabel>
              <Select
                labelId="server-name-select-label"
                id="server-name-select"
                value={serverNameFilter}
                label="Server Name"
                onChange={(e) => setServerNameFilter(e.target.value as string)}
              >
                <MenuItem value=""><em>All Servers</em></MenuItem>
                {uniqueServerNames.map((name) => (
                  <MenuItem key={name} value={name}>{name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleApplyFilter}
              disabled={!startDateString && !endDateString && !serverNameFilter}
              sx={{ height: 56 }}
            >
              Apply Filter
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearDates}
              disabled={!startDateString && !endDateString && !appliedStartDate && !appliedEndDate && !serverNameFilter}
              sx={{ height: 56 }}
            >
              Clear Dates
            </Button>
          </Box>

          {activeView === 'summary' && (
            <OverallSummaryStatus
              totalEndpoints={totalEndpoints}
              healthyEndpoints={healthyEndpoints}
              yellowEndpoints={yellowEndpoints}
              redEndpoints={redEndpoints}
              overallStatus={overallStatus}
            />
          )}

          {activeView === 'table' && (
            <IndividualEndpointStatusTable
              endpoints={displayedEndpoints}
              getStatusProps={getStatusProps}
              getTrendIcon={getTrendIcon}
              appliedStartDate={appliedStartDate}
              appliedEndDate={appliedEndDate}
            />
          )}

          {activeView === 'grid' && (
            <OverallApiStatusGrid
              endpoints={displayedEndpoints}
              appliedStartDate={appliedStartDate}
              appliedEndDate={appliedEndDate}
            />
          )}

          {activeView === 'error_trends' && (
            <ErrorTrends
              endpoints={displayedEndpoints}
              appliedStartDate={appliedStartDate}
              appliedEndDate={appliedEndDate}
            />
          )}

          {activeView === 'notifications' && <NotificationAlerting />}

          {activeView === 'selfHealing' && <AutomatedSelfHealingActions />}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
