import { BN, Program, ProgramAccount } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { GetProgramAccountsFilter, PublicKey } from "@solana/web3.js";
import { Job, SerializableJob } from "../model/job";
import { JOB_ACCOUNT_LAYOUT } from "../model/job-layout";

export default class Finder {
  program: Program;
  constructor(program: Program) {
    this.program = program;
  }

  async findByJobPubKey(jobPubKey: PublicKey): Promise<Job> {
    let serJob: SerializableJob = await this.program.account.flow.fetch(
      jobPubKey
    );
    return Job.fromSerializableJob(serJob, jobPubKey);
  }

  async findByJobOwner(owner: PublicKey): Promise<Job[]> {
    let ownerFilter = this.getOwnerFilter(owner);
    let serJobs: ProgramAccount<SerializableJob>[] =
      await this.program.account.flow.all([ownerFilter]);
    return serJobs.map((v) => Job.fromSerializableJob(v.account, v.publicKey));
  }

  async findByJobAppId(appId: number): Promise<Job[]> {
    let appIdFilter = this.getAppIdFilter(appId);
    let serJobs: ProgramAccount<SerializableJob>[] =
      await this.program.account.flow.all([appIdFilter]);
    return serJobs.map((v) => Job.fromSerializableJob(v.account, v.publicKey));
  }

  async findByJobOwnerAndAppId(
    owner: PublicKey,
    appId: number
  ): Promise<Job[]> {
    let ownerFilter = this.getOwnerFilter(owner);
    let appIdFilter = this.getAppIdFilter(appId);
    let serJobs: ProgramAccount<SerializableJob>[] =
      await this.program.account.flow.all([appIdFilter, ownerFilter]);
    return serJobs.map((v) => Job.fromSerializableJob(v.account, v.publicKey));
  }

  async findAll(): Promise<Job[]> {
    let serJobs: ProgramAccount<SerializableJob>[] =
      await this.program.account.flow.all([]);
    return serJobs.map((v) => Job.fromSerializableJob(v.account, v.publicKey));
  }

  private getOwnerFilter(publicKey: PublicKey): GetProgramAccountsFilter {
    return {
      memcmp: {
        offset: JOB_ACCOUNT_LAYOUT.offsetOf("owner"),
        bytes: publicKey.toBase58(),
      },
    };
  }

  private getAppIdFilter(appId: number): GetProgramAccountsFilter {
    return {
      memcmp: {
        offset: JOB_ACCOUNT_LAYOUT.offsetOf("clientAppId"),
        bytes: bs58.encode(new BN(appId).toBuffer()),
      },
    };
  }
}
