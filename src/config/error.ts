export enum ErrorMessage {
  CreateJobWithExistingPubkey = "Can't create new job with an existing pubkey. Remove pubKey attribute and try again.",
  UpdateJobWithoutExistingPubkey = "Can't update job without an existing pubkey.",
  CreateJobWithWeekdayCron = "Can't create job with weekday cron.",
  UpdateJobWithWeekdayCron = "Can't update job with weekday cron.",
  InvalidCron = "Invalid cron.",
}
