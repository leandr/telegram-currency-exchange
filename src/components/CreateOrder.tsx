import React from 'react';
import { useForm } from '@mantine/form';
import { TextInput, NumberInput, Select, Button, Stack } from '@mantine/core';
import WebApp from '@twa-dev/sdk';
import { Order } from '../types';

interface CreateOrderProps {
  onCreateOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

function CreateOrder({ onCreateOrder }: CreateOrderProps) {
  const form = useForm({
    initialValues: {
      type: 'buy',
      fromCurrency: '',
      toCurrency: '',
      amount: 0,
      rate: 0,
    },
    validate: {
      fromCurrency: (value) => (!value ? 'Select a currency' : null),
      toCurrency: (value, values) => 
        !value ? 'Select a currency' : 
        value === values.fromCurrency ? 'Cannot be the same as source currency' : null,
      amount: (value) => (value <= 0 ? 'Amount must be positive' : null),
      rate: (value) => (value <= 0 ? 'Rate must be positive' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onCreateOrder({
      ...values,
      userId: WebApp.initDataUnsafe.user?.id.toString() || 'unknown',
      userName: WebApp.initDataUnsafe.user?.username || 'Anonymous',
    });
    form.reset();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md" mt="md">
        <Select
          label="Order Type"
          placeholder="Select order type"
          data={[
            { value: 'buy', label: 'Buy' },
            { value: 'sell', label: 'Sell' },
          ]}
          {...form.getInputProps('type')}
        />

        <Select
          label="From Currency"
          placeholder="Select currency"
          data={CURRENCIES.map(curr => ({ value: curr, label: curr }))}
          searchable
          {...form.getInputProps('fromCurrency')}
        />

        <Select
          label="To Currency"
          placeholder="Select currency"
          data={CURRENCIES.map(curr => ({ value: curr, label: curr }))}
          searchable
          {...form.getInputProps('toCurrency')}
        />

        <NumberInput
          label="Amount"
          placeholder="Enter amount"
          min={0}
          {...form.getInputProps('amount')}
        />

        <NumberInput
          label="Exchange Rate"
          placeholder="Enter rate"
          min={0}
          precision={4}
          {...form.getInputProps('rate')}
        />

        <Button type="submit">Create Order</Button>
      </Stack>
    </form>
  );
}

export default CreateOrder;
