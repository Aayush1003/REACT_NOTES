# Node Backend OpenAI Wiring Example

This file explains how to switch the example server to call OpenAI safely.

Steps:

1. Install dependencies: `npm install node-fetch@2 dotenv`
2. Copy `server.openai.js` to `server.openai.local.js` and add a `.env` with `OPENAI_API_KEY`.
3. Start `node server.openai.js`.

Security notes:

- Store your `OPENAI_API_KEY` in environment variables and do not commit `.env` to source control.
- Prefer using a secrets store (Azure Key Vault, AWS Secrets Manager) in production.
