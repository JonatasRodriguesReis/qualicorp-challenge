import { IPlanRepository } from "../../domain/repositories/IPlanRepository";
import { Plan } from "../../domain/entities/Plan";

export class InMemoryPlanRepository implements IPlanRepository {
  private plans: Plan[] = [];

  async save(plan: Plan): Promise<void> {
    this.plans.push(plan);
  }

  async findById(id: string): Promise<Plan | null> {
    return this.plans.find((p) => p.id === id) || null;
  }

  async findAll(): Promise<Plan[]> {
    return this.plans;
  }
}
