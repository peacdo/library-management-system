import * as React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useGetLibraryStatsQuery } from '../../services/api';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useGetLibraryStatsQuery();

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Books</Typography>
            <Typography variant="h3">{stats?.totalBooks || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Books Borrowed</Typography>
            <Typography variant="h3">{stats?.borrowedBooks || 0}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Members</Typography>
            <Typography variant="h3">{stats?.activeMembers || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;