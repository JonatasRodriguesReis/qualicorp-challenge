export interface IInsuranceGateway {
  checkEligibility(memberId: string): Promise<boolean>;
}

export class MockInsuranceGateway implements IInsuranceGateway {
  async checkEligibility(memberId: string): Promise<boolean> {
    console.log(
      `[Infrastructure] Checking eligibility for ${memberId} via external API...`
    );
    return true; // Simulating a successful API call
  }
}
