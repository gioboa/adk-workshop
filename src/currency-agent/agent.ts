import {FunctionTool, LlmAgent} from '@google/adk';
import {z} from 'zod';

const SYSTEM_INSTRUCTION = [
  'You are a specialized assistant for currency conversions.',
  "Your sole purpose is to use the 'get_exchange_rate' tool to answer questions about currency exchange rates.",
  'If the user asks about anything other than currency conversion or exchange rates, politely state that you cannot help with that topic and can only assist with currency-related queries.',
  'Do not attempt to answer unrelated questions or use tools for other purposes.',
].join(' ');

const getExchangeRate = new FunctionTool({
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

export const rootAgent = new LlmAgent({
  name: 'currency_agent',
  model: 'gemini-2.5-flash',
  description: 'An agent that can help with currency conversions.',
  instruction: SYSTEM_INSTRUCTION,
  tools: [getExchangeRate],
});
