import {LlmAgent} from '@google/adk';
import {getExchangeRateHistory} from '../tools/exchange-rate-tools.ts';

export const volatilityAgent = new LlmAgent({
  name: 'VolatilityAgent',
  model: 'gemini-2.5-flash',
  description: 'Checks recent exchange-rate range and volatility.',
  instruction: [
    'You analyze only currency exchange-rate volatility requests.',
    'Extract the source and target currencies from the user request.',
    'Use get_exchange_rate_history with days_back 30.',
    'Return only a concise volatility summary: low, high, range, and whether movement was calm or wide.',
  ].join(' '),
  tools: [getExchangeRateHistory],
  outputKey: 'volatility_result',
});
