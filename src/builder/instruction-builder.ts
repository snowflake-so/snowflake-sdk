import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import { InstructionsAndSigners, Job } from "../model/job";
import { JOB_ACCOUNT_DEFAULT_SIZE } from "../config/job-config";

export class InstructionBuilder {
  program: Program;
  constructor(program: Program) {
    this.program = program;
  }

  buildCreateJobInstruction(job: Job): InstructionsAndSigners {
    const serializableJob = job.toSerializableJob();
    let newFlowKeyPair = Keypair.generate();

    let createContext: any = {
      accounts: {
        flow: newFlowKeyPair.publicKey,
        owner: this.program.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    };

    const createIx = this.program.instruction.createFlow(
      JOB_ACCOUNT_DEFAULT_SIZE,
      serializableJob,
      createContext
    );
    return { instructions: [createIx], signers: [newFlowKeyPair] };
  }

  buildUpdateJobInstruction(job: Job) {
    const serializableJob = job.toSerializableJob();
    let updateContext: any = {
      accounts: {
        flow: job.pubKey,
        owner: this.program.provider.wallet.publicKey,
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
        owner: this.program.provider.wallet.publicKey,
      },
      signers: [],
    };

    const deleteIx = this.program.instruction.deleteFlow(deleteContext);
    return { instructions: [deleteIx], signers: [] };
  }
}
