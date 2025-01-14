import axios from 'axios';

export type OrderStatus = 'Criado' | 'Pago' | 'EmProducao' | 'Entregue';

export interface Order {
  id: number;
  numero: string;
  cliente: string;
  status: OrderStatus;
  total: number;
  data: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5041';

const OrderService = {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<void> {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}/status`, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
};

export default OrderService;
