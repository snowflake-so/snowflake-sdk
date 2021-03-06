import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { FeeSource, Job, TriggerType, UnixTimeStamp } from "../model/job";
import { RECURRING_FOREVER } from "../config";
import { ErrorMessage } from "../config/error";

export class JobBuilder {
  private job: Job = new Job();

  constructor() {}

  fromExistingJob(job: Job): JobBuilder {
    this.job = job;
    return this;
  }

  jobName(name: string): JobBuilder {
    this.job.name = name;
    return this;
  }

  jobInstructions(instructions: TransactionInstruction[]): JobBuilder {
    this.job.instructions = instructions;
    return this;
  }

  scheduleOnce(executionTime: UnixTimeStamp): JobBuilder {
    this.job.triggerType = TriggerType.Time;
    this.job.recurring = false;
    this.job.nextExecutionTime = executionTime;
    return this;
  }

  scheduleCron(
    cron: string,
    numberOfExecutions?: number,
    userTimezoneOffset?: UnixTimeStamp
  ): JobBuilder {
    this.job.triggerType = TriggerType.Time;
    this.job.recurring = true;
    this.job.cron = cron;
    this.job.remainingRuns =
      numberOfExecutions === undefined ? RECURRING_FOREVER : numberOfExecutions;

    this.job.userUtcOffset =
      userTimezoneOffset === undefined
        ? new Date().getTimezoneOffset() * 60
        : userTimezoneOffset;
    return this;
  }

  scheduleConditional(numberOfExecutions: number): JobBuilder {
    this.job.triggerType = TriggerType.ProgramCondition;
    this.job.remainingRuns = numberOfExecutions;
    return this;
  }

  selfFunded(isSelfFunded: boolean): JobBuilder {
    this.job.payFeeFrom = isSelfFunded
      ? FeeSource.FromFlow
      : FeeSource.FromFeeAccount;
    return this;
  }

  initialFund(amount: number): JobBuilder {
    if (this.job.payFeeFrom !== FeeSource.FromFlow) {
      throw new Error(ErrorMessage.JobNotBuiltAsSelfFunded);
    }
    this.job.initialFund = amount;
    return this;
  }

  byAppId(appId: PublicKey): JobBuilder {
    this.job.appId = appId;
    return this;
  }

  build() {
    return this.job;
  }
}
