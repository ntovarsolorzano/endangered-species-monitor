import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { speciesData } from './data';
import { UserImpact } from './types';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory storage for user impact (simulated database)
export const userImpacts: Record<string, UserImpact> = {};

// Routes

// GET /species - Get all species
app.get('/species', (req: Request, res: Response) => {
  res.json(speciesData);
});

// GET /species/search - Search species
app.get('/species/search', (req: Request, res: Response) => {
  const query = req.query.q as string;
  if (!query) {
     res.status(400).json({ error: 'Query parameter "q" is required' });
     return;
  }

  const searchResults = speciesData.filter(species =>
    species.name.toLowerCase().includes(query.toLowerCase()) ||
    species.scientificName.toLowerCase().includes(query.toLowerCase())
  );

  res.json(searchResults);
});

// GET /species/:id - Get a specific species
app.get('/species/:id', (req: Request, res: Response) => {
  const species = speciesData.find(s => s.id === req.params.id);
  if (!species) {
     res.status(404).json({ error: 'Species not found' });
     return;
  }
  res.json(species);
});

// POST /impact - Record user impact
app.post('/impact', (req: Request, res: Response) => {
  const { userId, actionsTaken, carbonFootprintReduced, donations } = req.body;

  if (!userId || !actionsTaken) {
     res.status(400).json({ error: 'userId and actionsTaken are required' });
     return;
  }

  const impact: UserImpact = {
    userId,
    actionsTaken,
    carbonFootprintReduced: carbonFootprintReduced || 0,
    donations: donations || 0
  };

  userImpacts[userId] = impact;
  res.status(201).json(impact);
});

// GET /impact/:userId - Get user impact
app.get('/impact/:userId', (req: Request, res: Response) => {
  const userId = req.params.userId;
  const impact = userImpacts[userId];

  if (!impact) {
     res.status(404).json({ error: 'User impact not found' });
     return;
  }

  res.json(impact);
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

export default app;
