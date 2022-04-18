import { PublicKey, TransactionSignature } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { TransactionSender } from "./transaction-sender";
import Finder from "./finder";
import { InstructionBuilder } from "../builder/instruction-builder";
import { SNOWFLAKE_PROGRAM_ID } from "../config/program-id";
import { FeeSource, Job } from "../model/job";
import { SNOWFLAKE_IDL } from "../idl";
import { Snowflake as SnowflakeType } from "../idl/snowflake";
import { DEFAULT_DEVELOPER_APP_ID, JOB_ACCOUNT_DEFAULT_SIZE } from "../config";

export class Snowflake {
  program: Program<SnowflakeType>;
  instructionBuilder: InstructionBuilder;
  transactionSender: TransactionSender;
  provider: AnchorProvider;
  finder: Finder;
  constructor(provider: AnchorProvider) {
    this.provider = provider;
    this.program = new Program<SnowflakeType>(
      SNOWFLAKE_IDL as any,
      SNOWFLAKE_PROGRAM_ID,
      this.provider
    );
    this.instructionBuilder = new InstructionBuilder(this.program);
    this.transactionSender = new TransactionSender(this.provider);
    this.finder = new Finder(this.program);
  }

  async createJob(
    job: Job,
    accountSize: number = JOB_ACCOUNT_DEFAULT_SIZE
  ): Promise<TransactionSignature> {
    job.validateForCreate();

    const { instructions, signers } =
      this.instructionBuilder.buildCreateJobInstruction(job, accountSize);

    let fundFlowTx;
    if (job.payFeeFrom == FeeSource.FromFlow) {
      const walletPubkey = this.provider.wallet.publicKey;
      fundFlowTx = this.instructionBuilder.buildSystemTransferInstruction(
        walletPubkey,
        signers[0].publicKey,
        job.initialFund
      );
    }
    if (fundFlowTx) {
      instructions.push(...fundFlowTx.instructions);
      signers.push(...fundFlowTx.signers);
    }

    const tx = await this.transactionSender.sendWithWallet({
      instructions,
      signers,
    });

    job.pubKey = signers[0].publicKey;
    return tx;
  }

  async deleteJob(jobPubKey: PublicKey): Promise<TransactionSignature> {
    const { instructions, signers } =
      this.instructionBuilder.buildDeleteJobInstruction(jobPubKey);
    const tx = await this.transactionSender.sendWithWallet({
      instructions,
      signers,
    });

    return tx;
  }

  async updateJob(job: Job): Promise<TransactionSignature> {
    job.validateForUpdate();
    const { instructions, signers } =
      this.instructionBuilder.buildUpdateJobInstruction(job);
    const tx = await this.transactionSender.sendWithWallet({
      instructions,
      signers,
    });

    return tx;
  }

  async fetch(jobPubKey: PublicKey): Promise<Job> {
    return await this.finder.findByJobPubKey(jobPubKey);
  }

  async findByOwner(owner: PublicKey): Promise<Job[]> {
    return await this.finder.findByJobOwner(owner);
  }

  async findGlobal(): Promise<Job[]> {
    return await this.finder.findAll();
  }

  async getSnowflakePDAForUser(
    user: PublicKey,
    developerAppId: PublicKey = DEFAULT_DEVELOPER_APP_ID
  ): Promise<PublicKey> {
    const [pda] = await PublicKey.findProgramAddress(
      [user.toBuffer(), developerAppId.toBuffer()],
      new PublicKey(SNOWFLAKE_PROGRAM_ID)
    );
    return pda;
  }

  async depositFeeAccount(
    lamports: number,
    developerAppId: PublicKey = DEFAULT_DEVELOPER_APP_ID
  ): Promise<string> {
    const walletPubkey = this.provider.wallet.publicKey;
    const pda = await this.getSnowflakePDAForUser(walletPubkey, developerAppId);
    const depositTx = this.instructionBuilder.buildSystemTransferInstruction(
      walletPubkey,
      pda,
      lamports
    );
    const tx = await this.transactionSender.sendWithWallet({
      instructions: depositTx.instructions,
      signers: depositTx.signers,
    });

    return tx;
  }
}
