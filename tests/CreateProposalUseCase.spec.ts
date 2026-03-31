import { Plan } from "../src/domain/entities/Plan";
import { PricingService } from "../src/domain/services/PricingService";
import { CreateProposalUseCase } from "../src/application/use-cases/CreateProposalUseCase";
import { BradescoPricingStrategy } from "../src/domain/services/IPricingStrategy";

describe("CreateProposalUseCase", () => {
  const mockPlan = new Plan("plan-gold", "Gold", 300.0);

  const mockPlanRepo = {
    findById: jest.fn().mockResolvedValue(mockPlan),
    save: jest.fn(),
    findAll: jest.fn(),
  };

  const mockPropRepo = {
    save: jest.fn().mockResolvedValue(null),
    findById: jest.fn(),
  };

  const pricingService = new PricingService(new BradescoPricingStrategy());
  const useCase = new CreateProposalUseCase(
    mockPropRepo,
    mockPlanRepo,
    pricingService
  );

  it("should create proposal and calculate price using bradesco", async () => {
    const input = {
      planId: "plan-gold",
      members: [
        { name: "Jonatas", age: 30, isHolder: true },
        { name: "Child", age: 10, isHolder: false },
      ],
    };

    const id = await useCase.execute(input);

    expect(id).toBeDefined();
    expect(mockPlanRepo.findById).toHaveBeenCalledWith("plan-gold");

    const savedProposal = (mockPropRepo.save as jest.Mock).mock.calls[0][0];
    expect(savedProposal.totalPrice).toBe(630.0);
    expect(savedProposal.members.length).toBe(2);
  });

  it("should fail if the plan does not exist", async () => {
    mockPlanRepo.findById.mockResolvedValueOnce(null);

    const input = { planId: "invalid", members: [] };

    await expect(useCase.execute(input)).rejects.toThrow("Plan not found.");
  });
});
