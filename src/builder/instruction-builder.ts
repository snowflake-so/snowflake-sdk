import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { InstructionsAndSigners, Job } from "../model/job";
import { Snowflake } from "../idl/snowflake";

export class InstructionBuilder {
  program: Program<Snowflake>;
  constructor(program: Program<Snowflake>) {
    this.program = program;
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
        owner: (this.program.provider as AnchorProvider).wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    };

    const createIx = this.program.instruction.createFlow(
      accountSize,
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
        owner:  (this.program.provider as AnchorProvider).wallet.publicKey,
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
        owner:  (this.program.provider as AnchorProvider).wallet.publicKey,
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
