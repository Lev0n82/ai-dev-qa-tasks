import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`interview-tabpanel-${index}`}
      aria-labelledby={`interview-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface Interview {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  candidateName: string;
  position: string;
  deadline: string;
}

const mockInterviews: Interview[] = [
  {
    id: '1',
    title: 'Senior Developer Interview',
    status: 'completed',
    candidateName: 'John Doe',
    position: 'Senior React Developer',
    deadline: '2024-03-01'
  },
  {
    id: '2',
    title: 'Product Manager Interview',
    status: 'in_progress',
    candidateName: 'Jane Smith',
    position: 'Product Manager',
    deadline: '2024-03-05'
  },
  {
    id: '3',
    title: 'UX Designer Interview',
    status: 'pending',
    candidateName: 'Mike Johnson',
    position: 'Senior UX Designer',
    deadline: '2024-03-10'
  }
];

export default function EmployerDashboard() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Interview['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'in_progress':
        return <AccessTimeIcon fontSize="small" />;
      case 'pending':
        return <ScheduleIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const handleCreateInterview = () => {
    router.push('/employer/interviews/create');
  };

  const handleViewInterview = (id: string) => {
    router.push(`/employer/interviews/${id}`);
  };

  return (
    <>
      <Head>
        <title>Employer Dashboard - Virtual Interview Platform</title>
        <meta name="description" content="Manage your virtual interviews and view candidate responses." />
      </Head>

      <Container component="main" maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
            <Grid item>
              <Typography variant="h4" component="h1" gutterBottom>
                Interview Dashboard
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateInterview}
                aria-label="Create new interview"
              >
                Create Interview
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Interview status tabs"
            >
              <Tab label="All Interviews" id="interview-tab-0" aria-controls="interview-tabpanel-0" />
              <Tab label="In Progress" id="interview-tab-1" aria-controls="interview-tabpanel-1" />
              <Tab label="Completed" id="interview-tab-2" aria-controls="interview-tabpanel-2" />
            </Tabs>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  {mockInterviews.map((interview) => (
                    <Grid item xs={12} md={6} lg={4} key={interview.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                              {interview.title}
                            </Typography>
                            <Chip
                              size="small"
                              label={interview.status.replace('_', ' ')}
                              color={getStatusColor(interview.status)}
                              icon={getStatusIcon(interview.status)}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {interview.candidateName}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Position: {interview.position}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              Deadline: {new Date(interview.deadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button 
                            size="small" 
                            onClick={() => handleViewInterview(interview.id)}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3}>
                  {mockInterviews
                    .filter(interview => interview.status === 'in_progress')
                    .map((interview) => (
                      <Grid item xs={12} md={6} lg={4} key={interview.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="h6" component="h2" gutterBottom>
                                {interview.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={interview.status.replace('_', ' ')}
                                color={getStatusColor(interview.status)}
                                icon={getStatusIcon(interview.status)}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {interview.candidateName}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Position: {interview.position}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                Deadline: {new Date(interview.deadline).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              onClick={() => handleViewInterview(interview.id)}
                            >
                              View Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                  {mockInterviews
                    .filter(interview => interview.status === 'completed')
                    .map((interview) => (
                      <Grid item xs={12} md={6} lg={4} key={interview.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Typography variant="h6" component="h2" gutterBottom>
                                {interview.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={interview.status.replace('_', ' ')}
                                color={getStatusColor(interview.status)}
                                icon={getStatusIcon(interview.status)}
                              />
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {interview.candidateName}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Position: {interview.position}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                Deadline: {new Date(interview.deadline).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              onClick={() => handleViewInterview(interview.id)}
                            >
                              View Details
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}