export class Member {
  constructor(
    public readonly name: string,
    public readonly age: number,
    public readonly isHolder: boolean // Titular
  ) {
    if (age < 0) throw new Error("Invalid age");
  }
}
