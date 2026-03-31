import { Proposal } from "../entities/Proposal";

export interface IProposalRepository {
  save(proposal: Proposal): Promise<void>;
  findById(id: string): Promise<Proposal | null>;
}
