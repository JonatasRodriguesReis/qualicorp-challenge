import { Member } from "../src/domain/entities/Member";

describe("Member Entity", () => {
  it("should create a new member", () => {
    const member = new Member("Jonatas", 29, true);
    expect(member.name).toBe("Jonatas");
  });

  it("should throw error if age is negative", () => {
    expect(() => new Member("Erro", -1, true)).toThrow("Invalid age");
  });
});
