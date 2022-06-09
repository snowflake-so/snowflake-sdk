import { Buffer } from "buffer";
import { Keypair, PublicKey } from "@solana/web3.js";
import { UnixTimeStamp } from "../src/model/job";

// FoNj36H7j4unYevoVnZBStHihjBhQ3jRgg7sQoap1jqt
export const testWallet = Keypair.fromSecretKey(
  new Uint8Array([
    237, 75, 155, 87, 17, 243, 178, 42, 213, 63, 10, 14, 116, 206, 37, 32, 49,
    229, 230, 187, 189, 103, 58, 153, 171, 233, 108, 187, 227, 166, 165, 164,
    219, 228, 230, 0, 214, 93, 239, 210, 47, 229, 15, 157, 73, 3, 211, 222, 221,
    53, 44, 40, 43, 103, 220, 63, 173, 55, 23, 209, 218, 33, 53, 139,
  ])
);

export const instructions = [
  {
    programId: new PublicKey("ETwBdF9X2eABzmKmpT3ZFYyUtmve7UWWgzbERAyd4gAC"),
    data: Buffer.from("74b89fceb3e0b22a", "hex"),
    keys: [
      {
        pubkey: new PublicKey("5jo4Lh2Z9FGQ87sDhUBwZjNZdL15MwdeT5WUXKfwFSZY"),
        isSigner: false,
        isWritable: false,
      },
    ],
  },
];

export function tomorrow(): UnixTimeStamp {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return Math.floor(+tomorrow / 1000);
}

export function rightNow(): UnixTimeStamp {
  return +new Date() / 1000;
}
