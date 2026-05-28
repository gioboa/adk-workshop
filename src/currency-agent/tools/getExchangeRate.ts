import {FunctionTool} from '@google/adk';
import {z} from 'zod';

export const getExchangeRate = new FunctionTool({
  name: 'get_exchange_rate',
  description: 'Gets an exchange rate between two currencies.',
  parameters: z.object({
    currency_from: z
      .string()
      .default('USD')
      .describe('The currency to convert from, e.g. USD.'),
    currency_to: z
      .string()
      .default('EUR')
      .describe('The currency to convert to, e.g. EUR.'),
    currency_date: z
      .string()
      .default('latest')
      .describe('The exchange-rate date in YYYY-MM-DD format, or latest.'),
  }),
  execute: async ({currency_from, currency_to, currency_date}) => {
    const url = new URL(`https://api.frankfurter.app/${currency_date}`);
    url.searchParams.set('from', currency_from.toUpperCase());
    url.searchParams.set('to', currency_to.toUpperCase());

    const response = await fetch(url);
    if (!response.ok) {
      return {
        error: `Exchange-rate API request failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    if (!data.rates) {
      return {error: 'Invalid exchange-rate API response format.'};
    }

    return data;
  },
});
