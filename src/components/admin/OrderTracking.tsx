import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Select,
  MenuItem
} from '@mui/material';
import OrderService, { Order, OrderStatus } from 'services/orderService';

const OrderTracking: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orders = await OrderService.getOrders();
      setOrders(orders);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      setError('Failed to update order status');
      console.error(error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Criado':
        return 'default';
      case 'Pago':
        return 'primary';
      case 'EmProducao':
        return 'warning';
      case 'Entregue':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={fetchOrders} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Tracking
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table aria-label="Orders table" size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 100 }}>Order #</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Customer</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
              <TableCell sx={{ minWidth: 100 }}>Total</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Date</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.numero}</TableCell>
                <TableCell>{order.cliente}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>R${order.total.toFixed(2)}</TableCell>
                <TableCell>{new Date(order.data).toLocaleString()}</TableCell>
                <TableCell>
                  {order.status !== 'Entregue' && (
                    <Select
                      value={order.status}
                      onChange={(e) => 
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      {order.status === 'Criado' && (
                        <MenuItem value="Pago">Mark as Paid</MenuItem>
                      )}
                      {order.status === 'Pago' && (
                        <MenuItem value="EmProducao">Start Production</MenuItem>
                      )}
                      {order.status === 'EmProducao' && (
                        <MenuItem value="Entregue">Mark as Delivered</MenuItem>
                      )}
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderTracking;
