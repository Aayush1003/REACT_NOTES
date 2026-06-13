# Quickstart

This quickstart will get a runnable Node backend and a minimal React frontend running locally so you can explore flow and iterate on prompt composition.

Prerequisites

- Node.js (16+) and npm or yarn installed.

Start the Node backend (example)

1. Open a terminal in `AI-Agent-Architecture/examples/node-backend`.
2. Initialize and install dependencies:

```bash
npm init -y
npm install express node-fetch@2 dotenv
```

3. Create a `.env` file with `OPENAI_API_KEY=your_key_here` (for real model wiring; not required for fake echo server).

4. Start the server:

```bash
node server.js
```

This server listens on port `3001` and exposes `POST /api/ai`.

Run the React frontend (minimal)

1. Open a terminal in `AI-Agent-Architecture/examples/react-frontend`.
2. Initialize and install a simple dev server (or use Vite/CRA):

```bash
npm init -y
npm install react react-dom serve
```

3. To serve `App.jsx` in a real app scaffold, use Vite or Create React App; the file is intentionally minimal to show patterns.

Testing the flow with curl

```bash
curl -X POST http://localhost:3001/api/ai -H "Content-Type: application/json" -d '{"input":"hello"}'
```

Wiring a real OpenAI call (optional)

Replace the fake response in `server.js` with a model call and use `dotenv` to load `OPENAI_API_KEY`. See the `examples/node-backend/server.example.js` for guidance.

Notes and next steps

- The Node example is intentionally small—swap the fake echo for a real model adapter when ready.
- Use the `architecture.md` doc to adjust the API surface and security posture for production.

