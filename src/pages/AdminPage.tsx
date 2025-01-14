import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import MenuConfiguration from '../components/admin/MenuConfiguration';
import ReportsDashboard from '../components/admin/ReportsDashboard';
import SystemSettings from '../components/admin/SystemSettings';

const AdminPage: React.FC = () => {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="User Management" />
        <Tab label="Menu Configuration" />
        <Tab label="Reports & Analytics" />
        <Tab label="System Settings" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && <UserManagement />}
        {tabIndex === 1 && <MenuConfiguration />}
        {tabIndex === 2 && <ReportsDashboard />}
        {tabIndex === 3 && <SystemSettings />}
      </Box>
    </Box>
  );
};

export default AdminPage;
