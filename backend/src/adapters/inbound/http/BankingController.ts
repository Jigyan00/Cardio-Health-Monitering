import { Router, Request, Response } from 'express';
import { BankingService } from '../../../core/ports/inbound/BankingService';

export function createBankingController(bankingService: BankingService): Router {
  const router = Router();

  // GET /banking/records - Get bank records for ship
  router.get('/records', async (req: Request, res: Response) => {
    try {
      const { shipId, year } = req.query;
      
      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const records = await bankingService.getBankRecords(
        shipId as string,
        parseInt(year as string, 10)
      );
      return res.json(records);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  });

  // POST /banking/bank - Bank positive CB
  router.post('/bank', async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;
      
      if (!shipId || !year || amount === undefined) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const result = await bankingService.bankSurplus(shipId, year, amount);
      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  // POST /banking/apply - Apply banked surplus to deficit
  router.post('/apply', async (req: Request, res: Response) => {
    try {
      const { shipId, year, amount } = req.body;
      
      if (!shipId || !year || amount === undefined) {
        return res.status(400).json({ error: 'shipId, year, and amount are required' });
      }

      const result = await bankingService.applyBanked(shipId, year, amount);
      return res.json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  return router;
}
