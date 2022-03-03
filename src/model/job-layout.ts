// @ts-ignore
import BufferLayout from "buffer-layout";

export const JOB_ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(8, "discriminator"),
  BufferLayout.blob(32, "owner"),
]);
