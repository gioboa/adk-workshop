import {LlmAgent} from '@google/adk';
import {getExchangeRate} from '../tools/exchange-rate-tools.ts';

export const spotRateAgent = new LlmAgent({
  name: 'SpotRateAgent',
  model: 'gemini-2.5-flash',
  description: 'Finds the latest requested currency exchange rate.',
  instruction: [
    'You analyze only currency exchange-rate requests.',
    'Extract the source and target currencies from the user request.',
    'Use get_exchange_rate with currency_date latest unless the user gives a date.',
    'Return only a concise spot-rate summary with date, pair, and rate.',
  ].join(' '),
  tools: [getExchangeRate],
  outputKey: 'spot_rate_result',
});
