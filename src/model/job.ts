import { BN } from "@project-serum/anchor";
import {
  AccountMeta,
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import _ from "lodash";
import { RETRY_WINDOW } from "../config/job-config";
import { SNOWFLAKE_PROGRAM_ID } from "../config/program-id";
import { ErrorMessage } from "../config/error";
import { CUSTOM_ACTION_CODE } from "../config";

export type UnixTimeStamp = number;
export type UTCOffset = number;

export enum TriggerType {
  None = 1,
  Time = 2,
  ProgramCondition = 3,
}

const NON_BN_FIELDS = [
  "remainingRuns",
  "triggerType",
  "retryWindow",
  "clientAppId",
  "userUtcOffset",
];

export class Job {
  pubKey: PublicKey;
  owner: PublicKey;
  nextExecutionTime: UnixTimeStamp = 0;
  recurring: boolean = false;
  retryWindow: number = RETRY_WINDOW;
  remainingRuns: number = 0;
  dedicatedOperator: PublicKey;
  clientAppId: number = 0;
  expiryDate: UnixTimeStamp = 0;
  expireOnComplete: boolean = false;
  scheduleEndDate: UnixTimeStamp = 0;
  userUtcOffset: UTCOffset = new Date().getTimezoneOffset() * 60;
  lastScheduledExecution: UnixTimeStamp = 0;
  createdDate: UnixTimeStamp = 0;
  lastRentCharged: UnixTimeStamp = 0;
  lastUpdatedDate: UnixTimeStamp = 0;
  externalId: String = "";
  cron: string = "";
  name: string = "job - " + new Date().toLocaleDateString();
  extra: String = "";
  triggerType: TriggerType = TriggerType.None;
  instructions: TransactionInstruction[] = [];

  isBNType(property: string): boolean {
    return (
      typeof (this as any)[property] === "number" &&
      NON_BN_FIELDS.indexOf(property) < 0
    );
  }

  toSerializableJob(): SerializableJob {
    const serJob = _.cloneDeepWith(
      this,
      function customizer(value, key: any, obj: any): any {
        if (!key) return;
        if (obj.isBNType(key)) return new BN(obj[key]);
        if (obj[key] instanceof PublicKey) return obj[key];
        if (key === "instructions") return [];
      }
    );
    serJob.actions = [];
    for (let instruction of this.instructions) {
      const serAction = SerializableAction.fromInstruction(instruction);
      serJob.actions.push(serAction);
    }
    delete serJob.instructions;
    delete serJob.jobId;
    return serJob;
  }

  isCronWeekday(): boolean {
    const [, , , , weekday] = this.cron.split(" ");
    return !!weekday && weekday !== "*";
  }

  validateForCreate() {
    if (this.isCronWeekday())
      throw new Error(ErrorMessage.CreateJobWithWeekdayCron);
    if (this.pubKey) throw new Error(ErrorMessage.CreateJobWithExistingPubkey);
  }

  validateForUpdate() {
    if (this.isCronWeekday())
      throw new Error(ErrorMessage.UpdateJobWithWeekdayCron);
    if (!this.pubKey)
      throw new Error(ErrorMessage.UpdateJobWithoutExistingPubkey);
  }

  static fromJobJson(jobJson: any): Job {
    const job: Job = new Job();
    Object.assign(job, jobJson);
    return job;
  }

  static fromSerializableJob(
    serJob: SerializableJob,
    jobPubKey: PublicKey
  ): Job {
    const template = new Job();
    const job: Job = _.cloneDeepWith(
      serJob,
      function customizer(value, key: any, obj: any): any {
        if (!key) return;
        if (template.isBNType(key)) {
          return (obj[key] as BN).toNumber();
        }
        if (obj[key] instanceof PublicKey) return obj[key];
        if (key === "actions") return [];
      }
    );
    job.instructions = [];
    for (let action of serJob.actions) {
      const instruction = SerializableAction.toInstruction(action);
      job.instructions.push(instruction);
    }
    delete (job as any).actions;
    job.pubKey = jobPubKey;

    return Job.fromJobJson(job);
  }
}

export type SerializableJob = any;

export class SerializableAction {
  program: PublicKey;
  instruction: Buffer;
  accounts: Array<AccountMeta> = [];
  actionCode: number;
  name: string;
  extra: string;

  static fromInstruction(
    instruction: TransactionInstruction
  ): SerializableAction {
    const serAction = new SerializableAction();
    serAction.program = instruction.programId;
    serAction.accounts = instruction.keys;
    serAction.instruction = instruction.data;
    const openInstruction = instruction as any;
    serAction.actionCode = openInstruction.code
      ? openInstruction.code
      : CUSTOM_ACTION_CODE;
    serAction.name = openInstruction.name ? openInstruction.name : "";
    serAction.extra = openInstruction.extra ? openInstruction.extra : "";
    return serAction;
  }

  static toInstruction(serAction: SerializableAction): TransactionInstruction {
    const instruction: TransactionInstruction = {
      data: serAction.instruction,
      keys: serAction.accounts,
      programId: serAction.program,
    };
    return instruction;
  }
}

export type InstructionsAndSigners = {
  instructions: TransactionInstruction[];
  signers: Signer[];
};
