import { IProposalRepository } from "../../domain/repositories/IProposalRepository";
import { Proposal } from "../../domain/entities/Proposal";

export class InMemoryProposalRepository implements IProposalRepository {
  private proposals: Proposal[] = [];

  async save(proposal: Proposal): Promise<void> {
    const index = this.proposals.findIndex((p) => p.id === proposal.id);
    if (index >= 0) {
      this.proposals[index] = proposal;
    } else {
      this.proposals.push(proposal);
    }
    console.log(
      `[Infrastructure] Proposal ${proposal.id} saved to In-Memory DB.`
    );
  }

  async findById(id: string): Promise<Proposal | null> {
    return this.proposals.find((p) => p.id === id) || null;
  }
}
