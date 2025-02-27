import React, { useEffect, useMemo } from 'react';
import { useForm } from '@mantine/form';
import { Box, Select, NumberInput, Button, Text, Paper } from '@mantine/core';
import WebApp from '@twa-dev/sdk';
import { Order } from '../types';
import { fetchExchangeRate } from '../services/exchangeRates';

interface CreateOrderProps {
  onCreateOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
}

interface OrderFormValues {
  type: 'buy' | 'sell';
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'RUB', 'AED'];

function CreateOrder({ onCreateOrder }: CreateOrderProps) {
  const form = useForm<OrderFormValues>({
    initialValues: {
      type: 'buy',
      fromCurrency: '',
      toCurrency: '',
      amount: 0,
      rate: 0,
    },
    validate: {
      fromCurrency: (value: string) => (!value ? 'Select a currency' : null),
      toCurrency: (value: string, values: OrderFormValues) => 
        !value ? 'Select a currency' : 
        value === values.fromCurrency ? 'Cannot be the same as source currency' : null,
      amount: (value: number) => (value <= 0 ? 'Amount must be positive' : null),
      rate: (value: number) => (value <= 0 ? 'Rate must be positive' : null),
    },
  });

  const updateExchangeRate = async (fromCurrency: string, toCurrency: string) => {
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      try {
        const rate = await fetchExchangeRate(fromCurrency, toCurrency);
        form.setFieldValue('rate', Number(rate.toFixed(4)));
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    }
  };

  // Calculate the total amount in target currency
  const calculatedAmount = useMemo(() => {
    const { amount, rate, fromCurrency, toCurrency } = form.values;
    if (amount && rate && fromCurrency && toCurrency) {
      return (amount * rate).toFixed(2);
    }
    return null;
  }, [form.values.amount, form.values.rate, form.values.fromCurrency, form.values.toCurrency]);

  // Watch for currency changes
  useEffect(() => {
    const { fromCurrency, toCurrency } = form.values;
    if (fromCurrency && toCurrency) {
      updateExchangeRate(fromCurrency, toCurrency);
    }
  }, [form.values.fromCurrency, form.values.toCurrency]);

  const handleSubmit = form.onSubmit((values: OrderFormValues) => {
    onCreateOrder({
      ...values,
      userId: WebApp.initDataUnsafe.user?.id.toString() || 'unknown',
      userName: WebApp.initDataUnsafe.user?.username || 'Anonymous',
    });
    form.reset();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
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
          placeholder="Rate will be fetched automatically"
          min={0}
          precision={4}
          disabled
          description="Exchange rate is automatically updated when you select currencies"
          {...form.getInputProps('rate')}
        />

        {calculatedAmount && form.values.fromCurrency && form.values.toCurrency && (
          <Paper p="sm" withBorder>
            <Text size="sm" weight={500}>
              Order Summary:
            </Text>
            <Text size="sm" color="dimmed">
              {form.values.amount} {form.values.fromCurrency} = {calculatedAmount} {form.values.toCurrency}
            </Text>
          </Paper>
        )}

        <Button type="submit">Create Order</Button>
      </Box>
    </form>
  );
}

export default CreateOrder;
