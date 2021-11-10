// material
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Box, Chip, Grid, Container, Typography } from '@material-ui/core';
import { Card, CardHeader } from '@material-ui/core';

// components
import Page from '../../components/Page';
import Appbar from '../../components/Appbar';
import {
  AnalyticsTasks,
  AnalyticsNewUsers,
  AnalyticsBugReports,
  AnalyticsItemOrders,
  AnalyticsNewsUpdate,
  AnalyticsWeeklySales,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates
} from '../../components/_dashboard/general-analytics';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
  },
}))(LinearProgress);

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});



// ----------------------------------------------------------------------

export default function GeneralAnalytics() {
  const classes = useStyles();
  return (
    <>
    <Page className="backgroundColor" title="General: Analytics | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>

        <Card style={{ marginBottom: '20px' }}>
          <CardHeader title="Tasks" />
          <Box sx={{ p: 4 }}>
            <h3>Learn UX Design</h3>
            <Chip label="Primary" style={{ float: 'right' }} />
            <p>21st November 2021</p>

            <BorderLinearProgress variant="determinate" value={50} />
          </Box>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsTasks />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates />
          </Grid>
        </Grid>
      </Container>
    </Page>
    <Appbar />
    </>
  );
}
