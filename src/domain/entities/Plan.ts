import { Coverage } from "./Coverage";

export class Plan {
  private _coverages: Coverage[] = [];

  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly basePrice?: number
  ) {}

  get coverages(): Coverage[] {
    return [...this._coverages];
  }

  addCoverage(coverage: Coverage): void {
    if (this._coverages.some((c) => c.id === coverage.id)) return;
    this._coverages.push(coverage);
  }
}
