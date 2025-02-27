import React from 'react';
import { Card, Text, Button, Group, Box, Badge } from '@mantine/core';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onOrderAction: (orderId: string, action: 'complete' | 'cancel') => void;
}

function OrderList({ orders, onOrderAction }: OrderListProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'active':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {orders.length === 0 ? (
        <Text c="dimmed" align="center">No orders available</Text>
      ) : (
        orders.map((order) => (
          <Card key={order.id} shadow="sm" padding="md" radius="md" withBorder>
            <Group position="apart" mb="xs">
              <Text weight={500}>
                {order.type.toUpperCase()}: {order.fromCurrency} → {order.toCurrency}
              </Text>
              <Badge color={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </Group>

            <Text size="sm" color="dimmed">Amount: {order.amount} {order.fromCurrency}</Text>
            <Text size="sm" color="dimmed">Rate: 1 {order.fromCurrency} = {order.rate} {order.toCurrency}</Text>
            <Text size="sm" color="dimmed">Total: {order.amount * order.rate} {order.toCurrency}</Text>
            <Text size="sm" color="dimmed">Created by: {order.userName}</Text>

            {order.status === 'active' && (
              <Group mt="md">
                <Button 
                  variant="filled" 
                  color="green" 
                  size="sm"
                  onClick={() => onOrderAction(order.id, 'complete')}
                >
                  Complete
                </Button>
                <Button 
                  variant="light" 
                  color="red" 
                  size="sm"
                  onClick={() => onOrderAction(order.id, 'cancel')}
                >
                  Cancel
                </Button>
              </Group>
            )}
          </Card>
        ))
      )}
    </Box>
  );
}

export default OrderList;
