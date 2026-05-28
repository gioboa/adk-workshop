import {SequentialAgent} from '@google/adk';
import {currencyAgent} from './sub-agents/currencyAgent.ts';
import {legoPiecesAgent} from './sub-agents/legoPiecesAgent.ts';

export const rootAgent = new SequentialAgent({
  name: 'currency_pipeline',
  description:
    'Converts currency, then calculates LEGO pieces needed for the converted amount.',
  subAgents: [currencyAgent, legoPiecesAgent],
});
