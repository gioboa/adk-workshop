# ADK Workshop

Google ADK TypeScript agent for currency exchange questions.

The agent exposes one tool, `get_exchange_rate`, which calls the Frankfurter API
for latest or dated exchange rates between two currencies. The system prompt
keeps the agent focused on currency conversion and exchange-rate queries only.

## Run

```sh
pnpm install
pnpm start
```

For the ADK web UI:

```sh
pnpm web
```

## Project

- `src/currency-agent/agent.ts`: agent definition and exchange-rate tool
- `package.json`: ADK scripts and dependencies
