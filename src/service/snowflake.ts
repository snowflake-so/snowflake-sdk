import { PublicKey, TransactionSignature } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Provider } from "@project-serum/anchor";
import { TransactionSender } from "./transaction-sender";
import Finder from "./finder";
import { InstructionBuilder } from "../builder/instruction-builder";
import { SNOWFLAKE_PROGRAM_ID } from "../config/program-id";
import { FeeSource, Job } from "../model/job";
import { SNOWFLAKE_IDL } from "../idl";
import { DEFAULT_DEVELOPER_APP_ID, JOB_ACCOUNT_DEFAULT_SIZE } from "../config";

export class Snowflake {
  program: Program;
  instructionBuilder: InstructionBuilder;
  transactionSender: TransactionSender;
  provider: AnchorProvider;
  finder: Finder;
  constructor(provider: AnchorProvider) {
    this.provider = provider;
    this.program = new Program(
      SNOWFLAKE_IDL as Idl,
      SNOWFLAKE_PROGRAM_ID,
      this.provider
    );
    this.instructionBuilder = new InstructionBuilder(this.program, this.provider);
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

  async findByJobAppId(appId: PublicKey): Promise<Job[]> {
    return await this.finder.findByJobAppId(appId);
  }

  async findByOwnerAndAppId(owner: PublicKey, appId: PublicKey): Promise<Job[]> {
    return await this.finder.findByJobOwnerAndAppId(owner, appId);
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
