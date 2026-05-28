import {FunctionTool} from '@google/adk';
import {z} from 'zod';

export const exitLoop = new FunctionTool({
  name: 'exit_loop',
  description:
    'Call only when the reviewed currency answer is complete and needs no more refinement.',
  parameters: z.object({}),
  execute: (_input, context) => {
    if (context) {
      context.actions.escalate = true;
      context.actions.skipSummarization = true;
    }

    return {};
  },
});
