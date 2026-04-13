# Hangman Vite React

A React hangman game backed by Express and DynamoDB, with Docker support for local and production use.

## Features

- **Current Hangman Figure:** PNG-based drawing that adds a body part for each wrong guess.
- **On-Screen Keyboard:** Clickable/touchable keyboard for letter selection, plus physical keyboard support.
- **Used Letters Display:** Shows all letters the user has already chosen.
- **New Game Button:** Instantly starts a new round with a random word.
- **Win/Lose Pop-Up:** Modal dialog indicating whether the game is won or lost, and revealing the word.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Express + AWS DynamoDB
- **Styling:** Plain CSS
- **Containerization:** Docker + Docker Compose

## Initialization

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Update `.env` for your chosen setup.

- For local Docker + DynamoDB:

```bash
AWS_REGION=us-east-1
DYNAMODB_TABLE_NAME=HangmanPlayers
DYNAMODB_USE_LOCAL=true
DYNAMODB_LOCAL_ENDPOINT=http://dynamodb:8000
```

- For AWS DynamoDB:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
DYNAMODB_TABLE_NAME=HangmanPlayers
DYNAMODB_USE_LOCAL=false
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the backend server:

```bash
npm start
```

3. Start the frontend:

```bash
npm run dev
```

The frontend proxies API requests to `http://localhost:4000`.

## Docker + DynamoDB Local

Run the app together with a local DynamoDB instance:

```bash
docker compose up --build
```

Then open the app at:

```bash
http://localhost:4000
```

The server will automatically create the `HangmanPlayers` table if it is missing.

## Production / AWS Setup

Set these environment variables for a real AWS deployment:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
DYNAMODB_TABLE_NAME=HangmanPlayers
DYNAMODB_USE_LOCAL=false
```

Then start the server:

```bash
npm start
```

## Notes

- Player win/loss stats are stored in DynamoDB.
- The Express server serves both the API and the built frontend assets in production.
- In development, Vite proxies `/api` requests to the backend.

![alt text](image-1.png)