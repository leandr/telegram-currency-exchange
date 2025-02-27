const BASE_URL = 'https://open.er-api.com/v6/latest';

export async function fetchExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  try {
    const response = await fetch(`${BASE_URL}/${fromCurrency}`);
    const data = await response.json();
    
    if (data.rates && data.rates[toCurrency]) {
      return data.rates[toCurrency];
    } else {
      throw new Error('Exchange rate not found');
    }
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    throw error;
  }
}
