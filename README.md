# ADK Workshop

Google ADK TypeScript agent for currency exchange questions.

The agent exposes one tool, `get_exchange_rate`, which calls the Frankfurter API
for latest or dated exchange rates between two currencies. The system prompt
keeps the agent focused on currency conversion and exchange-rate queries only.

## Run

```sh
pnpm install
pnpm mcp
```

Then, in another terminal:

```sh
pnpm start
```

The agent calls the MCP server at `http://localhost:8080/mcp` by default.
Override with `MCP_SERVER_URL=http://localhost:8082/mcp pnpm start`.

For the ADK web UI:

```sh
pnpm mcp
```

Then, in another terminal:

```sh
pnpm web
```

For the MCP server:

```sh
pnpm mcp
```

Endpoint: `http://localhost:8080/mcp`

For the MCP Inspector:

```sh
pnpm mcp
```

Then, in another terminal:

```sh
npx -y @modelcontextprotocol/inspector
```

Use these Inspector dashboard settings:

- Transport: `Streamable HTTP`
- URL: `http://localhost:8080/mcp`
- Auth: none

## Project

- `src/currency-agent/agent.ts`: agent definition and exchange-rate tool
- `src/mcp-server/server.ts`: Streamable HTTP MCP server
- `package.json`: ADK scripts and dependencies
