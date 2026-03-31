import { Member } from "../src/domain/entities/Member";
import { Plan } from "../src/domain/entities/Plan";
import {
  BradescoPricingStrategy,
  SulAmericaPricingStrategy,
} from "../src/domain/services/IPricingStrategy";
import { PricingService } from "../src/domain/services/PricingService";

describe("PricingService", () => {
  it("should calculate the correct value using bradesco strategy", () => {
    const plan = new Plan("plan-1", "Gold Plan", 100.0);
    const members = [
      new Member("João", 35, true),
      new Member("Maria", 5, false),
    ];

    const service = new PricingService(new BradescoPricingStrategy());

    const total = service.calculateTotal(plan, members);
    expect(total).toBe(210);
  });

  it("should calculate the correct value using sulamerica strategy", () => {
    const plan = new Plan("plan-2", "Gold Plan", 200.0);
    const members = [
      new Member("João", 45, true),
      new Member("Maria", 15, false),
    ];

    const service = new PricingService(new SulAmericaPricingStrategy());

    const total = service.calculateTotal(plan, members);
    expect(total).toBe(1200);
  });

  it("should return 0 if the list of members is empty", () => {
    const plan = new Plan("plan-3", "Gold Plan", 100.0);

    const service = new PricingService(new SulAmericaPricingStrategy());
    expect(service.calculateTotal(plan, [])).toBe(0);
  });
});
