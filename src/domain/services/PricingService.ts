import { Member } from "../entities/Member";
import { Plan } from "../entities/Plan";
import { IPricingStrategy } from "./IPricingStrategy";

export interface PriceRule {
  minAge: number;
  maxAge: number;
  value: number;
}

export class PricingService {
  constructor(private pricingStrategy: IPricingStrategy) {}

  calculateTotal(plan: Plan, members: Member[]): number {
    if (members.length === 0) return 0;

    const totalPrice = this.pricingStrategy.calculate(plan, members);

    return totalPrice;
  }
}
