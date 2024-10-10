import { ApiCaller } from "../src/ApiCaller";
import { MockAPI, MockAPIOptions } from "../src/MockAPI";

const TPM = 150000;
const RPM = 600;
const INTERVAL = 5;
const TIME_BUFFER = 5;
describe("ApiCaller", () => {
  it("should process all requests", async () => {
    const limits: MockAPIOptions = {
      rpm: RPM,
      tpm: TPM,
      monitoringInterval: INTERVAL,
    };

    const apiInstances = Array.from({ length: 2 }, () => new MockAPI(limits));

    const apiCaller = new ApiCaller(apiInstances, limits);
    const numberOfRequests = 60;

    // Generate 600 random token counts between 100 and 200
    const tokenCounts = Array.from(
      { length: numberOfRequests },
      () => Math.floor(Math.random() * 100) + 150,
    );

    const startTime = Date.now();

    const calls = await Promise.all(
      tokenCounts.map((tokenCount) => apiCaller.call(tokenCount)),
    );

    const succesfulCalls = calls.filter((call) => call?.success).length;
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    console.log(
      `Processed ${numberOfRequests} requests in ${duration} seconds`,
    );
    const expectedDuration =
      ((numberOfRequests / RPM) * 60) / apiInstances.length;
    expect(duration).toBeLessThan(TIME_BUFFER + expectedDuration);
    expect(succesfulCalls).toEqual(numberOfRequests);
  });
});
