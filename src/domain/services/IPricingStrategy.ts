import { Member } from "../entities/Member";
import { Plan } from "../entities/Plan";

export interface IPricingStrategy {
  calculate(plan: Plan, members: Member[]): number;
}

// Strategy: Fixed price according to age groups
export class SulAmericaPricingStrategy implements IPricingStrategy {
  calculate(plan: Plan, members: Member[]): number {
    if (members.length === 0) return 0;

    return members.reduce((total, m) => total + (m.age > 40 ? 800 : 400), 0);
  }
}

// Strategy: Base price + 10% for dependents
export class BradescoPricingStrategy implements IPricingStrategy {
  calculate(plan: Plan, members: Member[]): number {
    if (members.length === 0) return 0;

    const base = plan.basePrice || 0;
    return members.reduce(
      (total, m) => total + (m.isHolder ? base : base * 1.1),
      0
    );
  }
}
