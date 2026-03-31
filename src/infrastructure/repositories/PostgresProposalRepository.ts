import { Pool } from "pg";
import { IProposalRepository } from "../../domain/repositories/IProposalRepository";
import { Proposal, ProposalStatus } from "../../domain/entities/Proposal";
import { Plan } from "../../domain/entities/Plan";
import { Coverage } from "../../domain/entities/Coverage";
import { randomUUID } from "crypto";
import { Member } from "../../domain/entities/Member";

export class PostgresProposalRepository implements IProposalRepository {
  constructor(private readonly pool: Pool) {}

  async save(proposal: Proposal): Promise<void> {
    const client = await this.pool.connect();

    try {
      await client.query("BEGIN");

      const proposalQuery = `
        INSERT INTO proposals (id, plan_id, total_price, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET 
          status = EXCLUDED.status, 
          total_price = EXCLUDED.total_price;
      `;
      await client.query(proposalQuery, [
        proposal.id,
        proposal.plan.id,
        proposal.totalPrice,
        proposal.status,
      ]);

      // clean the old members
      await client.query(
        "DELETE FROM proposal_members WHERE proposal_id = $1",
        [proposal.id]
      );

      // insert new members
      const memberQuery = `
        INSERT INTO proposal_members (id, proposal_id, name, age, is_holder)
        VALUES ($1, $2, $3, $4, $5);
      `;

      for (const member of proposal.members) {
        await client.query(memberQuery, [
          randomUUID(), // ID do registro do membro
          proposal.id,
          member.name,
          member.age,
          member.isHolder,
        ]);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id: string): Promise<Proposal | null> {
    const query = `
      SELECT 
        p.id AS prop_id, p.status AS prop_status, p.total_price AS prop_price,
        pl.id AS plan_id, pl.name AS plan_name, pl.base_price AS plan_base_price,
        c.id AS cov_id, c.name AS cov_name, c.description AS cov_desc,
        m.id AS m_id, m.name AS m_name, m.age AS m_age, m.is_holder AS m_is_holder
      FROM proposals p
      JOIN plans pl ON p.plan_id = pl.id
      LEFT JOIN plan_coverages pc ON pl.id = pc.plan_id
      LEFT JOIN coverages c ON pc.coverage_id = c.id
      LEFT JOIN proposal_members m ON p.id = m.proposal_id
      WHERE p.id = $1
    `;

    const res = await this.pool.query(query, [id]);
    if (res.rows.length === 0) return null;

    const rows = res.rows;
    const first = rows[0];

    // 1. Rebuild the Plan Aggregate Root
    const plan = new Plan(
      first.plan_id,
      first.plan_name,
      Number(first.plan_base_price)
    );

    // 2. Track unique IDs to avoid duplicates from the Cartesian Product
    const coverageIds = new Set<string>();
    const memberIds = new Set<string>();

    // 3. Rebuild the Proposal Aggregate Root
    const proposal = new Proposal(first.prop_id, plan);

    // Bypass private setters for rehydration if necessary,
    // or use your public methods if they allow state restoration
    proposal.setPrice(Number(first.prop_price));
    proposal.setStatus(first.prop_status as ProposalStatus);

    rows.forEach((row) => {
      // Add unique Coverages to the Plan
      if (row.cov_id && !coverageIds.has(row.cov_id)) {
        plan.addCoverage(new Coverage(row.cov_id, row.cov_name, row.cov_desc));
        coverageIds.add(row.cov_id);
      }

      // Add unique Members to the Proposal
      const memberKey = row.m_id;
      if (row.m_name && !memberIds.has(memberKey)) {
        proposal.addMember(new Member(row.m_name, row.m_age, row.m_is_holder));
        memberIds.add(memberKey);
      }
    });

    return proposal;
  }
}
