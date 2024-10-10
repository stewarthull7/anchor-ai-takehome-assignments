import { MockAPI, MockAPIOptions } from "../src/MockAPI";

describe("MockAPI", () => {
  let mockAPI: MockAPI;
  const defaultOptions: MockAPIOptions = {
    rpm: 60,
    tpm: 1000,
    monitoringInterval: 5,
  };

  beforeEach(() => {
    mockAPI = new MockAPI(defaultOptions);
  });

  // Helper function to wait for a specified number of milliseconds
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  test("should allow requests within RPM limit", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(mockAPI.callAPI(10)).resolves.toEqual({ success: true });
    }
  });

  test("should throw error when RPM limit is exceeded", async () => {
    for (let i = 0; i < 5; i++) {
      await mockAPI.callAPI(10);
    }
    await expect(mockAPI.callAPI(10)).rejects.toThrow(
      /429: Rate limit exceeded/,
    );
  });

  test("should allow requests after waiting", async () => {
    for (let i = 0; i < 5; i++) {
      await mockAPI.callAPI(10);
    }
    await expect(mockAPI.callAPI(10)).rejects.toThrow(
      /429: Rate limit exceeded/,
    );

    await wait(5000);
    await expect(mockAPI.callAPI(10)).resolves.toEqual({ success: true });
  });

  test("should allow requests within TPM limit", async () => {
    for (let i = 0; i < 5; i++) {
      await expect(mockAPI.callAPI(15)).resolves.toEqual({ success: true });
    }
  });

  test("should throw error when TPM limit is exceeded", async () => {
    for (let i = 0; i < 5; i++) {
      await mockAPI.callAPI(15);
    }
    await expect(mockAPI.callAPI(25)).rejects.toThrow(
      /429: Rate limit exceeded/,
    );
  });

  test("should throw error when single request exceeds TPM limit", async () => {
    await expect(mockAPI.callAPI(100)).rejects.toThrow(
      /Request token count .* exceeds the per-interval limit/,
    );
  });

  test("should reset limits after monitoring interval", async () => {
    for (let i = 0; i < 5; i++) {
      await mockAPI.callAPI(15);
    }
    await expect(mockAPI.callAPI(25)).rejects.toThrow(
      /429: Rate limit exceeded/,
    );

    await wait(5000);
    for (let i = 0; i < 5; i++) {
      await expect(mockAPI.callAPI(15)).resolves.toEqual({ success: true });
    }
  });

  test("should handle multiple intervals correctly", async () => {
    for (let interval = 0; interval < 3; interval++) {
      for (let i = 0; i < 5; i++) {
        await expect(mockAPI.callAPI(15)).resolves.toEqual({ success: true });
      }
      await expect(mockAPI.callAPI(25)).rejects.toThrow(
        /429: Rate limit exceeded/,
      );
      await wait(5000);
    }
  });
});
