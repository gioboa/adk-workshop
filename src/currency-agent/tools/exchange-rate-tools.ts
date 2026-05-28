import {FunctionTool} from '@google/adk';
import {z} from 'zod';

const currencyCode = z
  .string()
  .length(3)
  .describe('ISO 4217 currency code, e.g. USD, EUR, GBP.');

async function fetchFrankfurter(path: string, from: string, to: string) {
  const url = new URL(`https://api.frankfurter.app/${path}`);
  url.searchParams.set('from', from.toUpperCase());
  url.searchParams.set('to', to.toUpperCase());

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
}

function isoDateDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export const getExchangeRate = new FunctionTool({
  name: 'get_exchange_rate',
  description: 'Gets one exchange rate between two currencies.',
  parameters: z.object({
    currency_from: currencyCode.default('USD'),
    currency_to: currencyCode.default('EUR'),
    currency_date: z
      .string()
      .default('latest')
      .describe('The exchange-rate date in YYYY-MM-DD format, or latest.'),
  }),
  execute: async ({currency_from, currency_to, currency_date}) =>
    fetchFrankfurter(currency_date, currency_from, currency_to),
});

export const getExchangeRateHistory = new FunctionTool({
  name: 'get_exchange_rate_history',
  description: 'Gets recent daily exchange rates for trend or volatility analysis.',
  parameters: z.object({
    currency_from: currencyCode.default('USD'),
    currency_to: currencyCode.default('EUR'),
    days_back: z
      .number()
      .int()
      .min(2)
      .max(90)
      .default(14)
      .describe('Number of calendar days to include, between 2 and 90.'),
  }),
  execute: async ({currency_from, currency_to, days_back}) => {
    const startDate = isoDateDaysAgo(days_back);
    const endDate = isoDateDaysAgo(0);
    return fetchFrankfurter(`${startDate}..${endDate}`, currency_from, currency_to);
  },
});
