import express, { Request, Response } from 'express';
import { knowledgeBaseService } from './knowledgeBaseService';
import { KnowledgeBaseQuery } from './types';

const router = express.Router();

// Query endpoint
router.post('/query', async (req: Request, res: Response) => {
  try {
    const query: KnowledgeBaseQuery = req.body;
    const response = await knowledgeBaseService.getResponse(query);
    res.json(response);
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      code: 'SERVER_ERROR',
      suggestion: 'Please try again later'
    });
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// Metrics endpoint (protected)
router.get('/metrics', (req: Request, res: Response) => {
  // Add authentication middleware
  res.json({
    status: 'success',
    metrics: knowledgeBaseService.getMetrics()
  });
});

export default router; 