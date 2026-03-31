import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PostgresProposalRepository } from "./infrastructure/repositories/PostgresProposalRepository";
import { InMemoryProposalRepository } from "./infrastructure/repositories/InMemoryProposalRepository";
import { PricingService } from "./domain/services/PricingService";
import { CreateProposalUseCase } from "./application/use-cases/CreateProposalUseCase";
import { ProposalController } from "./presentation/ProposalController";
import { PostgresPlanRepository } from "./infrastructure/repositories/PostgresPlanRepository";
import { InMemoryPlanRepository } from "./infrastructure/repositories/InMemoryPlanRepository";
import { GetProposalDetailsUseCase } from "./application/use-cases/GetProposalDetailsUseCase";

const app = express();
app.use(express.json());

// 1. Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. Factory for Repository based on ENV
const proposalRepository =
  process.env.DB_TYPE === "postgres"
    ? new PostgresProposalRepository(pool)
    : new InMemoryProposalRepository();
const planRepository =
  process.env.DB_TYPE === "postgres"
    ? new PostgresPlanRepository(pool)
    : new InMemoryPlanRepository();

// 3. Dependency Injection
const pricingService = new PricingService();
const createProposalUseCase = new CreateProposalUseCase(
  proposalRepository,
  planRepository,
  pricingService
);
const getDetailsUseCase = new GetProposalDetailsUseCase(proposalRepository);

// 4. Controller
const controller = new ProposalController(
  createProposalUseCase,
  getDetailsUseCase
);

// 5. Routes
app.post("/proposals", (req, res) => controller.handleCreate(req, res));
app.get("/proposals/:id", (req, res) => controller.handleGet(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `[Main] Server running on port ${PORT} using ${process.env.DB_TYPE} repository`
  );
});
