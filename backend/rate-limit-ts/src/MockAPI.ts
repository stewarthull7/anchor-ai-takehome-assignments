export interface MockAPIOptions {
  rpm: number; // Requests per minute
  tpm: number; // Tokens per minute
  monitoringInterval: number; // in seconds (1 or 10)
}

export class MockAPI {
  private rpm: number;
  private tpm: number;
  private monitoringIntervalMs: number; // in milliseconds

  private requestTimestamps: number[] = [];
  private tokenTimestamps: { timestamp: number; tokens: number }[] = [];

  constructor(options: MockAPIOptions) {
    this.rpm = options.rpm;
    this.tpm = options.tpm;
    this.monitoringIntervalMs = options.monitoringInterval * 1000;
  }

  async callAPI(tokenCount: number): Promise<{ success: boolean } | undefined> {
    const now = Date.now();

    // Clean up old timestamps
    const cutoffTime = now - this.monitoringIntervalMs;
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => timestamp > cutoffTime,
    );
    this.tokenTimestamps = this.tokenTimestamps.filter(
      ({ timestamp }) => timestamp > cutoffTime,
    );

    // Calculate limits per interval
    const intervalFraction = this.monitoringIntervalMs / 60000; // Fraction of a minute
    const requestsPerInterval = Math.ceil(this.rpm * intervalFraction);
    const tokensPerInterval = Math.ceil(this.tpm * intervalFraction);

    // Check if tokenCount exceeds tokensPerInterval
    if (tokenCount > tokensPerInterval) {
      throw new Error(
        `Request token count ${tokenCount} exceeds the per-interval limit of ${tokensPerInterval}`,
      );
    }

    // Check RPM limit
    if (this.requestTimestamps.length >= requestsPerInterval) {
      const retryAfter = Math.ceil(
        (this.monitoringIntervalMs - (now - this.requestTimestamps[0])) / 1000,
      );
      throw new Error(
        `429: Rate limit exceeded. Please Retry After ${retryAfter} seconds`,
      );
    }

    // Check TPM limit
    const tokensUsed = this.tokenTimestamps.reduce(
      (sum, { tokens }) => sum + tokens,
      0,
    );
    if (tokensUsed + tokenCount > tokensPerInterval) {
      const retryAfter = Math.ceil(
        (this.monitoringIntervalMs -
          (now - this.tokenTimestamps[0].timestamp)) /
          1000,
      );
      throw new Error(
        `429: Rate limit exceeded. Please Retry After ${retryAfter} seconds`,
      );
    }

    // Record the request and tokens
    this.requestTimestamps.push(now);
    this.tokenTimestamps.push({ timestamp: now, tokens: tokenCount });

    // Simulate API processing time
    return await new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 100),
    );
  }
}
