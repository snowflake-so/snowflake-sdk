// @ts-ignore
import BufferLayout from "buffer-layout";

export const JOB_ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(8, "discriminator"),
  BufferLayout.blob(32, "owner"),
  BufferLayout.blob(8, "lastUpdatedDate"),
  BufferLayout.blob(8, "createdDate"),
  BufferLayout.blob(1, "triggerType"),
  BufferLayout.blob(8, "nextExecutionTime"),
  BufferLayout.blob(4, "retryWindow"),
  BufferLayout.blob(1, "recurring"),
  BufferLayout.blob(2, "remainingRuns"),
  BufferLayout.blob(8, "scheduleEndDate"),
  BufferLayout.blob(4, "clientAppId"),
  BufferLayout.blob(8, "lastRentCharged"),
  BufferLayout.blob(8, "lastScheduledExecution"),
  BufferLayout.blob(8, "expiryDate"),
  BufferLayout.blob(1, "expireOnComplete"),
  BufferLayout.blob(32, "appId"),
  BufferLayout.blob(1, "payFeeFrom"),
  BufferLayout.blob(4, "userUtcOffset"),
  BufferLayout.blob(4, "customComputeBudget"),
  BufferLayout.blob(4, "customFee"),
  BufferLayout.blob(4, "customField1"),
  BufferLayout.blob(4, "customField2"),
]);
