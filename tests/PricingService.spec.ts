import { Member } from "../src/domain/entities/Member";
import { Plan } from "../src/domain/entities/Plan";
import { PricingService } from "../src/domain/services/PricingService";

describe("PricingService", () => {
  let service: PricingService;

  beforeEach(() => {
    service = new PricingService();
  });

  it("should calculate the correct value for the member 18 years old", () => {
    const plan = new Plan("plan-1", "Gold Plan", 100.0);
    const members = [new Member("João", 18, true)];
    const total = service.calculateTotal(plan, members);
    expect(total).toBe(300.0);
  });

  it("should calculate the correct value for the holder and its dependents", () => {
    const plan = new Plan("plan-1", "Gold Plan", 100.0);

    const members = [
      new Member("Pai", 45, true), // 800.00
      new Member("Filho", 10, false), // 200.00
    ];
    const total = service.calculateTotal(plan, members);
    expect(total).toBe(1100.0);
  });

  it("should return 0 if the list of members is empty", () => {
    const plan = new Plan("plan-1", "Gold Plan", 100.0);

    expect(service.calculateTotal(plan, [])).toBe(0);
  });

  it("should throw an error if the ages is not in the table of prices", () => {
    const plan = new Plan("plan-1", "Gold Plan", 100.0);
    const members = [new Member("Ancião", 150, true)];
    expect(() => service.calculateTotal(plan, members)).toThrow();
  });
});
