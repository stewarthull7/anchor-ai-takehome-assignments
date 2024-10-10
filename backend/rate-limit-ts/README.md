# Rate-Limited API Challenge

## Overview

This repository contains a take-home assignment designed to test backend skills in TypeScript. The challenge simulates a real-world scenario involving rate-limited APIs, similar to those we use for Azure OpenAI services. The goal is to process a list of API requests in the shortest possible time, while respecting the rate limits.

## Scenario

You are given:

- A `MockAPI` class that simulates an API with rate limits based on **Requests Per Minute (RPM)** and **Tokens Per Minute (TPM)**.
- A list of API requests, each with a randomly generated `tokenCount`.
- Two instances of the `MockAPI`, representing two endpoints.

Your task is improve the implementation of `ApiCaller` located in `src/ApiCaller.ts` so it:

1. Processes all of the requests succesfuly
2. Does so in the shortest possible time

## Rate Limits

The rate limits are:

- **RPM (Requests Per Minute):** 600 requests per minute (10 requests per second).
- **TPM (Tokens Per Minute):** 150,000 tokens per minute (2,500 tokens per second).
- **Monitoring Interval:** The rate limits are calculated over a short interval of **5 seconds**.

If a rate limit is exceeded, the API will respond with a `429` error and a message: `'Please Retry After X seconds'`.

## Getting Started

### Installation

1. **Create a new repository from this template**:
   - Click the "Use this template" button on the top right of this repository's page to create your own copy of the repository.
2. Clone the repository and install dependencies:

```bash
npm install
```

## Running the Tests

To run the tests:

```bash
npm test
```

## Files

- `src/MockAPI.ts`: Simulates the rate-limited API behavior.
- `src/ApiCaller.ts`: Naive implementation that simply calls the mock api endpoint.
- `test/ApiCaller.test.ts`: Test suite that runs the challenge.
- `README.md`: You're reading it.

## Your Task

- Optimize the API caller to process all requests as quickly as possible without exceeding the rate limits.
- Implement any necessary queuing, retry mechanisms, or concurrency controls.
- Use both instances of the MockAPI to distribute the load (e.g., round-robin).

**Important:** Only edit the `ApiCaller.ts` file.

## Submission

- Create your own repository by using this template.
- Implement your solution.
- Submit a pull request explaining your changes and share your repository's link.
