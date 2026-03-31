import { Proposal } from "../../domain/entities/Proposal";
import { Member } from "../../domain/entities/Member";
import { PricingService } from "../../domain/services/PricingService";
import { IProposalRepository } from "../../domain/repositories/IProposalRepository";
import { randomUUID } from "crypto";
import { IPlanRepository } from "../../domain/repositories/IPlanRepository";

// Use it like this:
const proposalId = randomUUID();

export interface CreateProposalInput {
  planId: string;
  members: {
    name: string;
    age: number;
    isHolder: boolean;
  }[];
}

export class CreateProposalUseCase {
  constructor(
    private readonly proposalRepository: IProposalRepository,
    private readonly planRepository: IPlanRepository,
    private readonly pricingService: PricingService
  ) {}

  async execute(input: CreateProposalInput): Promise<string> {
    const plan = await this.planRepository.findById(input.planId);
    if (!plan) throw new Error("Plan not found.");

    // 1. Find the holder (business rule: a proposal needs a holder)
    const holderInput = input.members.find((m) => m.isHolder);
    if (!holderInput) {
      throw new Error("A proposal must have a primary holder.");
    }

    // 2. Initialize the Aggregate Root
    const proposalId = randomUUID();
    const proposal = new Proposal(proposalId, plan);

    // 3. Map input data to Domain Entities
    const domainMembers = input.members.map(
      (m) => new Member(m.name, m.age, m.isHolder)
    );

    // 4. Add members to the aggregate (triggers domain validations)
    domainMembers.forEach((member) => proposal.addMember(member));

    // 5. Use Domain Service to calculate price
    const totalAmount = this.pricingService.calculateTotal(plan, domainMembers);
    proposal.setPrice(totalAmount);

    // 6. Persist the state
    await this.proposalRepository.save(proposal);

    return proposal.id;
  }
}
