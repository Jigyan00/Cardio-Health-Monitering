import { Router, Request, Response } from 'express';
import { PoolingService } from '../../../core/ports/inbound/PoolingService';

export function createPoolingController(poolingService: PoolingService): Router {
  const router = Router();

  // POST /pools - Create a pool
  router.post('/', async (req: Request, res: Response) => {
    try {
      const { year, members } = req.body;
      
      if (!year || !members || !Array.isArray(members)) {
        return res.status(400).json({ 
          error: 'year and members array are required' 
        });
      }

      // Validate members structure
      for (const member of members) {
        if (!member.shipId || member.cb === undefined) {
          return res.status(400).json({ 
            error: 'Each member must have shipId and cb' 
          });
        }
      }

      const result = await poolingService.createPool(year, members);
      return res.status(201).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  // GET /pools/:id/members - Get pool members
  router.get('/:id/members', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const members = await poolingService.getPoolMembers(id);
      return res.json(members);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  });

  return router;
}
