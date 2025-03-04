import React, { useState, useEffect } from 'react';
import { Tabs } from '@mantine/core';
import { IconList, IconPlus } from '@tabler/icons-react';
import WebApp from '@twa-dev/sdk';
import OrderList from './components/OrderList';
import CreateOrder from './components/CreateOrder';
import { Order } from './types';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>('list');

  useEffect(() => {
    // Initialize Telegram Mini App
    WebApp.ready();
    WebApp.expand();
  }, []);

  const handleCreateOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    setOrders([newOrder, ...orders]);
    setActiveTab('list');
  };

  const handleOrderAction = (orderId: string, action: 'complete' | 'cancel') => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: action === 'complete' ? 'completed' : 'cancelled' }
        : order
    ));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Tabs value={activeTab} onTabChange={(value) => setActiveTab(value || 'list')}>
        <Tabs.List>
          <Tabs.Tab value="list" icon={<IconList size={16} />}>
            Orders
          </Tabs.Tab>
          <Tabs.Tab value="create" icon={<IconPlus size={16} />}>
            Create Order
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list">
          <OrderList orders={orders} onOrderAction={handleOrderAction} />
        </Tabs.Panel>

        <Tabs.Panel value="create">
          <CreateOrder onCreateOrder={handleCreateOrder} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default App;
