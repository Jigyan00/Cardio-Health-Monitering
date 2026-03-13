import express, { Application } from 'express';
import cors from 'cors';

// Use cases
import { RouteUseCase, ComplianceUseCase, BankingUseCase, PoolingUseCase } from '../../core/application';

// Repositories
import { 
  routeRepository, 
  complianceRepository, 
  bankingRepository, 
  poolRepository 
} from '../../adapters/outbound/postgres';

// Controllers
import { 
  createRouteController, 
  createComplianceController, 
  createBankingController, 
  createPoolingController 
} from '../../adapters/inbound/http';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Initialize use cases with repositories (dependency injection)
  const routeUseCase = new RouteUseCase(routeRepository);
  const complianceUseCase = new ComplianceUseCase(
    complianceRepository,
    routeRepository,
    bankingRepository
  );
  const bankingUseCase = new BankingUseCase(bankingRepository, complianceRepository);
  const poolingUseCase = new PoolingUseCase(poolRepository);

  // Register routes
  app.use('/routes', createRouteController(routeUseCase));
  app.use('/compliance', createComplianceController(complianceUseCase));
  app.use('/banking', createBankingController(bankingUseCase));
  app.use('/pools', createPoolingController(poolingUseCase));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}
