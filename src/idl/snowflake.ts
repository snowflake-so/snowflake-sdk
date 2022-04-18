export type Snowflake = {
  "version": "0.1.0",
  "name": "snowflake",
  "instructions": [
    {
      "name": "createFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountSize",
          "type": "u32"
        },
        {
          "name": "clientFlow",
          "type": {
            "defined": "Flow"
          }
        }
      ]
    },
    {
      "name": "updateFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "clientFlow",
          "type": {
            "defined": "Flow"
          }
        }
      ]
    },
    {
      "name": "deleteFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "executeFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeScheduledFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "markTimedFlowAsError",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "chargeFlowMonitoringFee",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawNative",
      "accounts": [
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "appId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "appId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initProgramSettings",
      "accounts": [
        {
          "name": "programSettings",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "snfFoundation",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "registerOperator",
      "accounts": [
        {
          "name": "programSettings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "snfFoundation",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "operator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "flow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "lastUpdatedDate",
            "type": "i64"
          },
          {
            "name": "createdDate",
            "type": "i64"
          },
          {
            "name": "triggerType",
            "type": "u8"
          },
          {
            "name": "nextExecutionTime",
            "type": "i64"
          },
          {
            "name": "retryWindow",
            "type": "u32"
          },
          {
            "name": "recurring",
            "type": "bool"
          },
          {
            "name": "remainingRuns",
            "type": "i16"
          },
          {
            "name": "scheduleEndDate",
            "type": "i64"
          },
          {
            "name": "clientAppId",
            "type": "u32"
          },
          {
            "name": "lastRentCharged",
            "type": "i64"
          },
          {
            "name": "lastScheduledExecution",
            "type": "i64"
          },
          {
            "name": "expiryDate",
            "type": "i64"
          },
          {
            "name": "expireOnComplete",
            "type": "bool"
          },
          {
            "name": "appId",
            "type": "publicKey"
          },
          {
            "name": "payFeeFrom",
            "type": "u8"
          },
          {
            "name": "userUtcOffset",
            "type": "i32"
          },
          {
            "name": "customComputeBudget",
            "type": "u32"
          },
          {
            "name": "customFee",
            "type": "u32"
          },
          {
            "name": "customField1",
            "type": "i32"
          },
          {
            "name": "customField2",
            "type": "i32"
          },
          {
            "name": "externalId",
            "type": "string"
          },
          {
            "name": "cron",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "extra",
            "type": "string"
          },
          {
            "name": "actions",
            "type": {
              "vec": {
                "defined": "Action"
              }
            }
          }
        ]
      }
    },
    {
      "name": "programSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "snfFoundation",
            "type": "publicKey"
          },
          {
            "name": "operators",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "operatorToCheckIndex",
            "type": "i32"
          },
          {
            "name": "lastCheckTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Action",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "actionCode",
            "type": "u32"
          },
          {
            "name": "instruction",
            "type": "bytes"
          },
          {
            "name": "program",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TargetAccountSpec"
              }
            }
          },
          {
            "name": "extra",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "TargetAccountSpec",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TriggerType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Time"
          },
          {
            "name": "Program"
          }
        ]
      }
    },
    {
      "name": "FeeSource",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FromFeeAccount"
          },
          {
            "name": "FromFlow"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidJobData",
      "msg": "The job data is invalid."
    },
    {
      "code": 6001,
      "name": "JobIsNotAssignedToOperator",
      "msg": "The job is not assigned to this operator."
    },
    {
      "code": 6002,
      "name": "JobIsNotDueForExecution",
      "msg": "The job is not due for execution."
    },
    {
      "code": 6003,
      "name": "JobDoesNotRequireFrequentMonitoring",
      "msg": "The job does not require frequent monitoring."
    },
    {
      "code": 6004,
      "name": "JobIsAlreadyCharged",
      "msg": "The job is already charged."
    },
    {
      "code": 6005,
      "name": "CannotMarkJobAsErrorIfItsWithinSchedule",
      "msg": "Unable to mark the time triggered job as error because it is still within schedule."
    },
    {
      "code": 6006,
      "name": "OperatorIsAlreadyRegistered",
      "msg": "The operator is already registered."
    },
    {
      "code": 6007,
      "name": "ExecuteNowCanOnlyBePerformedByFlowOwner",
      "msg": "Execute now can only be performed by flow owner."
    },
    {
      "code": 6008,
      "name": "UserInstructionMustNotReferenceTheNodeOperator",
      "msg": "User instruction must not reference the node operator."
    }
  ]
};

export const IDL: Snowflake = {
  "version": "0.1.0",
  "name": "snowflake",
  "instructions": [
    {
      "name": "createFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "accountSize",
          "type": "u32"
        },
        {
          "name": "clientFlow",
          "type": {
            "defined": "Flow"
          }
        }
      ]
    },
    {
      "name": "updateFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "clientFlow",
          "type": {
            "defined": "Flow"
          }
        }
      ]
    },
    {
      "name": "deleteFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "executeFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "executeScheduledFlow",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "markTimedFlowAsError",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "chargeFlowMonitoringFee",
      "accounts": [
        {
          "name": "flow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "programSettings",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawNative",
      "accounts": [
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "appId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "caller",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "appId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pda",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sourceAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initProgramSettings",
      "accounts": [
        {
          "name": "programSettings",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "snfFoundation",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "registerOperator",
      "accounts": [
        {
          "name": "programSettings",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "snfFoundation",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "operator",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "flow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "lastUpdatedDate",
            "type": "i64"
          },
          {
            "name": "createdDate",
            "type": "i64"
          },
          {
            "name": "triggerType",
            "type": "u8"
          },
          {
            "name": "nextExecutionTime",
            "type": "i64"
          },
          {
            "name": "retryWindow",
            "type": "u32"
          },
          {
            "name": "recurring",
            "type": "bool"
          },
          {
            "name": "remainingRuns",
            "type": "i16"
          },
          {
            "name": "scheduleEndDate",
            "type": "i64"
          },
          {
            "name": "clientAppId",
            "type": "u32"
          },
          {
            "name": "lastRentCharged",
            "type": "i64"
          },
          {
            "name": "lastScheduledExecution",
            "type": "i64"
          },
          {
            "name": "expiryDate",
            "type": "i64"
          },
          {
            "name": "expireOnComplete",
            "type": "bool"
          },
          {
            "name": "appId",
            "type": "publicKey"
          },
          {
            "name": "payFeeFrom",
            "type": "u8"
          },
          {
            "name": "userUtcOffset",
            "type": "i32"
          },
          {
            "name": "customComputeBudget",
            "type": "u32"
          },
          {
            "name": "customFee",
            "type": "u32"
          },
          {
            "name": "customField1",
            "type": "i32"
          },
          {
            "name": "customField2",
            "type": "i32"
          },
          {
            "name": "externalId",
            "type": "string"
          },
          {
            "name": "cron",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "extra",
            "type": "string"
          },
          {
            "name": "actions",
            "type": {
              "vec": {
                "defined": "Action"
              }
            }
          }
        ]
      }
    },
    {
      "name": "programSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "snfFoundation",
            "type": "publicKey"
          },
          {
            "name": "operators",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "operatorToCheckIndex",
            "type": "i32"
          },
          {
            "name": "lastCheckTime",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Action",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "actionCode",
            "type": "u32"
          },
          {
            "name": "instruction",
            "type": "bytes"
          },
          {
            "name": "program",
            "type": "publicKey"
          },
          {
            "name": "accounts",
            "type": {
              "vec": {
                "defined": "TargetAccountSpec"
              }
            }
          },
          {
            "name": "extra",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "TargetAccountSpec",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "isSigner",
            "type": "bool"
          },
          {
            "name": "isWritable",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "TriggerType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "None"
          },
          {
            "name": "Time"
          },
          {
            "name": "Program"
          }
        ]
      }
    },
    {
      "name": "FeeSource",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "FromFeeAccount"
          },
          {
            "name": "FromFlow"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidJobData",
      "msg": "The job data is invalid."
    },
    {
      "code": 6001,
      "name": "JobIsNotAssignedToOperator",
      "msg": "The job is not assigned to this operator."
    },
    {
      "code": 6002,
      "name": "JobIsNotDueForExecution",
      "msg": "The job is not due for execution."
    },
    {
      "code": 6003,
      "name": "JobDoesNotRequireFrequentMonitoring",
      "msg": "The job does not require frequent monitoring."
    },
    {
      "code": 6004,
      "name": "JobIsAlreadyCharged",
      "msg": "The job is already charged."
    },
    {
      "code": 6005,
      "name": "CannotMarkJobAsErrorIfItsWithinSchedule",
      "msg": "Unable to mark the time triggered job as error because it is still within schedule."
    },
    {
      "code": 6006,
      "name": "OperatorIsAlreadyRegistered",
      "msg": "The operator is already registered."
    },
    {
      "code": 6007,
      "name": "ExecuteNowCanOnlyBePerformedByFlowOwner",
      "msg": "Execute now can only be performed by flow owner."
    },
    {
      "code": 6008,
      "name": "UserInstructionMustNotReferenceTheNodeOperator",
      "msg": "User instruction must not reference the node operator."
    }
  ]
};
