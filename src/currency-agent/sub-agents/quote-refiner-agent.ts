import {LlmAgent} from '@google/adk';
import {exitLoop} from '../tools/exit-loop.js';
import {STATE_CURRENCY_ANSWER} from './rate-quote-agent.js';
import {COMPLETE_REVIEW, STATE_QUOTE_REVIEW} from './quote-review-agent.js';

export const quoteRefinerAgent = new LlmAgent({
  name: 'QuoteRefinerAgent',
  model: 'gemini-2.5-flash',
  includeContents: 'none',
  description: 'Refines the currency answer or exits the review loop.',
  instruction: `
Current answer:

{{${STATE_CURRENCY_ANSWER}}}

Review:
{{${STATE_QUOTE_REVIEW}}}

If the review is exactly "${COMPLETE_REVIEW}", call the 'exit_loop' function and output no text.

Otherwise revise the current answer to fix the review. Output only the revised answer.
`,
  tools: [exitLoop],
  outputKey: STATE_CURRENCY_ANSWER,
});
