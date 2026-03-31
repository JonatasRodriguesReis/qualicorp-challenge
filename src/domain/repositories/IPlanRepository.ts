import { Plan } from "../entities/Plan";

export interface IPlanRepository {
  findById(id: string): Promise<Plan | null>;
  save(plan: Plan): Promise<void>;
  findAll(): Promise<Plan[]>;
}
