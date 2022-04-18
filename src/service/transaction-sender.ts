import { Transaction, TransactionSignature } from "@solana/web3.js";
import { Provider, AnchorProvider, AnchorError } from "@project-serum/anchor";
import { InstructionsAndSigners } from "../model/job";

export class TransactionSender {
  provider: AnchorProvider;
  constructor(provider: AnchorProvider) {
    this.provider = provider;
  }

  async sendWithWallet(
    instructionsAndSigners: InstructionsAndSigners
  ): Promise<TransactionSignature> {
    const transaction = new Transaction();
    transaction.add(...instructionsAndSigners.instructions);

    try {
      return await this.provider.sendAndConfirm(
        transaction,
        instructionsAndSigners.signers
      );
    } catch (error: any) {
      const anchorError = AnchorError.parse(error.logs);
      if (anchorError) {
        throw anchorError;
      }
      throw error;
    }
  }
}
