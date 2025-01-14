declare module 'services/orderService' {
  export type OrderStatus = 'Criado' | 'Pago' | 'EmProducao' | 'Entregue';

  export interface Order {
    id: number;
    numero: string;
    cliente: string;
    status: OrderStatus;
    total: number;
    data: string;
  }
  
  const OrderService: {
    getOrders(): Promise<Order[]>;
    updateOrderStatus(orderId: number, status: OrderStatus): Promise<void>;
  };
  
  export default OrderService;
}
