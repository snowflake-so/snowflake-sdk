import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from '@project-serum/anchor';
import { FeeSource, InstructionsAndSigners, Job } from "../model/job";
import { JOB_ACCOUNT_DEFAULT_SIZE } from "../config/job-config";

export class InstructionBuilder {
  program: Program;
  provider: AnchorProvider;
  constructor(program: Program, provider: AnchorProvider) {
    this.program = program;
    this.provider = provider;
  }

  buildCreateJobInstruction(
    job: Job,
    accountSize: number
  ): InstructionsAndSigners {
    const serializableJob = job.toSerializableJob();
    let newFlowKeyPair = Keypair.generate();

    let createContext: any = {
      accounts: {
        flow: newFlowKeyPair.publicKey,
        owner: this.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    };

    const createIx = this.program.instruction.createFlow(
      accountSize,
      serializableJob,
      createContext
    );

    let instructions = [createIx];
    let signers = [newFlowKeyPair];

    let fundFlowTx;
    if (job.payFeeFrom == FeeSource.FromFlow) {
      const walletPubkey = this.provider.wallet.publicKey;
      fundFlowTx = this.buildSystemTransferInstruction(
        walletPubkey,
        newFlowKeyPair.publicKey,
        job.initialFund
      );
    }

    if (fundFlowTx) {
      instructions.push(...fundFlowTx.instructions);
      signers.push(...fundFlowTx.signers);
    }
    return { instructions: instructions, signers: signers };
  }

  buildUpdateJobInstruction(job: Job) {
    const serializableJob = job.toSerializableJob();
    let updateContext: any = {
      accounts: {
        flow: job.pubKey,
        owner: this.provider.wallet.publicKey,
      },
      signers: [],
    };

    const updateIx = this.program.instruction.updateFlow(
      serializableJob,
      updateContext
    );
    return { instructions: [updateIx], signers: [] };
  }

  buildDeleteJobInstruction(jobPubKey: PublicKey) {
    let deleteContext: any = {
      accounts: {
        flow: jobPubKey,
        owner: this.provider.wallet.publicKey,
      },
      signers: [],
    };

    const deleteIx = this.program.instruction.deleteFlow(deleteContext);
    return { instructions: [deleteIx], signers: [] };
  }

  buildSystemTransferInstruction(
    from: PublicKey,
    to: PublicKey,
    amount: number
  ) {
    let depositTx = SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports: amount,
    });

    return { instructions: [depositTx], signers: [] };
  }
}
