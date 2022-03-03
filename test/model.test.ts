import { BN } from "@project-serum/anchor";
import { instructions, tomorrow } from "./test-data";
import { JobBuilder } from "../src/builder/job-builder";
import { TriggerType } from "../src/model/job";

test("job conversion test", async function () {
  const job = new JobBuilder()
    .jobName("hello world")
    .jobInstructions(instructions)
    .scheduleOnce(tomorrow())
    .build();

  const serJob = job.toSerializableJob();
  console.log("serJob = ", serJob);
  expect(serJob.name).toBe("hello world");
  expect(serJob.triggerType).toBe(TriggerType.Time);
  expect(serJob.recurring).toBe(false);
  const nextExecutionTime: BN = serJob.nextExecutionTime as BN;
  expect(nextExecutionTime.toNumber()).toBe(job.nextExecutionTime);
  expect(serJob.actions).toHaveLength(1);
});
