# DynamoDB Setup Guide

This project uses AWS DynamoDB for player stats, and the server now auto-creates the table if it is missing.

## Local Docker Setup (recommended)

Use Docker Compose to run the app with a local DynamoDB instance.

```bash
docker compose up --build
```

Open the app at:

```bash
http://localhost:4000
```

The server will automatically create the `HangmanPlayers` table in the local DynamoDB container.

## Environment Variables

Create a `.env` file in the project root or export these variables in your shell.

```bash
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=HangmanPlayers
DYNAMODB_USE_LOCAL=true
DYNAMODB_LOCAL_ENDPOINT=http://dynamodb:8000
```

For a real AWS deployment, use:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
DYNAMODB_TABLE_NAME=HangmanPlayers
DYNAMODB_USE_LOCAL=false
```

## Table Schema

The table is created with the following schema:

- `name` (String) - partition key
- `wins` (Number)
- `losses` (Number)

## How It Works

- The Express server connects to DynamoDB using AWS SDK v3.
- If `DYNAMODB_USE_LOCAL=true`, it connects to the local DynamoDB container.
- If the table does not exist, the server creates it automatically on startup.
- Player data is stored via the API endpoints:
  - `GET /api/player?name=NAME`
  - `POST /api/player`
  - `PUT /api/player/:name`

## Running Locally Without Docker

1. Install dependencies:

```bash
npm install
```

2. Start the backend:

```bash
npm start
```

3. In another terminal, start the frontend:

```bash
npm run dev
```

## Troubleshooting

- If you see a credentials error, verify `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION`.
- If the table is missing, the server will create it automatically.
- If you want to use a different table name, set `DYNAMODB_TABLE_NAME`.

## Notes

- The local `data/players.json` file is no longer used for persistence.
- Docker Compose is the fastest way to run the full stack with DynamoDB locally.
