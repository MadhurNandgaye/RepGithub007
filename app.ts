import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputAdornment,
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
import NotificationsIcon from '@mui/icons-material/Notifications';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PersonIcon from '@mui/icons-material/Person';
import { Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon } from '@mui/icons-material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList'; // New icon for filtered data view


import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { blueGrey } from '@mui/material/colors';


// --- Start of Simulated Backend Data (Moved here for direct access in App) ---
// This data would typically come from a real database or backend service.
const allDummyAPIData = [
  { id: 'data-001', value: 100, type: 'metric', project: 'Project Alpha', server: 'Server A for Project Alpha', timestamp: new Date('2025-07-20T10:00:00Z') },
  { id: 'data-002', value: 120, type: 'log', project: 'Project Alpha', server: 'Server A for Project Alpha', timestamp: new Date('2025-07-21T11:30:00Z') },
  { id: 'data-003', value: 80, type: 'metric', project: 'Project Beta', server: 'Server C for Project Beta', timestamp: new Date('2025-07-22T14:00:00Z') },
  { id: 'data-004', value: 150, type: 'log', project: 'Project Alpha', server: 'Server B for Project Alpha', timestamp: new Date('2025-07-23T09:15:00Z') },
  { id: 'data-005', value: 90, type: 'metric', project: 'Project Gamma', server: 'Server D for Project Gamma', timestamp: new Date('2025-07-24T16:45:00Z') },
  { id: 'data-006', value: 110, type: 'log', project: 'Project Beta', server: 'Server C for Project Beta', timestamp: new Date('2025-07-25T08:00:00Z') },
  { id: 'data-007', value: 130, type: 'metric', project: 'Project Delta', server: 'Server F for Project Delta', timestamp: new Date('2025-07-26T12:00:00Z') },
  { id: 'data-008', value: 70, type: 'log', project: 'Project Alpha', server: 'Server A for Project Alpha', timestamp: new Date('2025-07-27T17:00:00Z') },
  { id: 'data-009', value: 140, type: 'metric', project: 'Project Gamma', server: 'Server E for Project Gamma', timestamp: new Date('2025-07-28T09:00:00Z') },
  { id: 'data-010', value: 95, type: 'log', project: 'Project Alpha', server: 'Server B for Project Alpha', timestamp: new Date('2025-07-28T10:30:00Z') },
  { id: 'data-011', value: 105, type: 'metric', project: 'Project Beta', server: 'Server C for Project Beta', timestamp: new Date('2025-07-28T11:00:00Z') },
  { id: 'data-012', value: 115, type: 'log', project: 'Project Delta', server: 'Server F for Project Delta', timestamp: new Date('2025-07-28T12:00:00Z') },
  { id: 'data-013', value: 125, type: 'metric', project: 'Project Alpha', server: 'Server A for Project Alpha', timestamp: new Date('2025-07-28T13:00:00Z') },
  { id: 'data-014', value: 85, type: 'log', project: 'Project Gamma', server: 'Server D for Project Gamma', timestamp: new Date('2025-07-28T14:00:00Z') },
];

// --- End of Simulated Backend Data ---

/**
 * Interface for the filters that can be applied to the data fetch.
 */
interface DataFilters {
  project?: string;
  server?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

/**
 * Interface for the structure of the data records.
 */
interface DataRecord {
  id: string;
  value: number;
  type: string;
  project: string;
  server: string;
  timestamp: Date;
}

/**
 * Simulates an asynchronous API call to fetch filtered data from an endpoint
 * with dummy path parameters, using a mock Axios-like behavior.
 *
 * @param {DataFilters} filters - An object containing filters for the data.
 * @returns {Promise<DataRecord[]>} A promise that resolves with an array of DataRecord objects.
 * @throws {Error} If a simulated network error occurs or no data is found for the given parameters.
 */
const fetchFilteredDataFromAPI = async (filters: DataFilters): Promise<DataRecord[]> => {
  // Simulate network delay (e.g., 1 second)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Construct a dummy API URL with path parameters.
  // In a real scenario, you'd use a base URL and append parameters.
  // For demonstration, we'll use placeholder path parameters.
  const dummyProjectParam = filters.project ? encodeURIComponent(filters.project) : 'all';
  const dummyServerParam = filters.server ? encodeURIComponent(filters.server) : 'all';
  const dummyApiUrl = `https://api.example.com/v1/data/${dummyProjectParam}/${dummyServerParam}`;

  console.log(`Simulating API call to: ${dummyApiUrl} with filters:`, filters);

  // Simulate a network error occasionally
  if (Math.random() < 0.1) { // 10% chance of simulated network error
    throw new Error('Simulated Network Error: Failed to connect to the API.');
  }

  let filteredData = allDummyAPIData;

  // Apply filters to the dummy data
  if (filters.project) {
    filteredData = filteredData.filter(record => record.project === filters.project);
  }
  if (filters.server) {
    filteredData = filteredData.filter(record => record.server === filters.server);
  }
  if (filters.startDate) {
    filteredData = filteredData.filter(record => record.timestamp.getTime() >= filters.startDate!.getTime());
  }
  if (filters.endDate) {
    // Ensure endDate includes the entire day by setting time to end of day
    const endOfDay = new Date(filters.endDate.getTime());
    endOfDay.setHours(23, 59, 59, 999);
    filteredData = filteredData.filter(record => record.timestamp.getTime() <= endOfDay.getTime());
  }

  if (filteredData.length === 0) {
    // Simulate a "not found" scenario if no data matches filters
    return [];
  }

  // Simulate a successful response
  // In a real Axios call, this would be `response.data`
  return filteredData;
};


const lightTheme = createTheme({
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
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    grey: {
      300: '#e0e0e0',
      500: '#9e9e9e',
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
          backgroundColor: '#e0e0e0',
        },
      },
    },
  },
});

const darkTheme = createTheme({
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
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    success: {
      main: '#81c784',
    },
    warning: {
      main: '#ffb74d',
    },
    error: {
      main: '#e57373',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    grey: {
      300: '#424242',
      500: '#bdbdbd',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
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
          backgroundColor: '#333333',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    // Added style overrides for TextField to attempt to style native date input icon
    MuiTextField: {
      styleOverrides: {
        root: {
          // Target the native calendar picker indicator for WebKit browsers
          '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator': {
            filter: 'invert(1)', // Invert color for dark theme
          },
          // Ensure the input text color is white in dark theme
          '& .MuiInputBase-input[type="date"]': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

interface HistoryDataPoint {
  value: number;
  timestamp: Date;
}

interface Endpoint {
  id: string;
  name: string;
  url: string;
  baselineLatency: number;
  internalLatency: number | null;
  externalLatency: number | null;
  internalHealth: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  externalHealth: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  lastChecked: Date | null;
  internalLatencyHistory: HistoryDataPoint[];
  externalLatencyHistory: HistoryDataPoint[];
  errorRate: number;
  traffic: number;
  errorRateHistory: HistoryDataPoint[];
  serverName: string;
  projectName: string;
}

const MAX_HISTORY_POINTS = 60;
const HISTORY_SPAN_DAYS = 7;

const generateDummyHistory = (
  length: number,
  baseValue: number,
  amplitude: number,
  frequency: number,
  randomness: number,
  referenceDate: Date
): HistoryDataPoint[] => {
  const history: HistoryDataPoint[] = [];
  const historySpanMs = HISTORY_SPAN_DAYS * 24 * 60 * 60 * 1000;
  const startTime = referenceDate.getTime() - historySpanMs;

  for (let i = 0; i < length; i++) {
    const value = Math.max(0, baseValue + Math.sin(i * frequency) * amplitude + Math.random() * randomness);
    const timestamp = new Date(startTime + (i * (historySpanMs / length)));
    history.push({ value: parseFloat(value.toFixed(1)), timestamp });
  }
  return history;
};

const generateInitialEndpoints = (): Endpoint[] => {
  const endpoints: Endpoint[] = [];
  const projectNames = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta'];
  const serversPerProject = 2;
  const endpointsPerServer = 6;
  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  const apiPaths = [
    '/users/{id}', '/products/search', '/orders', '/auth/login', '/data/analytics',
    '/swagger/swagger-ui.css', '/swagger/swagger-ui-bundle.js', '/api/v1/health',
    '/payments/process', '/notifications/send', '/dtocr/legalparser',
    '/authentication/getbeartoken', '/reports/daily', '/inventory/update',
    '/customers/{id}/profile', '/billing/invoice', '/support/ticket',
    '/metrics/cpu', '/logs/errors', '/admin/settings',
    '/search/documents', '/files/upload', '/streams/live',
    '/analytics/events', '/dashboard/summary', '/config/get',
    '/status/check', '/users/register', '/products/add',
    '/orders/track', '/auth/logout', '/data/export',
    '/swagger/index.html', '/api/v2/status', '/payments/refund',
    '/notifications/read', '/dtocr/legalvalidator', '/authentication/refresh',
    '/reports/monthly', '/inventory/lookup', '/customers/new',
    '/billing/statement', '/support/faq', '/metrics/memory',
    '/logs/access', '/admin/users', '/search/articles',
    '/files/download', '/streams/archive', '/analytics/users',
    '/dashboard/details', '/config/set', '/status/ping'
  ];

  let endpointIdCounter = 1;

  for (const projectName of projectNames) {
    for (let s = 1; s <= serversPerProject; s++) {
      const serverName = `Server ${String.fromCharCode(64 + s)} for ${projectName}`;
      for (let e = 1; e <= endpointsPerServer; e++) {
        const baseline = Math.floor(Math.random() * (250 - 50 + 1)) + 50;
        const randomMethod = httpMethods[Math.floor(Math.random() * httpMethods.length)];
        const randomPath = apiPaths[Math.floor(Math.random() * apiPaths.length)];
        
        const endpointName = `${randomMethod} ${randomPath} (Endpoint ${e})`;

        const now = new Date();
        const randomDaysAgo = Math.floor(Math.random() * 60);
        const initialLastChecked = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
        initialLastChecked.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0);

        endpoints.push({
          id: String(endpointIdCounter++),
          name: endpointName,
          url: `https://api.example.com/${projectName.toLowerCase().replace(' ', '-')}/${serverName.toLowerCase().replace(' ', '-')}${randomPath}`,
          baselineLatency: baseline,
          internalLatency: null,
          externalLatency: null,
          internalHealth: 'Unknown',
          externalHealth: 'Unknown',
          lastChecked: initialLastChecked,
          internalLatencyHistory: generateDummyHistory(MAX_HISTORY_POINTS, baseline, baseline * 0.2, 0.5, 10, initialLastChecked),
          externalLatencyHistory: generateDummyHistory(MAX_HISTORY_POINTS, baseline * 1.2, baseline * 0.25, 0.5, 10, initialLastChecked),
          errorRate: 0,
          traffic: 0,
          errorRateHistory: generateDummyHistory(MAX_HISTORY_POINTS, 5, 3, 0.3, 1, initialLastChecked),
          serverName: serverName,
          projectName: projectName,
        });
      }
    }
  }
  return endpoints;
};

const initialEndpoints: Endpoint[] = generateInitialEndpoints();


const simulateApiCall = (baseline: number): { latency: number; health: 'Red' | 'Yellow' | 'Green'; errorRate: number; traffic: number } => {
  const randomFactor = Math.random();
  let latency: number;
  let health: 'Red' | 'Yellow' | 'Green';
  let errorRate: number;
  let traffic: number;

  if (randomFactor < 0.7) {
    latency = baseline * (0.8 + Math.random() * 0.2);
    health = 'Green';
    errorRate = Math.round(Math.random() * 2);
    traffic = Math.round(50 + Math.random() * 100);
  } else if (randomFactor < 0.9) {
    latency = baseline * (1.0 + Math.random() * 1.0);
    health = 'Yellow';
    errorRate = Math.round(3 + Math.random() * 7);
    traffic = Math.round(100 + Math.random() * 200);
  } else {
    latency = baseline * (2.0 + Math.random() * 2.0);
    health = 'Red';
    errorRate = Math.round(10 + Math.random() * 20);
    traffic = Math.round(20 + Math.random() * 50);
  }

  latency += Math.random() * 20;

  return { latency: Math.round(latency), health, errorRate, traffic };
};

const getTrend = (history: HistoryDataPoint[]): 'improving' | 'degrading' | 'stable' | 'unknown' => {
  if (history.length < 2) {
    return 'unknown';
  }

  const current = history[history.length - 1].value;
  const prev = history[history.length - 2].value;

  if (current < prev * 0.9) {
    return 'improving';
  } else if (current > prev * 1.1) {
    return 'degrading';
  } else {
    return 'stable';
  }
};

interface LatencyBarProps {
  currentLatency: number;
  baselineLatency: number;
  health: 'Red' | 'Yellow' | 'Green' | 'Unknown';
  themeMode: 'light' | 'dark';
}

const LatencyBar: React.FC<LatencyBarProps> = ({ currentLatency, baselineLatency, health, themeMode }) => {
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  let circleColor: string;
  switch (health) {
    case 'Green':
      circleColor = currentTheme.palette.success.main;
      break;
    case 'Yellow':
      circleColor = currentTheme.palette.warning.main;
      break;
    case 'Red':
      circleColor = currentTheme.palette.error.main;
      break;
    default:
      circleColor = currentTheme.palette.grey[500];
      break;
  }

  const ratio = currentLatency / baselineLatency;
  let size = 12;
  if (ratio > 1.5) {
    size = 18;
  } else if (ratio < 0.8) {
    size = 10;
  }

  return (
    <Tooltip title={`Current: ${currentLatency}ms (Baseline: ${baselineLatency}ms)`}>
      <Box
        sx={{
          width: size,
          height: size,
          backgroundColor: circleColor,
          borderRadius: '50%',
          display: 'inline-block',
          verticalAlign: 'middle',
          ml: 1,
          transition: 'all 0.3s ease-in-out',
        }}
      />
    </Tooltip>
  );
};

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

const IndividualEndpointStatusTable: React.FC<{ endpoints: Endpoint[]; getStatusProps: Function; getTrendIcon: Function; appliedStartDate: Date | null; appliedEndDate: Date | null; themeMode: 'light' | 'dark' }> = ({ endpoints, getStatusProps, getTrendIcon, appliedStartDate, appliedEndDate, themeMode }) => {
  const filteredEndpoints = useMemo(() => {
    if (!appliedStartDate || !appliedEndDate) {
      return endpoints;
    }
    const start = appliedStartDate;
    const end = appliedEndDate;

    return endpoints.filter(endpoint =>
      endpoint.lastChecked &&
      endpoint.lastChecked.getTime() >= start.getTime() &&
      endpoint.lastChecked.getTime() <= end.getTime()
    );
  }, [endpoints, appliedStartDate, appliedEndDate]);

  const getErrorRateColor = (errorCount: number) => {
    const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
    if (errorCount > 10) return currentTheme.palette.error.main;
    if (errorCount > 3) return currentTheme.palette.warning.main;
    return currentTheme.palette.success.main;
  };

  const getTrafficColor = (traffic: number) => {
    const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
    if (traffic > 200) return currentTheme.palette.primary.main;
    if (traffic < 50) return currentTheme.palette.warning.main;
    return currentTheme.palette.success.main;
  };

  const calculateAverage = (history: HistoryDataPoint[], startDate: Date | null, endDate: Date | null) => {
    let filteredHistory = history;
    if (startDate && endDate) {
      filteredHistory = history.filter(point =>
        point.timestamp.getTime() >= startDate.getTime() &&
        point.timestamp.getTime() <= endDate.getTime()
      );
    }

    if (filteredHistory.length === 0) return 'N/A';
    const sum = filteredHistory.reduce((acc, val) => acc + val.value, 0);
    return (sum / filteredHistory.length).toFixed(1);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Individual Endpoint Health Status
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table stickyHeader aria-label="endpoint health table">
            <TableHead><TableRow>
                <TableCell sx={{ minWidth: '25px' }}>No.</TableCell>
                <TableCell sx={{ minWidth: '150px' }}>Endpoint Name</TableCell>
                <TableCell align="center" sx={{ minWidth: '50px' }}>Internal Health</TableCell>
                <TableCell align="center" sx={{ minWidth: '50px' }}>External Health</TableCell>
                <TableCell align="right" sx={{ minWidth: '30px' }}>Internal Latency (ms)</TableCell>
                <TableCell align="right" sx={{ minWidth: '60px' }}>External Latency (ms)</TableCell>
                <TableCell align="right" sx={{ minWidth: '80px' }}>Baseline (ms)</TableCell>
                <TableCell align="right" sx={{ minWidth: '100px' }}>Current Errors</TableCell>
                <TableCell align="right" sx={{ minWidth: '100px' }}>Avg Errors</TableCell>
                <TableCell align="right" sx={{ minWidth: '80px' }}>Traffic (RPS)</TableCell>
                <TableCell align="center" sx={{ minWidth: '100px' }}>Last Checked</TableCell>
              </TableRow></TableHead>
            <TableBody>{filteredEndpoints.map((endpoint, index) => (
                <TableRow key={endpoint.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell component="th" scope="row">{endpoint.name}</TableCell>
                  <TableCell align="center"><Chip {...getStatusProps(endpoint.internalHealth)} size="small" sx={{ width: 50, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell align="center"><Chip {...getStatusProps(endpoint.externalHealth)} size="small" sx={{ width: 50, fontSize: '0.65rem' }} /></TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" sx={{ mr: 1, minWidth: '20px', textAlign: 'right', fontSize: '0.75rem' }}>{endpoint.internalLatency !== null ? endpoint.internalLatency : 'N/A'}</Typography>
                      {endpoint.internalLatency !== null && (<LatencyBar currentLatency={endpoint.internalLatency} baselineLatency={endpoint.baselineLatency} health={endpoint.internalHealth} themeMode={themeMode} />)}
                      {getTrendIcon(getTrend(endpoint.internalLatencyHistory))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      <Typography variant="body2" sx={{ mr: 1, minWidth: '20px', textAlign: 'right', fontSize: '0.75rem' }}>{endpoint.externalLatency !== null ? endpoint.externalLatency : 'N/A'}</Typography>
                      {endpoint.externalLatency !== null && (<LatencyBar currentLatency={endpoint.externalLatency} baselineLatency={endpoint.baselineLatency} health={endpoint.externalHealth} themeMode={themeMode} />)}
                      {getTrendIcon(getTrend(endpoint.externalLatencyHistory))}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{endpoint.baselineLatency}</TableCell>
                  <TableCell align="right" sx={{ color: getErrorRateColor(endpoint.errorRate), fontWeight: 500 }}>{endpoint.errorRate}</TableCell>
                  <TableCell align="right" sx={{ color: getTrafficColor(endpoint.traffic), fontWeight: 500 }}>{endpoint.traffic}</TableCell>
                  <TableCell align="center">{endpoint.lastChecked ? endpoint.lastChecked.toLocaleString() : 'N/A'}</TableCell>
                </TableRow>
              ))}</TableBody>
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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: Date;
  department: string;
  contact: string;
}

const loggedInUser: User = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator',
  lastLogin: new Date('2025-07-10T12:00:00Z'),
  department: 'IT Operations',
  contact: '+1-555-123-4567',
};

const UserProfileTable: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          My Profile
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table aria-label="user profile table">
            <TableBody><TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '30%' }}>User ID</TableCell><TableCell>{loggedInUser.id}</TableCell></TableRow>
              <TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Name</TableCell><TableCell>{loggedInUser.name}</TableCell></TableRow>
              <TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Email</TableCell><TableCell>{loggedInUser.email}</TableCell></TableRow>
              <TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Role</TableCell><TableCell>{loggedInUser.role}</TableCell></TableRow>
              <TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Department</TableCell><TableCell>{loggedInUser.department}</TableCell></TableRow>
              <TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Contact</TableCell><TableCell>{loggedInUser.contact}</TableCell></TableRow>
              <TableRow><TableCell component="th" scope="row" sx={{ fontWeight: 'bold' }}>Last Login</TableCell><TableCell>{loggedInUser.lastLogin.toLocaleString()}</TableCell></TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};


interface SidebarNavProps {
  onSelectView: (view: string) => void;
  activeView: string;
  themeMode: 'dark' | 'light';
  onLogoutRequest: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ onSelectView, activeView, themeMode, onLogoutRequest }) => {
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
  const navItems = [
    { id: 'table', text: 'Endpoint Table', icon: <TableChartIcon /> },
    { id: 'error_trends', text: 'Error Trends', icon: <DeveloperBoardIcon /> },
    { id: 'summary', text: 'Overall Summary', icon: <DashboardIcon /> },
    { id: 'filtered_data', text: 'Filtered Data', icon: <FilterListIcon /> }, // New nav item
    { id: 'notifications', text: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'selfHealing', text: 'Self-Healing', icon: <AutoFixHighIcon /> },
    { id: 'user_profile', text: 'User Profile', icon: <PersonIcon /> },
  ];

  return (
    <Box sx={{ width: '154px', flexShrink: 0, bgcolor: 'background.paper', borderRight: 1, borderColor: 'divider', height: '100vh', position: 'sticky', top: 0, p: 1 }}>
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: currentTheme.palette.primary.main, fontSize: '1rem', justifyContent: 'center', textAlign: 'center' }}>
        Views
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeView === item.id}
              onClick={() => onSelectView(item.id)}
              sx={{
                borderRadius: 2,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: currentTheme.palette.primary.light,
                  color: currentTheme.palette.primary.contrastText,
                  '& .MuiListItemIcon-root': { color: currentTheme.palette.primary.contrastText }
                },
                '&:hover': {
                  backgroundColor: currentTheme.palette.action.hover,
                },
                color: currentTheme.palette.text.primary,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit', mb: 0.5 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="caption" sx={{ fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.2, color: 'inherit' }}>
                    {item.text}
                  </Typography>
                }
                disableTypography={true}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 3, px: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onLogoutRequest}
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

interface MiniTrendGraphProps {
  history: HistoryDataPoint[];
  label: string;
  unit: string;
  color: string;
  appliedStartDate: Date | null;
  appliedEndDate: Date | null;
  themeMode: 'light' | 'dark';
}

const MiniTrendGraph: React.FC<MiniTrendGraphProps> = ({ history, label, unit, color, appliedStartDate, appliedEndDate, themeMode }) => {
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
  const filteredHistory = useMemo(() => {
    if (!appliedStartDate || !appliedEndDate) {
      return history;
    }
    const start = appliedStartDate;
    const end = appliedEndDate;

    return history.filter(point =>
      point.timestamp.getTime() >= start.getTime() &&
      point.timestamp.getTime() <= end.getTime()
    );
  }, [history, appliedStartDate, appliedEndDate]);

  if (filteredHistory.length === 0) {
    return (
      <Box sx={{ width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', border: '1px dashed', borderColor: currentTheme.palette.grey[400], borderRadius: 2, p: 2 }}>
        <Typography variant="body2">No data available for selected date.</Typography>
      </Box>
    );
  }

  const chartData = filteredHistory.map(point => ({
    value: point.value,
    date: point.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    fullDate: point.timestamp.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  }));

  return (
    <Box sx={{ width: '100%', height: 100 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id={`color${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={currentTheme.palette.grey[300]} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <RechartsTooltip
            labelFormatter={(labelValue, payload) => {
              if (payload && payload.length > 0 && payload[0].payload && payload[0].payload.fullDate) {
                return `Date: ${payload[0].payload.fullDate}`;
              }
              return `Date: ${labelValue}`;
            }}
            formatter={(value) => [`${value} ${unit}`, label]}
            contentStyle={{ backgroundColor: currentTheme.palette.background.paper, border: `1px solid ${currentTheme.palette.divider}` }}
            labelStyle={{ color: currentTheme.palette.text.primary }}
            itemStyle={{ color: currentTheme.palette.text.secondary }}
          />
          <Area type="monotone" dataKey="value" stroke={color} fillOpacity={1} fill={`url(#color${label})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

interface ErrorRateTrendsProps {
  endpoints: Endpoint[];
  appliedStartDate: Date | null;
  appliedEndDate: Date | null;
  themeMode: 'light' | 'dark';
}

const ErrorRateTrends: React.FC<ErrorRateTrendsProps> = ({ endpoints, appliedStartDate, appliedEndDate, themeMode }) => {
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Error Count Trends Over Time
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {endpoints.map(endpoint => (
            <Card key={endpoint.id} variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ mb: 1 }}>
                  {endpoint.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Server: {endpoint.serverName}
                </Typography>
                <MiniTrendGraph
                  history={endpoint.errorRateHistory}
                  label="Errors"
                  unit="errors"
                  color={currentTheme.palette.error.main}
                  appliedStartDate={appliedStartDate}
                  appliedEndDate={appliedEndDate}
                  themeMode={themeMode}
                />
                <Typography variant="body2" component="span" sx={{ mt: 1 }}>
                  Current Errors: <Chip label={`${endpoint.errorRate} errors`} size="small" color={endpoint.errorRate > 10 ? 'error' : endpoint.errorRate > 3 ? 'warning' : 'success'} />
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

interface LoginPageProps {
  onLoginSuccess: () => void;
  themeMode: 'light' | 'dark';
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number) => {
  let r = 0, g = 0, b = 0;
  // Ensure hex is a string
  if (typeof hex !== 'string') {
    hex = String(hex);
  }
  // Handle #RRGGBB or #RGB
  if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  } else if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, themeMode }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const currentTheme = useMemo(() => themeMode === 'light' ? lightTheme : darkTheme, [themeMode]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (username === 'user' && password === 'password') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: currentTheme.palette.background.default,
      p: 2,
    }}>
      <Card sx={{
        p: { xs: 3, sm: 4 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 3,
        boxShadow: 6,
        width: '100%',
        maxWidth: 400,
        bgcolor: hexToRgba(currentTheme.palette.primary.main, 0.3), // Transparent primary color
      }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: currentTheme.palette.primary.contrastText }}>
            API Dashboard
          </Typography>
          <Typography variant="subtitle1" sx={{ color: currentTheme.palette.primary.contrastText }}>
            Sign in to continue
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 1, width: '100%' }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

// New FilteredDataDisplay Component
interface FilteredDataDisplayProps {
  projectFilter: string;
  serverNameFilter: string;
  appliedStartDate: Date | null;
  appliedEndDate: Date | null;
}

const FilteredDataDisplay: React.FC<FilteredDataDisplayProps> = ({ projectFilter, serverNameFilter, appliedStartDate, appliedEndDate }) => {
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFilteredDataFromAPI({
          project: projectFilter,
          server: serverNameFilter,
          startDate: appliedStartDate,
          endDate: appliedEndDate,
        });
        setDataRecords(data);
      } catch (err) {
        setError(`Failed to fetch data: ${(err as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [projectFilter, serverNameFilter, appliedStartDate, appliedEndDate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading filtered data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {error}
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Filtered Data Records
        </Typography>
        {dataRecords.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No data records found matching the selected filters.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table stickyHeader aria-label="filtered data table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Server</TableCell>
                  <TableCell>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>{record.value}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.project}</TableCell>
                    <TableCell>{record.server}</TableCell>
                    <TableCell>{record.timestamp.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};


const App: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('table');
  const [startDateString, setStartDateString] = useState<string>('');
  const [endDateString, setEndDateString] = useState<string>('');
  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(null);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(null);
  const [serverNameFilter, setServerNameFilter] = useState<string>('');
  const [projectFilter, setProjectFilter] = useState<string>('');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false); // New state for logout confirmation

  const currentTheme = useMemo(() => themeMode === 'light' ? lightTheme : darkTheme, [themeMode]);

  const uniqueServerNames = useMemo(() => {
    if (projectFilter) {
      const names = new Set(initialEndpoints.filter(e => e.projectName === projectFilter).map(e => e.serverName));
      return Array.from(names).sort();
    }
    const names = new Set(initialEndpoints.map(e => e.serverName));
    return Array.from(names).sort();
  }, [initialEndpoints, projectFilter]);

  const uniqueProjectNames = useMemo(() => {
    const names = new Set(initialEndpoints.map(e => e.projectName));
    return Array.from(names).sort();
  }, []);

  useEffect(() => {
    setLoading(false);

    const interval = setInterval(() => {
      setEndpoints((prevEndpoints) =>
        prevEndpoints.map((endpoint) => {
          const internalResult = simulateApiCall(endpoint.baselineLatency);
          const externalResult = simulateApiCall(endpoint.baselineLatency * 1.2);

          return {
            ...endpoint,
            internalLatency: internalResult.latency,
            externalLatency: externalResult.latency,
            internalHealth: internalResult.health,
            externalHealth: externalResult.health,
            errorRate: internalResult.errorRate,
            traffic: internalResult.traffic,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  const totalEndpoints = endpoints.length;
  const healthyEndpoints = endpoints.filter(
    (e) => e.internalHealth === 'Green' && e.externalHealth === 'Green'
  ).length;
  const yellowEndpoints = endpoints.filter(
    (e) => e.internalHealth === 'Yellow' || e.externalHealth === 'Yellow'
  ).length;
  const redEndpoints = endpoints.filter(
    (e) => e.internalHealth === 'Red' || e.externalHealth === 'Red'
  ).length;

  const overallStatus = useMemo(() => {
    if (redEndpoints > 0) {
      return 'Critical';
    } else if (yellowEndpoints > 0) {
      return 'Degraded';
    } else if (healthyEndpoints === totalEndpoints && totalEndpoints > 0) {
      return 'Operational';
    } else {
      return 'Unknown';
    }
  }, [healthyEndpoints, yellowEndpoints, redEndpoints, totalEndpoints]);

  const getStatusProps = useCallback((health: 'Red' | 'Yellow' | 'Green' | 'Unknown') => {
    switch (health) {
      case 'Green':
        return { label: 'Healthy', color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" /> };
      case 'Yellow':
        return { label: 'Degraded', color: 'warning', icon: <WarningAmberIcon fontSize="small" /> };
      case 'Red':
        return { label: 'Critical', color: 'error', icon: <ErrorOutlineIcon fontSize="small" /> };
      default:
        return { label: 'Unknown', color: 'default', icon: <HorizontalRuleIcon fontSize="small" /> };
    }
  }, []);

  const getTrendIcon = useCallback((trend: 'improving' | 'degrading' | 'stable' | 'unknown') => {
    switch (trend) {
      case 'improving':
        return <Tooltip title="Improving"><ArrowUpwardIcon color="success" fontSize="small" sx={{ ml: 0.5 }} /></Tooltip>;
      case 'degrading':
        return <Tooltip title="Degrading"><ArrowDownwardIcon color="error" fontSize="small" sx={{ ml: 0.5 }} /></Tooltip>;
      case 'stable':
        return <Tooltip title="Stable"><HorizontalRuleIcon color="action" fontSize="small" sx={{ ml: 0.5 }} /></Tooltip>;
      default:
        return null;
    }
  }, []);

  const handleApplyFilter = () => {
    const now = new Date();
    let newAppliedStartDate: Date | null = null;
    let newAppliedEndDate: Date | null = null;

    if (selectedTimeRange) {
      newAppliedEndDate = now;
      switch (selectedTimeRange) {
        case '1min':
          newAppliedStartDate = new Date(now.getTime() - 1 * 60 * 1000);
          break;
        case '3min':
          newAppliedStartDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
          break;
        case '5min':
          newAppliedStartDate = new Date(now.getTime() - 5 * 60 * 1000);
          break;
        case '1hour':
          newAppliedStartDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '3hours':
          newAppliedStartDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
          break;
        case '1day':
          newAppliedStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '1week':
          newAppliedStartDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1month':
          newAppliedStartDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          break;
      }
      setStartDateString('');
      setEndDateString('');
    } else {
      if (startDateString) {
        newAppliedStartDate = new Date(startDateString);
        newAppliedStartDate.setHours(0, 0, 0, 0);
      }
      if (endDateString) {
        newAppliedEndDate = new Date(endDateString);
        newAppliedEndDate.setHours(23, 59, 59, 999);
      }
    }

    setAppliedStartDate(newAppliedStartDate);
    setAppliedEndDate(newAppliedEndDate);
  };

  const handleClearFilters = () => {
    setStartDateString('');
    setEndDateString('');
    setAppliedStartDate(null);
    setAppliedEndDate(null);
    setServerNameFilter('');
    setProjectFilter('');
    setSelectedTimeRange('');
  };

  const filteredEndpointsByProject = useMemo(() => {
    if (!projectFilter) {
      return endpoints;
    }
    return endpoints.filter(endpoint => endpoint.projectName === projectFilter);
  }, [endpoints, projectFilter]);

  const filteredEndpointsByServer = useMemo(() => {
    if (!serverNameFilter) {
      return filteredEndpointsByProject;
    }
    return filteredEndpointsByProject.filter(endpoint => endpoint.serverName === serverNameFilter);
  }, [filteredEndpointsByProject, serverNameFilter]);

  const displayEndpoints = useMemo(() => {
    let currentEndpoints = filteredEndpointsByServer;

    if (appliedStartDate && appliedEndDate) {
      currentEndpoints = currentEndpoints.filter(endpoint =>
        endpoint.lastChecked &&
        endpoint.lastChecked.getTime() >= appliedStartDate.getTime() &&
        endpoint.lastChecked.getTime() <= appliedEndDate.getTime()
      );
    }
    return currentEndpoints;
  }, [filteredEndpointsByServer, appliedStartDate, appliedEndDate]);


  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogoutRequest = () => { // Function to open the confirmation dialog
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => { // Function to handle actual logout
    setIsLoggedIn(false);
    setActiveView('table');
    handleClearFilters();
    setShowLogoutConfirm(false); // Close dialog after logout
  };

  const handleCancelLogout = () => { // Function to cancel logout
    setShowLogoutConfirm(false);
  };

  if (loading) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="textSecondary">Loading API Status...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <LoginPage onLoginSuccess={handleLoginSuccess} themeMode={themeMode} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <SidebarNav onSelectView={setActiveView} activeView={activeView} themeMode={themeMode} onLogoutRequest={handleLogoutRequest} />
        <Container maxWidth="xl" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: currentTheme.palette.text.primary }}>
              API Monitoring Dashboard
            </Typography>
            <IconButton onClick={toggleTheme} color="inherit">
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {/* Conditional rendering of filter options */}
          {(activeView === 'table' || activeView === 'summary' || activeView === 'error_trends' || activeView === 'filtered_data') && (
            <Box sx={{ display: 'flex', gap: 1, mb: 4, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Project Dropdown */}
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="project-select-label">Project</InputLabel>
                <Select
                  labelId="project-select-label"
                  id="project-select"
                  value={projectFilter}
                  label="Project"
                  onChange={(e) => {
                    setProjectFilter(e.target.value as string);
                    setServerNameFilter('');
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>All Projects</em>
                  </MenuItem>
                  {uniqueProjectNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Server Dropdown */}
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="server-name-select-label">Server</InputLabel>
                <Select
                  labelId="server-name-select-label"
                  id="server-name-select"
                  value={serverNameFilter}
                  label="Server"
                  onChange={(e) => setServerNameFilter(e.target.value as string)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>All Servers</em>
                  </MenuItem>
                  {uniqueServerNames.map(name => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Time Range Dropdown */}
              <FormControl sx={{ minWidth: 130 }}>
                <InputLabel id="time-range-select-label">Time Range</InputLabel>
                <Select
                  labelId="time-range-select-label"
                  id="time-range-select"
                  value={selectedTimeRange}
                  label="Time Range"
                  onChange={(e) => { setSelectedTimeRange(e.target.value as string); }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="1min">Last 1 min</MenuItem>
                  <MenuItem value="3min">Last 3 min</MenuItem>
                  <MenuItem value="5min">Last 5 min</MenuItem>
                  <MenuItem value="1hour">Last 1 hour</MenuItem>
                  <MenuItem value="3hours">Last 3 hours</MenuItem>
                  <MenuItem value="1day">Last 1 Day</MenuItem>
                  <MenuItem value="1week">Last 1 Week</MenuItem>
                  <MenuItem value="1month">Last 1 Month</MenuItem>
                </Select>
              </FormControl>

              {/* Start Date */}
              <TextField
                label="From Date"
                type="date"
                value={startDateString}
                onChange={(e) => { setStartDateString(e.target.value); setSelectedTimeRange(''); }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ id: 'startDateInput' }}
              />
              {/* End Date */}
              <TextField
                label="To Date"
                type="date"
                value={endDateString}
                onChange={(e) => { setEndDateString(e.target.value); setSelectedTimeRange(''); }}
                InputLabelProps={{ shrink: true }}
                inputProps={{ id: 'endDateInput' }}
              />
              <Button
                variant="contained"
                onClick={handleApplyFilter}
                sx={{ height: '40px', px: 2, borderRadius: 2 }}
              >
                Apply
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{ height: '40px', px: 2, borderRadius: 2 }}
              >
                Clear
              </Button>
            </Box>
          )}

          {activeView === 'summary' && (
            <OverallSummaryStatus
              totalEndpoints={displayEndpoints.length}
              healthyEndpoints={displayEndpoints.filter(
                (e) => e.internalHealth === 'Green' && e.externalHealth === 'Green'
              ).length}
              yellowEndpoints={displayEndpoints.filter(
                (e) => e.internalHealth === 'Yellow' || e.externalHealth === 'Yellow'
              ).length}
              redEndpoints={displayEndpoints.filter(
                (e) => e.internalHealth === 'Red' || e.externalHealth === 'Red'
              ).length}
              overallStatus={overallStatus}
            />
          )}

          {activeView === 'table' && (
            <IndividualEndpointStatusTable
              endpoints={displayEndpoints}
              getStatusProps={getStatusProps}
              getTrendIcon={getTrendIcon}
              appliedStartDate={appliedStartDate}
              appliedEndDate={appliedEndDate}
              themeMode={themeMode}
            />
          )}

          {activeView === 'error_trends' && (
            <ErrorRateTrends
              endpoints={displayEndpoints}
              appliedStartDate={appliedStartDate}
              appliedEndDate={appliedEndDate}
              themeMode={themeMode}
            />
          )}

          {activeView === 'filtered_data' && (
            <FilteredDataDisplay
              projectFilter={projectFilter}
              serverNameFilter={serverNameFilter}
              appliedStartDate={appliedStartDate}
              appliedEndDate={appliedEndDate}
            />
          )}

          {activeView === 'notifications' && <NotificationAlerting />}
          {activeView === 'selfHealing' && <AutomatedSelfHealingActions />}
          {activeView === 'user_profile' && <UserProfileTable />}
        </Container>
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={showLogoutConfirm}
        onClose={handleCancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">{"Confirm Logout"}</DialogTitle>
        <DialogContent>
          <Typography id="logout-dialog-description">
            Are you sure you want to log out?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default App;
