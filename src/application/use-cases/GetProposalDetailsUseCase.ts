import { Coverage } from "../../domain/entities/Coverage";
import { Member } from "../../domain/entities/Member";
import { IProposalRepository } from "../../domain/repositories/IProposalRepository";

export class GetProposalDetailsUseCase {
  constructor(private readonly repository: IProposalRepository) {}

  async execute(proposalId: string) {
    const data = await this.repository.findById(proposalId);

    if (!data) throw new Error("Proposal not found");

    // Agrupando as coberturas (já que o JOIN traz uma linha por cobertura)
    return {
      id: data.id,
      status: data.status,
      total: data.totalPrice,
      plan: {
        name: data.plan.name,
        id: data.plan.id,
        coverages: data.plan.coverages.map((row: Coverage) => row.name),
      },
      members: data.members.map((member: Member) => ({
        name: member.name,
        age: member.age,
        isHolder: member.isHolder,
      })),
    };
  }
}
