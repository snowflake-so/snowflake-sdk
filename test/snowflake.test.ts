import { AnchorProvider } from "@project-serum/anchor";
import { instructions, tomorrow } from "./test-data";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Snowflake } from "../src/service/snowflake";
import { JobBuilder } from "../src/builder/job-builder";
import { Job, TriggerType } from "../src/model/job";

let provider: AnchorProvider;
let snowflake: Snowflake;
let owner: PublicKey;
let testJobs: Job[] = [];

jest.setTimeout(60 * 1000);

beforeAll(() => {
  const API_URL = clusterApiUrl("devnet");
  provider = AnchorProvider.local(API_URL);
  snowflake = new Snowflake(provider);
  owner = provider.wallet.publicKey;
});

afterEach(async () => {
  if (testJobs && testJobs.length) {
    console.log('Jobs to be cleaned up', testJobs.length);

    for (let i = testJobs.length - 1; i >= 0; i--) {
      const jobToBeDeleted = testJobs[i];
      try {
        await snowflake.deleteJob(jobToBeDeleted.pubKey);
        testJobs.pop();
      } catch (error) {
        console.log('Clean up error', jobToBeDeleted?.pubKey, error);
      }
    }
  }
});

test("create job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  const txId = await snowflake.createJob(registerTestJob(job));
  console.log("create job txn signature ", txId);

  const fetchedJob = await snowflake.fetch(job.pubKey);

  console.log(fetchedJob);

  expect(fetchedJob.name).toBe("hello world");
  expect(fetchedJob.triggerType).toBe(TriggerType.Time);
  expect(fetchedJob.recurring).toBe(false);
  expect(fetchedJob.pubKey).toBeDefined();
  expect(fetchedJob);
});

test("create self-funded job", async function () {
  const job = new JobBuilder()
    .jobName("Self-funded automation")
    .jobInstructions(instructions)
    .scheduleConditional(5)
    .selfFunded(true)
    .initialFund(1000000000)
    .build();

  const txId = await snowflake.createJob(registerTestJob(job));
  console.log("create job txn signature ", txId);

  const fetchedJob = await snowflake.fetch(job.pubKey);

  console.log(fetchedJob);

  expect(fetchedJob.name).toBe("Self-funded automation");
  expect(fetchedJob.triggerType).toBe(TriggerType.ProgramCondition);
  expect(fetchedJob.recurring).toBe(false);
  expect(fetchedJob.pubKey).toBeDefined();
  expect(fetchedJob);
});

test("create job with specific size", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  const txId = await snowflake.createJob(registerTestJob(job), 500);
  console.log("create job with of with specific size txn signature ", txId);
  const fetchedJob = await snowflake.fetch(job.pubKey);
  console.log(fetchedJob);
  expect(fetchedJob.name).toBe("hello world");
});

test("update job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  await snowflake.createJob(registerTestJob(job));

  let fetchedJob = await snowflake.fetch(job.pubKey);

  expect(fetchedJob.name).toBe("hello world");
  expect(fetchedJob.triggerType).toBe(TriggerType.Time);
  expect(fetchedJob.recurring).toBe(false);

  fetchedJob = new JobBuilder()
    .fromExistingJob(fetchedJob)
    .jobName("hello world 2")
    .scheduleCron("0 * * * *", 2)
    .build();

  await snowflake.updateJob(fetchedJob);
  fetchedJob = await snowflake.fetch(job.pubKey);

  expect(fetchedJob.name).toBe("hello world 2");
  expect(fetchedJob.triggerType).toBe(TriggerType.Time);
  expect(fetchedJob.recurring).toBe(true);
});

test("delete job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  await snowflake.createJob(job);

  // Before delete
  let beforeDeleteFetchJobsByOwner = await snowflake.findByOwner(owner);
  expect(beforeDeleteFetchJobsByOwner.length > 0).toBeTruthy();

  // After delete
  await snowflake.deleteJob(job.pubKey);
  let fetchJob = await snowflake.fetch(job.pubKey).catch((err) => {
    expect(err).toBeDefined();
    expect(err.message).toBe(`Account does not exist ${job.pubKey.toString()}`);
  });

  expect(fetchJob).toBeUndefined();

  let afterDeleteFetchJobsByOwner = await snowflake.findByOwner(owner);
  expect(afterDeleteFetchJobsByOwner.length).toBe(
    beforeDeleteFetchJobsByOwner.length - 1
  );
});

test("get Snowflake PDA for user", async function () {
  let pda = await snowflake.getSnowflakePDAForUser(
    new PublicKey("EpmRY1vzTajbur4hkipMi3MbvjbJHKzqEAAqXj12ccZQ")
  );
  expect(pda.toString()).toBe("Bf4nWuxMhAeSPR68viDcZkjh9svsdqPZJCAUWtkvvoko");
});

test("deposit fee account", async function () {
  const amount = 100000;
  const owner = provider.wallet.publicKey;
  let pda = await snowflake.getSnowflakePDAForUser(owner);
  const balanceBeforeDeposit = await provider.connection.getBalance(pda);
  await snowflake.depositFeeAccount(amount);
  const balanceAfterDeposit = await provider.connection.getBalance(pda);

  expect(balanceAfterDeposit).toBe(balanceBeforeDeposit + amount);
});

function registerTestJob(job: Job) {
  testJobs.push(job);
  return job;
}
