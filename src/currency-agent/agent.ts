import {LoopAgent, SequentialAgent} from '@google/adk';
import {quoteRefinerAgent} from './sub-agents/quote-refiner-agent.js';
import {quoteReviewAgent} from './sub-agents/quote-review-agent.js';
import {rateQuoteAgent} from './sub-agents/rate-quote-agent.js';

const quoteQualityLoop = new LoopAgent({
  name: 'QuoteQualityLoop',
  description: 'Iteratively reviews and improves a currency answer.',
  subAgents: [quoteReviewAgent, quoteRefinerAgent],
  maxIterations: 3,
});

export const rootAgent = new SequentialAgent({
  name: 'currency_agent',
  description:
    'Fetches a currency quote, then loops over review/refinement until complete.',
  subAgents: [rateQuoteAgent, quoteQualityLoop],
});
