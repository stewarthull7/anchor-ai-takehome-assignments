import { MockAPI } from "./MockAPI";

type Limits = {
  rpm: number;
  tpm: number;
  monitoringInterval: number;
};

type CallAPIResponse = {
  success: boolean;
} | undefined;

export class ApiCaller {
  private apiInstances: MockAPI[];
  private limits: Limits;
  private queue: Queue;

  constructor(apiInstances: MockAPI[], limits: Limits) {
    this.apiInstances = apiInstances;
    this.limits = limits;
    this.queue = new Queue(
      this.apiInstances.map(apiInstance => new Worker(apiInstance, this.limits))
    );
  }

  async call(tokenCount: number) {
    try {
      return await this.queue.enqueue(tokenCount);
    } catch (error) {
      console.log(error);
    }
  }
}

class Worker {
  private apiInstance: MockAPI;
  private limits: Limits;
  private requestTimestamps: number[] = [];
  private tokenTimestamps: { timestamp: number; tokens: number }[] = [];
  private monitoringIntervalMs: number;
  private requestsPerInterval: number;
  private tokensPerInterval: number;

  constructor(apiInstance: MockAPI, limits: Limits) {
    this.apiInstance = apiInstance;
    this.limits = limits;
    this.monitoringIntervalMs = limits.monitoringInterval * 1000;

    // Calculate limits per interval
    const intervalFraction = this.monitoringIntervalMs / 60000; // Fraction of a minute
    this.requestsPerInterval = Math.ceil(this.limits.rpm * intervalFraction);
    this.tokensPerInterval = Math.ceil(this.limits.tpm * intervalFraction);
  }

  get availableRequests() {
    const now = Date.now();
    const cutoffTime = now - this.monitoringIntervalMs;
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => timestamp > cutoffTime,
    );
    return this.requestsPerInterval - this.requestTimestamps.length;
  }

  get availableTokens() {
    const now = Date.now();
    const cutoffTime = now - this.monitoringIntervalMs;
    this.tokenTimestamps = this.tokenTimestamps.filter(
      ({ timestamp }) => timestamp > cutoffTime,
    );
    return this.tokensPerInterval - this.tokenTimestamps.reduce((sum, { tokens }) => sum + tokens, 0);
  }

  get backoffTime() {
    // Calculate the shortest time until the next interval starts
    return this.monitoringIntervalMs - this.monitoringIntervalMs * Math.min(
      this.availableRequests / this.requestsPerInterval,
      this.availableTokens / this.tokensPerInterval,
    );
  }

  callAPI(tokenCount: number) {
    const now = Date.now();

    // Record the timestamps of the request and tokens
    this.requestTimestamps.push(now);
    this.tokenTimestamps.push({ timestamp: now, tokens: tokenCount });

    return this.apiInstance.callAPI(tokenCount);
  }
}

/**
 * Represents a request to be processed by a worker.
 */
class Request {
  tokenPayload: number;
  resolve: (value: CallAPIResponse) => void;
  reject: (reason?: any) => void;

	constructor(tokenPayload: number, resolve: (value: CallAPIResponse) => void, reject: (reason?: any) => void) {
  	this.tokenPayload = tokenPayload;
    this.resolve = resolve;
    this.reject = reject;
  }
  
  run(worker: Worker) {
  	return worker.callAPI(this.tokenPayload)
    	.then(this.resolve)
      .catch(this.reject)
  }
}

class Queue {
  private queue: Request[];
  private workers: Worker[];
  private isProcessing: boolean;

  constructor(workers: Worker[]) {
    this.queue = [];
    this.workers = workers;
    this.isProcessing = false;
  }

  enqueue(tokenPayload: number): Promise<CallAPIResponse> {
  	return new Promise((resolve, reject) => {
      this.queue.push(new Request(tokenPayload, resolve, reject));
      this.processQueue();
    })
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) return; // Prevent overlapping

    this.isProcessing = true;
    while (this.queue.length > 0) {
      let taskProcessed = false;

      // Try to assign tasks to workers in a round-robin fashion
      for (let i = 0; i < this.workers.length; i++) {
        const worker = this.workers[i];

        if (worker.availableRequests > 0 && worker.availableTokens > 0) {
          const selectedRequests = this.selectRequests(worker.availableRequests, worker.availableTokens);
          if (selectedRequests.length > 0) {
            selectedRequests.forEach(task => task.run(worker));
            taskProcessed = true;
          }
        }
      }

      if (!taskProcessed) {
        // If no worker could process a task, apply a backoff
        const minBackoffTime = Math.min(...this.workers.map(w => w.backoffTime));
        await new Promise(resolve => setTimeout(resolve, minBackoffTime));
      }
    }
    this.isProcessing = false;
  }

  private selectRequests(
    availableRequests: number,
    availableTokens: number,
  ): Request[] {
    const selected: Request[] = [];
    let remainingRequests = availableRequests;
    let remainingTokens = availableTokens;

    // Based on the available requests and tokens for this interval, 
    // find the combination of tasks that attempts to maximize the number of tokens used while respecting the request limit.
    // TODO: Experiment with a DP approach to find the optimal solution
    while (0 < this.queue.length && remainingRequests > 0 && remainingTokens > 0) {
      const task = this.queue.shift();
      if (!task) break;
      if (task.tokenPayload <= remainingTokens) {
        selected.push(task);
        remainingRequests--;
        remainingTokens -= task.tokenPayload;
      } else {
        this.queue.push(task);
        break;
      }
    }

    return selected;
  }
}
