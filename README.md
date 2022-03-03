# Snowflake TypeScript SDK

Snowflake SDK provides services and a set of APIs used for interacting with the automation infrastructure of Snowflake on Solana blockchain. Learn more about Snowflake <a href="https://docs.snowflake.so/en/">here</a>.

## Installation

Install with npm

```bash
npm i @snowflake-so/snowflake-sdk
```

Install with yarn

```bash
yarn add @snowflake-so/snowflake-sdk
```

## Quick start guide

### Initialize Snowflake

To create a new Snowflake service, we would need to initialize with the Provider.

```typescript
let provider: Provider = Provider.local(API_URL);
```

The `API_URL` is the endpoint to the Solana cluster. Empty API_URL is pointed to the `local testnet`

- Mainnet Beta: `https://api.mainnet-beta.solana.com`
- Testnet: `https://api.testnet.solana.com`
- Devnet: `https://api.devnet.solana.com`

```typescript
let snowflake: Snowflake = new Snowflake(provider);
```

### Build an once-off scheduled job

With Snowflake SDK, you can create a job with two line of code.

```typescript
const job = new JobBuilder()
  .jobName("hello world")
  .jobInstructions(instructions)
  .scheduleOnce(tomorrow())
  .build();

await snowflake.createJob(job);
```

### Build a recurring scheduled job

Schedule a job that runs every minute for 10 times.

```typescript
const job = new JobBuilder()
  .jobName("hello world")
  .jobInstructions(instructions)
  .scheduleCron("* * * * *", 10)
  .build();

await snowflake.createJob(job);
```

Schedule a job that runs at 10:00 AM on the first day of every month .

```typescript
const job = new JobBuilder()
  .jobName("hello world")
  .jobInstructions(instructions)
  .scheduleCron("0 10 1 * *")
  .build();

await snowflake.createJob(job);
```
### Build a program condition triggered job

Schedule a job that is triggered based on an arbitrary condition defined within the user program.

```typescript
const job = new JobBuilder()
  .jobName("hello world")
  .jobInstructions(instructions)
  .scheduleConditional(1)
  .build();

await snowflake.createJob(job);
```

### Update a job

```typescript
await snowflake.updateJob(job);
```

### Delete a job

```typescript
await snowflake.deleteJob(jobPubkey);
```

### Fetch Job by public key

```typescript
await snowflake.fetch(jobPubkey);
```

### Fetch Job by owner

```typescript
await snowflake.fetchByOwner(owner);
```

## Usage

```typescript
import {JobBuilder, Snowflake} from "@snowflake-so/snowflake-sdk";
import { Provider } from "@project-serum/anchor";

/** Initialize a Snowflake service on Devnet **/
const API_URL: string = "https://api.devnet.solana.com";
const provider: Provider = new Provider(API_URL);
const snowflake: Snowflake = new Snowflake();

async function main() {
  /** Create a sample instruction **/
  const instructions = [
    {
      programId: new PublicKey("ETwBdF9X2eABzmKmpT3ZFYyUtmve7UWWgzbERAyd4gAC"),
      data: Buffer.from("74b89fceb3e0b22a", "hex"),
      keys: [
        {
          pubkey: new PublicKey("5jo4Lh2Z9FGQ87sDhUBwZjNZdL15MwdeT5WUXKfwFSZY"),
          isSigner: false,
          isWritable: false,
        },
      ],
    },
  ];

  /** Create a new once-off scheduled job **/
  const onceOffJob = new JobBuilder()
    .jobName("once-off job")
    .jobInstructions(instructions)
    .scheduleOnce(1646034062)
    // Timestamp: Monday, 28-Feb-22 07:41:02 UTC
    .build();

  const onceOffJobTxID = await snowflake.createJob(onceOffJob);
  console.log("Create a recurring job with txId: " + onceOffJobTxID);

  /** Create a new recurring scheduled job **/
  const recurringJob = new JobBuilder()
    .jobName("recurring job")
    .jobInstruction(instructions)
    .scheduleCron("* * * * *")
    // Every minute
    .build();

  const recurringJobTxID = await snowflake.createJob(recurringJob);
  console.log("Create a recurring job with txId: " + recurringJobTxID);

  /** Fetch an once-off job **/
  const fetchedOnceOffJob = await snowflake.fetch(onceOffJob.pubkey);

  // Build from an existing job
  const updatedJob = new JobBuilder()
    .fromExistingJob(fetchedOnceOffJob)
    .jobName("hello world 2")
    .scheduleCron("0 * * * *", 2)
    .build();

  /** Update a job **/
  await snowflake.updateJob(updatedJob);

  /** Delete a job **/
  await snowflake.deleteJob(job.pubKey);
}
```

## Support

**Struggle with the SDK integration?**

If you have any problem with using the SDK in your system, drop a question our Snowflake Discord `#sdk` to receive a support from our engineers.

**Find a bug? Find a new idea for Snowflake?**

If you find a bug or have any problem and idea while using the SDK, you can create an issue on Snowflake SDK Github.

## License

MIT
