import { Router, Request, Response } from 'express';
import { RouteService } from '../../../core/ports/inbound/RouteService';

export function createRouteController(routeService: RouteService): Router {
  const router = Router();

  // GET /routes - Get all routes with optional filters
  router.get('/', async (req: Request, res: Response) => {
    try {
      const { vesselType, fuelType, year } = req.query;
      
      if (vesselType || fuelType || year) {
        const routes = await routeService.filterRoutes({
          vesselType: vesselType as string | undefined,
          fuelType: fuelType as string | undefined,
          year: year ? parseInt(year as string, 10) : undefined,
        });
        return res.json(routes);
      }
      
      const routes = await routeService.getAllRoutes();
      return res.json(routes);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: message });
    }
  });

  // POST /routes/:id/baseline - Set route as baseline
  router.post('/:id/baseline', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const route = await routeService.setBaseline(id);
      return res.json(route);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  // GET /routes/comparison - Get baseline vs other routes comparison
  router.get('/comparison', async (req: Request, res: Response) => {
    try {
      const comparisons = await routeService.getComparison();
      return res.json(comparisons);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(400).json({ error: message });
    }
  });

  return router;
}
