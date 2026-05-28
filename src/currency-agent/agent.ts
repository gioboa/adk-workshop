import {LlmAgent, ParallelAgent, SequentialAgent} from '@google/adk';
import {spotRateAgent} from './sub-agents/spot-rate-agent.ts';
import {trendAgent} from './sub-agents/trend-agent.ts';
import {volatilityAgent} from './sub-agents/volatility-agent.ts';

const parallelCurrencyAnalysisAgent = new ParallelAgent({
  name: 'ParallelCurrencyAnalysisAgent',
  description: 'Runs independent currency rate, trend, and volatility checks.',
  subAgents: [spotRateAgent, trendAgent, volatilityAgent],
});

const synthesisAgent = new LlmAgent({
  name: 'CurrencySynthesisAgent',
  model: 'gemini-2.5-flash',
  description: 'Combines parallel currency analysis into one answer.',
  instruction: `
You are a specialized assistant for currency conversions and exchange-rate analysis.
If the user asks about anything other than currencies, say you can only help with currency exchange-rate queries.

Synthesize only the parallel agent outputs below. Do not add facts not present there.

Spot rate:
{spot_rate_result}

Trend:
{trend_result}

Volatility:
{volatility_result}

Return a concise answer with:
- Current rate
- Recent trend
- Recent range
- One short practical note
`,
});

export const rootAgent = new SequentialAgent({
  name: 'CurrencyParallelPipeline',
  description: 'Runs parallel currency analysis and synthesizes the result.',
  subAgents: [parallelCurrencyAnalysisAgent, synthesisAgent],
});
