import { Provider } from "@project-serum/anchor";
import { instructions, tomorrow } from "./test-data";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Snowflake } from "../src/service/snowflake";
import { JobBuilder } from "../src/builder/job-builder";
import { TriggerType } from "../src/model/job";

let provider: Provider;
let snowflake: Snowflake;
let owner: PublicKey;

beforeAll(() => {
  const API_URL = clusterApiUrl("devnet");
  provider = Provider.local(API_URL);
  snowflake = new Snowflake(provider);
  owner = provider.wallet.publicKey;
});

test("create job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  const txId = await snowflake.createJob(job);
  console.log("create job txn signature ", txId);

  const fetchedJob = await snowflake.fetch(job.pubKey);

  console.log(fetchedJob);

  expect(fetchedJob.name).toBe("hello world");
  expect(fetchedJob.triggerType).toBe(TriggerType.Time);
  expect(fetchedJob.recurring).toBe(false);
  expect(fetchedJob.pubKey).toBeDefined();
  expect(fetchedJob);
});

test("update job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  await snowflake.createJob(job);

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
