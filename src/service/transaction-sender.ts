import { Transaction, TransactionSignature } from "@solana/web3.js";
import { Provider } from "@project-serum/anchor";
import { InstructionsAndSigners } from "../model/job";

export class TransactionSender {
  provider: Provider;
  constructor(provider: Provider) {
    this.provider = provider;
  }

  async sendWithWallet(
    instructionsAndSigners: InstructionsAndSigners
  ): Promise<TransactionSignature> {
    const transaction = new Transaction();
    transaction.add(...instructionsAndSigners.instructions);
    return await this.provider.send(
      transaction,
      instructionsAndSigners.signers
    );
  }
}
