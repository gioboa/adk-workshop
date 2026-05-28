import {LlmAgent} from '@google/adk';
import {getExchangeRate} from '../tools/get-exchange-rate.js';

export const STATE_CURRENCY_ANSWER = 'currency_answer';

export const rateQuoteAgent = new LlmAgent({
  name: 'RateQuoteAgent',
  model: 'gemini-2.5-flash',
  description: 'Fetches exchange rates and drafts the first currency answer.',
  instruction: [
    'You answer only currency conversion or exchange-rate questions.',
    "Use the 'get_exchange_rate' tool for currency rates.",
    'If the request is unrelated, say you can only help with currency exchange rates.',
    'For valid requests, include the rate date, currency pair, numeric rate, and converted amount when an amount is provided.',
    'Output only the answer text.',
  ].join(' '),
  tools: [getExchangeRate],
  outputKey: STATE_CURRENCY_ANSWER,
});
