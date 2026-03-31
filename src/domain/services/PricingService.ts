import { Member } from "../entities/Member";
import { Plan } from "../entities/Plan";

export interface PriceRule {
  minAge: number;
  maxAge: number;
  value: number;
}

export class PricingService {
  private readonly defaultRules: PriceRule[] = [
    { minAge: 0, maxAge: 18, value: 200.0 },
    { minAge: 19, maxAge: 40, value: 450.0 },
    { minAge: 41, maxAge: 120, value: 800.0 },
  ];

  calculateTotal(plan: Plan, members: Member[]): number {
    if (members.length === 0) return 0;

    const membersPrice = members.reduce((total, member) => {
      const rule = this.findRuleForAge(member.age);
      return total + rule.value;
    }, 0);

    const basePrice = plan.basePrice || 0;

    return basePrice + membersPrice;
  }

  private findRuleForAge(age: number): PriceRule {
    const rule = this.defaultRules.find(
      (r) => age >= r.minAge && age <= r.maxAge
    );

    if (!rule) {
      throw new Error(`None price rule found for the age: ${age}`);
    }

    return rule;
  }
}
