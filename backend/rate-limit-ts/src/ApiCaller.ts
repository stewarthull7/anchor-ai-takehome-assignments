import { MockAPI } from "./MockAPI";

type Limits = {
  rpm: number;
  tpm: number;
  monitoringInterval: number;
};

export class ApiCaller {
  private apiInstances: MockAPI[];
  private limits: Limits;

  constructor(apiInstances: MockAPI[], limits: Limits) {
    this.apiInstances = apiInstances;
    this.limits = limits;
  }

  async call(tokenCount: number) {
    try {
      return await this.apiInstances[0].callAPI(tokenCount);
    } catch (error) {
      console.log(error);
    }
  }
}
