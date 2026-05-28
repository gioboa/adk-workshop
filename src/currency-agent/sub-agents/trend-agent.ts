import {LlmAgent} from '@google/adk';
import {getExchangeRateHistory} from '../tools/exchange-rate-tools.ts';

export const trendAgent = new LlmAgent({
  name: 'TrendAgent',
  model: 'gemini-2.5-flash',
  description: 'Reviews recent exchange-rate direction.',
  instruction: [
    'You analyze only currency exchange-rate trend requests.',
    'Extract the source and target currencies from the user request.',
    'Use get_exchange_rate_history with days_back 14.',
    'Return only a concise trend summary: direction, first rate, latest rate, and date range.',
  ].join(' '),
  tools: [getExchangeRateHistory],
  outputKey: 'trend_result',
});
