# FuelEU Maritime Compliance Platform

A full-stack application for managing FuelEU Maritime compliance, implementing the requirements of Fuel EU Maritime Regulation (EU) 2023/1805.

## Overview

This platform provides:
- **Routes Management**: View, filter, and set baseline routes
- **Comparison**: Compare GHG intensity against baselines with compliance status
- **Banking**: Bank surplus compliance balance (Article 20)
- **Pooling**: Create pools to share compliance balance (Article 21)

## Architecture Summary

Both frontend and backend follow **Hexagonal Architecture** (Ports & Adapters):

### Backend Structure
```
backend/src/
├── core/
│   ├── domain/          # Entities, business rules
│   ├── application/     # Use cases
│   └── ports/
│       ├── inbound/     # Service interfaces
│       └── outbound/    # Repository interfaces
├── adapters/
│   ├── inbound/http/    # Express controllers
│   └── outbound/postgres/ # Repository implementations
└── infrastructure/
    └── server/          # Express app setup
```

### Frontend Structure
```
frontend/src/
├── core/
│   ├── domain/          # Entities, types
│   └── ports/           # API interfaces
├── adapters/
│   └── ui/
│       ├── components/  # React components
│       └── hooks/       # Custom React hooks
└── infrastructure/
    └── api/             # API client implementations
```

## Setup & Run Instructions

### Prerequisites
- Node.js 18+ 
- npm 9+

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` with API proxy to backend.

### Running Both

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend && npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

## How to Execute Tests

### Backend Tests
```bash
cd backend
npm test           # Run all tests
npm test -- --coverage  # With coverage
```

### Frontend Tests
```bash
cd frontend
npm test           # Run all tests (watch mode)
npm run test:coverage  # With coverage
```

## API Endpoints

### Routes
- `GET /routes` - Get all routes (with optional filters: vesselType, fuelType, year)
- `POST /routes/:id/baseline` - Set route as baseline
- `GET /routes/comparison` - Get baseline vs other routes comparison

### Compliance
- `GET /compliance/cb?shipId&year` - Calculate compliance balance
- `GET /compliance/adjusted-cb?shipId&year` - Get CB after bank applications

### Banking
- `GET /banking/records?shipId&year` - Get bank records
- `POST /banking/bank` - Bank positive CB
- `POST /banking/apply` - Apply banked surplus

### Pooling
- `POST /pools` - Create pool with members
- `GET /pools/:id/members` - Get pool members

## Sample Requests/Responses

### Get All Routes
```bash
curl http://localhost:3001/routes
```

Response:
```json
[
  {
    "id": "uuid",
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91.0,
    "fuelConsumption": 5000,
    "distance": 12000,
    "totalEmissions": 4500,
    "isBaseline": true
  }
]
```

### Set Baseline
```bash
curl -X POST http://localhost:3001/routes/R002/baseline
```

### Get Comparison
```bash
curl http://localhost:3001/routes/comparison
```

Response:
```json
[
  {
    "baseline": { "routeId": "R001", "ghgIntensity": 91.0, ... },
    "comparison": { "routeId": "R002", "ghgIntensity": 88.0, ... },
    "percentDiff": -3.30,
    "compliant": true
  }
]
```

### Create Pool
```bash
curl -X POST http://localhost:3001/pools \
  -H "Content-Type: application/json" \
  -d '{
    "year": 2024,
    "members": [
      { "shipId": "SHIP1", "cb": 1000 },
      { "shipId": "SHIP2", "cb": -500 }
    ]
  }'
```

## Key Formulas

- **Target Intensity (2025)**: 89.3368 gCO₂e/MJ (2% below 91.16)
- **Energy in Scope**: fuelConsumption × 41,000 MJ/t
- **Compliance Balance**: (Target − Actual) × Energy in Scope
- **Percent Difference**: ((comparison / baseline) − 1) × 100

## Seed Data

| routeId | vesselType | fuelType | year | ghgIntensity | fuelConsumption | distance | totalEmissions |
|---------|------------|----------|------|--------------|-----------------|----------|----------------|
| R001    | Container  | HFO      | 2024 | 91.0         | 5000            | 12000    | 4500           |
| R002    | BulkCarrier| LNG      | 2024 | 88.0         | 4800            | 11500    | 4200           |
| R003    | Tanker     | MGO      | 2024 | 93.5         | 5100            | 12500    | 4700           |
| R004    | RoRo       | HFO      | 2025 | 89.2         | 4900            | 11800    | 4300           |
| R005    | Container  | LNG      | 2025 | 90.5         | 4950            | 11900    | 4400           |

## Technology Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- Jest (testing)
- ESLint + Prettier

**Frontend:**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Recharts
- Vitest (testing)
- ESLint

## License

MIT