import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {createMcpExpressApp} from '@modelcontextprotocol/sdk/server/express.js';
import type {IncomingMessage, ServerResponse} from 'node:http';
import {z} from 'zod/v4';

const PORT = Number(process.env.PORT ?? 8080);

type McpRequest = IncomingMessage & {body?: unknown};
type McpResponse = ServerResponse & {
  headersSent: boolean;
  status(code: number): McpResponse;
  json(body: unknown): void;
};

function createServer() {
  // Create one MCP server instance per HTTP request.
  const server = new McpServer({
    name: 'Currency MCP Server',
    version: '1.0.0',
  });

  // Expose the Frankfurter exchange-rate API as an MCP tool.
  server.registerTool(
    'get_exchange_rate',
    {
      title: 'Get Exchange Rate',
      description: 'Use this to get current or dated exchange rates.',
      inputSchema: {
        currency_from: z
          .string()
          .default('USD')
          .describe('The currency to convert from, e.g. USD.'),
        currency_to: z
          .string()
          .default('EUR')
          .describe('The currency to convert to, e.g. EUR.'),
        currency_date: z
          .string()
          .default('latest')
          .describe('The exchange-rate date in YYYY-MM-DD format, or latest.'),
      },
    },
    async ({currency_from, currency_to, currency_date}) => {
      console.info(
        `Tool get_exchange_rate called for converting ${currency_from} to ${currency_to}`,
      );

      try {
        const url = new URL(`https://api.frankfurter.app/${currency_date}`);
        url.searchParams.set('from', currency_from.toUpperCase());
        url.searchParams.set('to', currency_to.toUpperCase());

        const response = await fetch(url);
        if (!response.ok) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  error: `API request failed: ${response.status} ${response.statusText}`,
                }),
              },
            ],
          };
        }

        const data = await response.json();
        if (!data.rates) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({error: 'Invalid API response format.'}),
              },
            ],
          };
        }

        return {
          content: [{type: 'text', text: JSON.stringify(data)}],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({error: `API request failed: ${error}`}),
            },
          ],
        };
      }
    },
  );

  return server;
}

const app = createMcpExpressApp();

app.post('/mcp', async (req: McpRequest, res: McpResponse) => {
  const server = createServer();

  try {
    // Stateless HTTP transport: every request carries the full MCP exchange.
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);

    // Close per-request resources after Express finishes the response.
    res.on('close', () => {
      transport.close();
      server.close();
    });
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {code: -32603, message: 'Internal server error'},
        id: null,
      });
    }
  }
});

app.listen(PORT, (error: Error | undefined) => {
  if (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }

  console.info(`MCP server listening on http://0.0.0.0:${PORT}/mcp`);
});
