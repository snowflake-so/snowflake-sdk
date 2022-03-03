import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";
import { UnixTimeStamp } from "../src/model/job";

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
