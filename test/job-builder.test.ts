import { instructions, rightNow, tomorrow } from "./test-data";
import { JobBuilder } from "../src/builder/job-builder";
import { ErrorMessage } from "../src/config/error";
import { FeeSource, TriggerType } from "../src/model/job";

test("build once-off scheduled job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  expect(job.recurring).toBe(false);
  expect(job.name).toBe("hello world");
  expect(job.nextExecutionTime).toBeGreaterThan(rightNow());
});

test("build recurring scheduled job", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleCron("0 * * * *", 2)
    .build();

  expect(job.recurring).toBe(true);
  expect(job.remainingRuns).toBe(2);
  expect(job.name).toBe("hello world");
});

test("build cron weekday job", () => {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleCron("0 * * * 2", 2)
    .build();

  console.log(job);

  expect(job.recurring).toBe(true);
  expect(job.name).toBe("hello world");
  expect(job.triggerType).toBe(TriggerType.Time);
});

test("build self-funded job", () => {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleCron("0 * * * 2", 2)
    .selfFunded(true)
    .initialFund(10000)
    .build();

  console.log(job);

  expect(job.payFeeFrom).toBe(FeeSource.FromFlow);
  expect(job.name).toBe("hello world");
  expect(job.initialFund).toBe(10000);
});

test("build invalid self-funded job", () => {
  try {
    const job = new JobBuilder()
      .jobName("hello world")
      .jobInstructions(instructions)
      .scheduleCron("0 * * * 2", 2)
      .initialFund(10000)
      .selfFunded(true)
      .build();

    console.log(job);
  } catch (error: any) {
    expect(error.message).toBe(ErrorMessage.JobNotBuiltAsSelfFunded);
  }
});
