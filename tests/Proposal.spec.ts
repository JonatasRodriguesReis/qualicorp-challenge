import { Member } from "../src/domain/entities/Member";
import { Plan } from "../src/domain/entities/Plan";
import { Proposal, ProposalStatus } from "../src/domain/entities/Proposal";

describe("Proposal Aggregate", () => {
  const mockPlan = new Plan("plan-1", "Gold Plan", 500.0);

  it("should create a proposal with a valid plan", () => {
    const proposal = new Proposal("prop-1", mockPlan);

    expect(proposal.plan.name).toBe("Gold Plan");
    expect(proposal.status).toBe(ProposalStatus.DRAFT);
  });

  it("should prevent adding multiple holders", () => {
    const proposal = new Proposal("prop-1", mockPlan);
    const h1 = new Member("Holder 1", 30, true);
    const h2 = new Member("Holder 2", 35, true);

    proposal.addMember(h1);
    expect(() => proposal.addMember(h2)).toThrow(
      "Proposal already has a primary holder."
    );
  });
});
