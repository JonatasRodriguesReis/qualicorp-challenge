import { Pool } from "pg";
import { IPlanRepository } from "../../domain/repositories/IPlanRepository";
import { Plan } from "../../domain/entities/Plan";
import { Coverage } from "../../domain/entities/Coverage";

export class PostgresPlanRepository implements IPlanRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Plan | null> {
    const query = `
      SELECT p.*, c.id as cov_id, c.name as cov_name, c.description as cov_desc
      FROM plans p
      LEFT JOIN plan_coverages pc ON p.id = pc.plan_id
      LEFT JOIN coverages c ON pc.coverage_id = c.id
      WHERE p.id = $1
    `;
    const res = await this.pool.query(query, [id]);
    if (res.rows.length === 0) return null;

    const firstRow = res.rows[0];
    const plan = new Plan(
      firstRow.id,
      firstRow.name,
      Number(firstRow.base_price)
    );

    res.rows.forEach((row) => {
      if (row.cov_id) {
        plan.addCoverage(new Coverage(row.cov_id, row.cov_name, row.cov_desc));
      }
    });

    return plan;
  }

  async save(plan: Plan): Promise<void> {
    const query = `
      INSERT INTO plans (id, name, base_price)
      VALUES ($1, $2, $3)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        base_price = EXCLUDED.base_price;
    `;
    await this.pool.query(query, [plan.id, plan.name, plan.basePrice]);

    // Handle coverages
    await this.pool.query("DELETE FROM plan_coverages WHERE plan_id = $1", [
      plan.id,
    ]);
    for (const cov of plan.coverages) {
      await this.pool.query(
        "INSERT INTO plan_coverages (plan_id, coverage_id) VALUES ($1, $2)",
        [plan.id, cov.id]
      );
    }
  }

  async findAll(): Promise<Plan[]> {
    const res = await this.pool.query("SELECT * FROM plans");
    return res.rows.map((r) => new Plan(r.id, r.name, Number(r.base_price)));
  }
}
