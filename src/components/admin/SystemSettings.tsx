import React, { useState } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Switch, Paper } from '@mui/material';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    businessName: 'Buffet Delight',
    currency: 'USD',
    taxRate: 7.5,
    enableOnlineOrders: true,
    maintenanceMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Settings saved:', settings);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          General Settings
        </Typography>
        
        <TextField
          fullWidth
          label="Business Name"
          name="businessName"
          value={settings.businessName}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Currency"
          name="currency"
          value={settings.currency}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Tax Rate (%)"
          name="taxRate"
          type="number"
          value={settings.taxRate}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          System Features
        </Typography>

        <FormControlLabel
          control={
            <Switch
              name="enableOnlineOrders"
              checked={settings.enableOnlineOrders}
              onChange={handleChange}
            />
          }
          label="Enable Online Orders"
        />

        <FormControlLabel
          control={
            <Switch
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
            />
          }
          label="Maintenance Mode"
        />
      </Paper>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default SystemSettings;
