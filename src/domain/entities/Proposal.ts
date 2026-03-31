import { Member } from "./Member";
import { Plan } from "./Plan";

export enum ProposalStatus {
  DRAFT = "DRAFT",
  PAID = "PAID",
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
}

export class Proposal {
  private _members: Member[] = [];
  private _status: ProposalStatus = ProposalStatus.DRAFT;
  private _totalPrice: number = 0;

  constructor(public readonly id: string, public readonly plan: Plan) {}

  get status(): ProposalStatus {
    return this._status;
  }
  get members(): Member[] {
    return [...this._members];
  }
  get totalPrice(): number {
    return this._totalPrice;
  }

  addMember(member: Member): void {
    if (this._status !== ProposalStatus.DRAFT) {
      throw new Error("Cannot modify members on a processed proposal.");
    }

    if (member.isHolder && this._members.some((m) => m.isHolder)) {
      throw new Error("Proposal already has a primary holder.");
    }

    this._members.push(member);
  }

  setPrice(price: number): void {
    if (price <= 0)
      throw new Error("Proposal price must be greater than zero.");
    this._totalPrice = price;
  }

  setStatus(status: ProposalStatus): void {
    //TODO: Implement status transition rules (e.g., can't go from ACTIVE back to DRAFT)
    this._status = status;
  }

  pay(): void {
    if (this._totalPrice <= 0)
      throw new Error("Price must be defined before payment.");
    if (this._status !== ProposalStatus.DRAFT)
      throw new Error("Invalid status for payment.");

    this._status = ProposalStatus.PAID;
  }

  activate(): void {
    if (this._status !== ProposalStatus.PAID) {
      throw new Error(
        "A proposal can only be activated after successful payment."
      );
    }
    this._status = ProposalStatus.ACTIVE;
  }
}
