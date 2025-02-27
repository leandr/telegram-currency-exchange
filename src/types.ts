export interface Order {
  id: string;
  type: 'buy' | 'sell';
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  rate: number;
  userId: string;
  userName: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  telegramId: string;
}
