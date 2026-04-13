import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const useLocalDynamo = process.env.DYNAMODB_USE_LOCAL === 'true';
const region = process.env.AWS_REGION || 'us-east-1';
const dynamoEndpoint = process.env.DYNAMODB_LOCAL_ENDPOINT || 'http://localhost:8000';

const dynamoConfig = {
  region,
  ...(useLocalDynamo
    ? {
        endpoint: dynamoEndpoint,
        credentials: {
          accessKeyId: 'fake-access-key-id',
          secretAccessKey: 'fake-secret-access-key',
        },
      }
    : {}),
};

const client = new DynamoDBClient(dynamoConfig);
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || 'HangmanPlayers';

console.log('DynamoDB Region:', region);
console.log('DynamoDB Local:', useLocalDynamo ? dynamoEndpoint : 'disabled');
console.log('DynamoDB Table:', TABLE_NAME);

const createTableParams = {
  TableName: TABLE_NAME,
  KeySchema: [{ AttributeName: 'name', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'name', AttributeType: 'S' }],
  BillingMode: 'PAY_PER_REQUEST',
};

async function ensureTableExists() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log('DynamoDB table exists:', TABLE_NAME);
  } catch (error) {
    if (
      error.name === 'ResourceNotFoundException' ||
      error.name === 'ResourceNotFound' ||
      error?.$metadata?.httpStatusCode === 404
    ) {
      console.log('Creating DynamoDB table:', TABLE_NAME);
      await client.send(new CreateTableCommand(createTableParams));
      await waitUntilTableExists({ client, maxWaitTime: 30 }, { TableName: TABLE_NAME });
      console.log('DynamoDB table created:', TABLE_NAME);
      return;
    }

    console.error('Error ensuring DynamoDB table exists:', error);
    throw error;
  }
}

function normalizeName(name) {
  return String(name || '').trim().toUpperCase();
}

const app = express();
app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Get player from DynamoDB
async function getPlayer(name) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { name },
    });
    const response = await docClient.send(command);
    return response.Item || null;
  } catch (error) {
    console.error('Error getting player:', error);
    throw error;
  }
}

// Put player to DynamoDB
async function putPlayer(player) {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: player,
    });
    await docClient.send(command);
    return player;
  } catch (error) {
    console.error('Error putting player:', error);
    throw error;
  }
}

// Update player stats in DynamoDB
async function updatePlayer(name, stats) {
  try {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { name },
      UpdateExpression: 'SET wins = :wins, losses = :losses',
      ExpressionAttributeValues: {
        ':wins': stats.wins,
        ':losses': stats.losses,
      },
      ReturnValues: 'ALL_NEW',
    });
    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error('Error updating player:', error);
    throw error;
  }
}

app.get('/api/player', async (req, res) => {
  const name = normalizeName(req.query.name);
  if (!name) {
    return res.status(400).json({ error: 'Missing player name' });
  }

  try {
    const player = await getPlayer(name);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    console.error('GET /api/player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/player', async (req, res) => {
  const name = normalizeName(req.body.name);
  if (!name) {
    return res.status(400).json({ error: 'Missing player name' });
  }

  try {
    const existingPlayer = await getPlayer(name);
    if (existingPlayer) {
      return res.status(409).json({ error: 'Player already exists' });
    }

    const newPlayer = { name, wins: 0, losses: 0 };
    await putPlayer(newPlayer);
    res.status(201).json(newPlayer);
  } catch (error) {
    console.error('POST /api/player error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/player/:name', async (req, res) => {
  const name = normalizeName(req.params.name);
  const { wins, losses } = req.body;

  if (!name || typeof wins !== 'number' || typeof losses !== 'number') {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  try {
    const existingPlayer = await getPlayer(name);
    if (!existingPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const updatedPlayer = await updatePlayer(name, { wins, losses });
    res.json(updatedPlayer);
  } catch (error) {
    console.error('PUT /api/player/:name error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

if (fs.existsSync(distPath)) {
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

async function startServer() {
  if (process.env.NODE_ENV !== 'test') {
    await ensureTableExists();
  }

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Player API server running on http://localhost:${port}`);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export { app };
