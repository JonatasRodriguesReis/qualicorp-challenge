import {
  BradescoPricingStrategy,
  IPricingStrategy,
  SulAmericaPricingStrategy,
} from "../services/IPricingStrategy";

export class PricingStrategyFactory {
  static create(provider: string): IPricingStrategy {
    const strategies: Record<string, IPricingStrategy> = {
      sulamerica: new SulAmericaPricingStrategy(),
      bradesco: new BradescoPricingStrategy(),
    };

    const strategy = strategies[provider.toLowerCase()];

    if (!strategy) {
      throw new Error(`Pricing Strategy for provider '${provider}' not found.`);
    }

    return strategy;
  }
}
