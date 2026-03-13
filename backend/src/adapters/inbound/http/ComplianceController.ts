import { Router, Request, Response } from 'express';
import { ComplianceService } from '../../../core/ports/inbound/ComplianceService';

export function createComplianceController(complianceService: ComplianceService): Router {
  const router = Router();

  // GET /compliance/cb - Calculate and get compliance balance
  router.get('/cb', async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const result = await complianceService.calculateCB(
        shipId as string,
        parseInt(year as string, 10)
      );
      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  // GET /compliance/adjusted-cb - Get CB after bank applications
  router.get('/adjusted-cb', async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const adjustedCB = await complianceService.getAdjustedCB(
        shipId as string,
        parseInt(year as string, 10)
      );
      return res.json({ shipId, year: parseInt(year as string, 10), adjustedCB });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  return router;
}
