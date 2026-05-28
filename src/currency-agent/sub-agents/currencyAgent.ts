import {LlmAgent} from '@google/adk';
import {getExchangeRate} from '../tools/getExchangeRate.ts';

const SYSTEM_INSTRUCTION = [
  'You are a specialized assistant for currency conversions.',
  "Your sole purpose is to use the 'get_exchange_rate' tool to answer questions about currency exchange rates.",
  'If the user asks about anything other than currency conversion or exchange rates, politely state that you cannot help with that topic and can only assist with currency-related queries.',
  'Do not attempt to answer unrelated questions or use tools for other purposes.',
].join(' ');

export const currencyAgent = new LlmAgent({
  name: 'currency_agent',
  model: 'gemini-2.5-flash',
  description: 'An agent that can help with currency conversions.',
  instruction: `${SYSTEM_INSTRUCTION} When converting an amount, clearly include the final converted amount and target currency in your response.`,
  tools: [getExchangeRate],
  outputKey: 'currencyResult',
});
