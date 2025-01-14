import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

const MenuConfiguration: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Pasta', description: 'Spaghetti with tomato sauce', price: 12.99, category: 'Main' },
    { id: 2, name: 'Salad', description: 'Fresh garden salad', price: 8.99, category: 'Starter' },
  ]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Menu Configuration
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="primary">
          Add New Item
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item: MenuItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Button size="small" color="primary">Edit</Button>
                  <Button size="small" color="error">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MenuConfiguration;
