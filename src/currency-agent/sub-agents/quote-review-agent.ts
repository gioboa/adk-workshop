import {LlmAgent} from '@google/adk';
import {STATE_CURRENCY_ANSWER} from './rate-quote-agent.js';

export const STATE_QUOTE_REVIEW = 'quote_review';
export const COMPLETE_REVIEW = 'Currency answer complete.';

export const quoteReviewAgent = new LlmAgent({
  name: 'QuoteReviewAgent',
  model: 'gemini-2.5-flash',
  includeContents: 'none',
  description: 'Checks whether the currency answer is complete.',
  instruction: `
Review this currency answer:

{{${STATE_CURRENCY_ANSWER}}}

Completion criteria:
1. If the user asked a currency question, the answer includes date, currency pair, numeric rate, and converted amount when an amount was provided.
2. If the user asked an unrelated question, the answer refuses and stays currency-only.
3. The answer is concise and has no unsupported extra claims.

If all criteria pass, output exactly:
${COMPLETE_REVIEW}

Otherwise output only the specific missing or incorrect items.
`,
  outputKey: STATE_QUOTE_REVIEW,
});
