import {LlmAgent} from '@google/adk';

export const legoPiecesAgent = new LlmAgent({
  name: 'lego_pieces_agent',
  model: 'gemini-2.5-flash',
  description:
    'Calculates how many LEGO pieces are needed to represent the converted currency amount.',
  instruction: `You calculate how many new LEGO pieces could be bought from the currency conversion result.

Currency result:
{{currencyResult}}

Use the converted amount from the currency result. If the target currency is USD,
estimate LEGO pieces using the average retail price range for a new LEGO piece:
$0.10 to $0.13 USD per piece.

If the target currency is not USD, do not invent another exchange rate. Explain
that the LEGO estimate needs a USD amount, unless the user supplied a price per
piece in the target currency.

When using the USD range:
- Maximum pieces = floor(converted USD amount / 0.10)
- Minimum pieces = floor(converted USD amount / 0.13)

Return only:
- Converted amount
- Assumption used
- Estimated LEGO pieces range`,
  outputKey: 'legoPiecesResult',
});
