import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Tooltip,
  Button, // Added for navigation buttons
  List,    // Added for navigation list
  ListItem, // Added for navigation list items
  ListItemButton, // Added for navigation list item buttons
  ListItemIcon, // Added for icons in navigation
  ListItemText, // Added for text in navigation
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import AnalyticsIcon from '@mui/icons-material/Analytics'; // For traffic
import BugReportIcon from '@mui/icons-material/BugReport'; // For errors
import MemoryIcon from '@mui/icons-material/Memory'; // For memory usage
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard'; // For CPU usage
import DashboardIcon from '@mui/icons-material/Dashboard'; // For Overall Summary
import TableChartIcon from '@mui/icons-material/TableChart'; // For Endpoint Table
import GridOnIcon from '@mui/icons-material/GridOn'; // For Overall Grid
import NotificationsIcon from '@mui/icons-material/Notifications'; // For Notifications
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'; // For Self-Healing

// Import Recharts components
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip, // Renamed to avoid conflict with Material-UI Tooltip
  Legend,
  ResponsiveContainer,
} from 'recharts';


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
  errorRate: number; // New: Percentage of errors (0-100)
  traffic: number; // New: Simulated requests per second (RPS)
  cpuUsage: number; // New: Simulated CPU usage (0-100%)
  memoryUsage: number; // New: Simulated Memory usage (0-100%)
  errorRateHistory: number[]; // New: Store history for error rate
  cpuUsageHistory: number[]; // New: Store history for CPU usage
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
    errorRate: 0, // Initial error rate
    traffic: 0, // Initial traffic
    cpuUsage: 0, // Initial CPU usage
    memoryUsage: 0, // Initial Memory usage
    errorRateHistory: [],
    cpuUsageHistory: [],
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
    errorRate: 0,
    traffic: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    errorRateHistory: [],
    cpuUsageHistory: [],
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
    errorRate: 0,
    traffic: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    errorRateHistory: [],
    cpuUsageHistory: [],
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
    errorRate: 0,
    traffic: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    errorRateHistory: [],
    cpuUsageHistory: [],
  },
];

// Helper function to simulate API call and determine health status based on latency
const simulateApiCall = (baseline: number): { latency: number; health: 'Red' | 'Yellow' | 'Green'; errorRate: number; traffic: number; cpuUsage: number; memoryUsage: number } => {
  const randomFactor = Math.random();
  let latency: number;
  let health: 'Red' | 'Yellow' | 'Green';
  let errorRate: number;
  let traffic: number;
  let cpuUsage: number;
  let memoryUsage: number;

  if (randomFactor < 0.7) {
    // Green: Latency within or slightly below baseline (80%-100% of baseline)
    latency = baseline * (0.8 + Math.random() * 0.2);
    health = 'Green';
    errorRate = Math.round(Math.random() * 2); // 0-2% error
    traffic = Math.round(50 + Math.random() * 100); // 50-150 RPS (normal)
    cpuUsage = Math.round(20 + Math.random() * 30); // 20-50% CPU
    memoryUsage = Math.round(30 + Math.random() * 40); // 30-70% Memory
  } else if (randomFactor < 0.9) {
    // Yellow: Latency 100-200% of baseline (degraded but not critical)
    latency = baseline * (1.0 + Math.random() * 1.0);
    health = 'Yellow';
    errorRate = Math.round(3 + Math.random() * 7); // 3-10% error
    traffic = Math.round(100 + Math.random() * 200); // 100-300 RPS (moderate to high)
    cpuUsage = Math.round(50 + Math.random() * 30); // 50-80% CPU
    memoryUsage = Math.round(60 + Math.random() * 30); // 60-90% Memory
  } else {
    // Red: Latency >200% of baseline (critical or very slow)
    latency = baseline * (2.0 + Math.random() * 2.0);
    health = 'Red';
    errorRate = Math.round(10 + Math.random() * 20); // 10-30% error
    traffic = Math.round(20 + Math.random() * 50); // 20-70 RPS (potentially low due to errors or very high burst, or very high traffic leading to issues)
    cpuUsage = Math.round(80 + Math.random() * 15); // 80-95% CPU
    memoryUsage = Math.round(85 + Math.random() * 10); // 85-95% Memory
  }

  // Add some slight extra randomness for more variability in latency
  latency += Math.random() * 20;

  return { latency: Math.round(latency), health, errorRate, traffic, cpuUsage, memoryUsage };
};

// Helper function to determine trend based on recent history
const getTrend = (history: number[]): 'improving' | 'degrading' | 'stable' | 'unknown' => {
  if (history.length < 2) {
    return 'unknown'; // Need at least two historical points (current and one previous)
  }

  const current = history[history.length - 1];
  const prev = history[history.length - 2];

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
}

// OverallApiStatusGrid component to visualize overall API health, error rate, traffic, CPU, and Memory
const OverallApiStatusGrid: React.FC<OverallApiStatusGridProps> = ({ endpoints }) => {
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

  // Helper to get CPU/Memory usage color
  const getResourceUsageColor = (usage: number) => {
    if (usage > 85) return theme.palette.error.main; // High usage
    if (usage > 60) return theme.palette.warning.main; // Moderate usage
    return theme.palette.success.main; // Normal usage
  };

  // Helper to calculate average from history
  const calculateAverage = (history: number[]) => {
    if (history.length === 0) return 'N/A';
    const sum = history.reduce((acc, val) => acc + val, 0);
    return (sum / history.length).toFixed(1); // One decimal place
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          API Health Overview (Error Rate, Traffic, CPU & Memory)
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table aria-label="api status grid table">
            <TableHead>
              <TableRow>
                <TableCell>Endpoint Name</TableCell>
                <TableCell align="center">Overall Health</TableCell>
                <TableCell align="right">Current Error Rate (%)</TableCell>
                <TableCell align="right">Avg Error Rate (%)</TableCell>
                <TableCell align="right">Traffic (RPS)</TableCell>
                <TableCell align="right">Current CPU Usage (%)</TableCell>
                <TableCell align="right">Avg CPU Usage (%)</TableCell>
                <TableCell align="right">Current Memory Usage (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((endpoint) => (
                <TableRow key={endpoint.id}>
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
                    {calculateAverage(endpoint.errorRateHistory)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: getTrafficColor(endpoint.traffic), fontWeight: 500 }}>
                    {endpoint.traffic}
                  </TableCell>
                  <TableCell align="right" sx={{ color: getResourceUsageColor(endpoint.cpuUsage), fontWeight: 500 }}>
                    {endpoint.cpuUsage}%
                  </TableCell>
                  <TableCell align="right">
                    {calculateAverage(endpoint.cpuUsageHistory)}
                  </TableCell>
                  <TableCell align="right" sx={{ color: getResourceUsageColor(endpoint.memoryUsage), fontWeight: 500 }}>
                    {endpoint.memoryUsage}%
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

const IndividualEndpointStatusTable: React.FC<{ endpoints: Endpoint[]; getStatusProps: Function; getTrendIcon: Function }> = ({ endpoints, getStatusProps, getTrendIcon }) => (
  <Card>
    <CardContent>
      <Typography variant="h5" gutterBottom>
        Individual Endpoint Health Status
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table stickyHeader aria-label="endpoint health table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: '150px' }}>Endpoint Name</TableCell>
              <TableCell sx={{ minWidth: '200px' }}>URL</TableCell>
              <TableCell align="center">Internal Health</TableCell>
              <TableCell align="center">External Health</TableCell>
              <TableCell align="right" sx={{ minWidth: '120px' }}>Internal Latency (ms)</TableCell>
              <TableCell align="right" sx={{ minWidth: '120px' }}>External Latency (ms)</TableCell>
              <TableCell align="right" sx={{ minWidth: '80px' }}>Baseline (ms)</TableCell>
              <TableCell align="center" sx={{ minWidth: '100px' }}>Last Checked</TableCell>
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
    { id: 'summary', text: 'Overall Summary', icon: <DashboardIcon /> },
    { id: 'table', text: 'Endpoint Table', icon: <TableChartIcon /> },
    { id: 'grid', text: 'API Status Grid', icon: <GridOnIcon /> },
    { id: 'error_cpu_charts', text: 'Error/CPU Trends', icon: <DeveloperBoardIcon /> },
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

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#d0ed57', '#a4de6c',
  '#00c49f', '#ffbb28', '#FF8042', '#AF19FF', '#FF19A3',
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'
];
const MAX_HISTORY_LENGTH = 5;

const CustomChartLabel = ({ x, y, stroke, value }: any) => {
  return (
    <text x={x} y={y} dy={-10} fill={stroke} fontSize={12} textAnchor="middle">
      {value}
    </text>
  );
};


const App: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  const [loading, setLoading] = useState<boolean>(true);
  const intervalRef = useRef<number | null>(null);
  const [activeView, setActiveView] = useState<string>('summary');

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

  const updateEndpointStatus = () => {
    setLoading(true);
    const updatedEndpoints = endpoints.map((endpoint) => {
      const { latency: internalLatency, health: internalHealth, errorRate, traffic, cpuUsage, memoryUsage } = simulateApiCall(endpoint.baselineLatency);
      const { latency: externalLatency, health: externalHealth } = simulateApiCall(endpoint.baselineLatency);

      const newInternalLatencyHistory = [...endpoint.internalLatencyHistory, internalLatency].slice(-MAX_HISTORY_LENGTH);
      const newExternalLatencyHistory = [...endpoint.externalLatencyHistory, externalLatency].slice(-MAX_HISTORY_LENGTH);
      const newErrorRateHistory = [...endpoint.errorRateHistory, errorRate].slice(-MAX_HISTORY_LENGTH);
      const newCpuUsageHistory = [...endpoint.cpuUsageHistory, cpuUsage].slice(-MAX_HISTORY_LENGTH);

      return {
        ...endpoint,
        internalLatency,
        internalHealth,
        externalLatency,
        externalHealth,
        lastChecked: new Date(),
        internalLatencyHistory: newInternalLatencyHistory,
        externalLatencyHistory: newExternalLatencyHistory,
        errorRate,
        traffic,
        cpuUsage,
        memoryUsage,
        errorRateHistory: newErrorRateHistory,
        cpuUsageHistory: newCpuUsageHistory,
      };
    });
    setEndpoints(updatedEndpoints);
    setTimeout(() => setLoading(false), 500);
  };

  useEffect(() => {
    updateEndpointStatus();
    intervalRef.current = window.setInterval(updateEndpointStatus, 15000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  const combinedErrorRateChartData = useMemo(() => {
    const dataPoints: { name: string; [key: string]: number | string | null }[] = []; // Changed type to include null
    for (let i = 0; i < MAX_HISTORY_LENGTH; i++) {
      const dataPoint: { name: string; [key: string]: number | string | null } = { name: `Check ${i + 1}` };
      endpoints.forEach((endpoint) => {
        dataPoint[`${endpoint.name}`] = endpoint.errorRateHistory[i] !== undefined ? endpoint.errorRateHistory[i] : null; // Ensure null if undefined
      });
      dataPoints.push(dataPoint);
    }
    return dataPoints;
  }, [endpoints]);

  const allErrorRateDataKeys = useMemo(() => {
    const keys: string[] = [];
    endpoints.forEach(endpoint => {
      keys.push(`${endpoint.name}`);
    });
    return keys;
  }, [endpoints]);

  const combinedCpuUsageChartData = useMemo(() => {
    const dataPoints: { name: string; [key: string]: number | string | null }[] = []; // Changed type to include null
    for (let i = 0; i < MAX_HISTORY_LENGTH; i++) {
      const dataPoint: { name: string; [key: string]: number | string | null } = { name: `Check ${i + 1}` };
      endpoints.forEach((endpoint) => {
        dataPoint[`${endpoint.name}`] = endpoint.cpuUsageHistory[i] !== undefined ? endpoint.cpuUsageHistory[i] : null; // Ensure null if undefined
      });
      dataPoints.push(dataPoint);
    }
    return dataPoints;
  }, [endpoints]);

  const allCpuUsageDataKeys = useMemo(() => {
    const keys: string[] = [];
    endpoints.forEach(endpoint => {
      keys.push(`${endpoint.name}`);
    });
    return keys;
  }, [endpoints]);

  // Memoized data for the single combined Latency graph
  const combinedLatencyChartData = useMemo(() => {
    const dataPoints: { name: string; [key: string]: number | string | null }[] = []; // Changed type to include null
    for (let i = 0; i < MAX_HISTORY_LENGTH; i++) {
      const dataPoint: { name: string; [key: string]: number | string | null } = { name: `Check ${i + 1}` };
      endpoints.forEach((endpoint) => {
        dataPoint[`${endpoint.name} (Internal)`] = endpoint.internalLatencyHistory[i] !== undefined ? endpoint.internalLatencyHistory[i] : null;
        dataPoint[`${endpoint.name} (External)`] = endpoint.externalLatencyHistory[i] !== undefined ? endpoint.externalLatencyHistory[i] : null;
      });
      dataPoints.push(dataPoint);
    }
    return dataPoints;
  }, [endpoints]);

  const allLatencyDataKeys = useMemo(() => {
    const keys: string[] = [];
    endpoints.forEach(endpoint => {
      keys.push(`${endpoint.name} (Internal)`);
      keys.push(`${endpoint.name} (External)`);
    });
    return keys;
  }, [endpoints]);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
        {/* Left Vertical Navigation */}
        <SidebarNav onSelectView={setActiveView} activeView={activeView} />

        {/* Main Content Area */}
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1, overflowY: 'auto' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: theme.palette.primary.main }}>
            API Performance Monitoring Dashboard
          </Typography>

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
              <CircularProgress size={60} sx={{ mb: 2 }} />
              <Typography variant="h6">Simulating API Checks...</Typography>
              <Typography variant="body2" color="textSecondary">Updates every 15 seconds</Typography>
            </Box>
          )}

          {!loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                  endpoints={endpoints}
                  getStatusProps={getStatusProps}
                  getTrendIcon={getTrendIcon}
                />
              )}
              {activeView === 'grid' && (
                <OverallApiStatusGrid endpoints={endpoints} />
              )}

              {activeView === 'error_cpu_charts' && (
                <>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Consolidated Error Rate Trends (Last {MAX_HISTORY_LENGTH} Checks)
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 350, maxHeight: 450, width: '100%' }}>
                        <ResponsiveContainer width="95%" height="95%">
                          <LineChart
                            data={combinedErrorRateChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Error Rate (%)', angle: -90, position: 'insideLeft' }} />
                            <RechartsTooltip />
                            <Legend />
                            {allErrorRateDataKeys.map((key, index) => (
                              <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                label={<CustomChartLabel />}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Consolidated CPU Usage Trends (Last {MAX_HISTORY_LENGTH} Checks)
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 350, maxHeight: 450, width: '100%' }}>
                        <ResponsiveContainer width="95%" height="95%">
                          <LineChart
                            data={combinedCpuUsageChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'CPU Usage (%)', angle: -90, position: 'insideLeft' }} />
                            <RechartsTooltip />
                            <Legend />
                            {allCpuUsageDataKeys.map((key, index) => (
                              <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={COLORS[(index + 2) % COLORS.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                label={<CustomChartLabel />}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </CardContent>
                  </Card>
                </>
              )}

              {activeView === 'notifications' && (
                <NotificationAlerting />
              )}
              {activeView === 'selfHealing' && (
                <AutomatedSelfHealingActions />
              )}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
