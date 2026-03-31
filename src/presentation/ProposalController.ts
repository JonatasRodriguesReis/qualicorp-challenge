import { Request, Response } from "express";
import { CreateProposalUseCase } from "../application/use-cases/CreateProposalUseCase";
import { GetProposalDetailsUseCase } from "../application/use-cases/GetProposalDetailsUseCase";

export class ProposalController {
  constructor(
    private readonly createProposalUseCase: CreateProposalUseCase,
    private readonly getDetailsUseCase: GetProposalDetailsUseCase
  ) {}

  async handleCreate(req: Request, res: Response) {
    try {
      const proposalId = await this.createProposalUseCase.execute(req.body);
      return res.status(201).json({ proposalId });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async handleGet(req: Request, res: Response) {
    try {
      const proposalId: string = req.params.id as string;
      const details = await this.getDetailsUseCase.execute(proposalId);
      return res.json(details);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }
}
