export const sampleSearch = () => {
  let res = {
    ResponseInfo: {
        apiId: "Rainmaker",
        ver: ".01",
        ts: null,
        resMsgId: "uief87324",
        msgId: "20170310130900|en_IN",
        status: "successful"
    },
    ProcessInstances: [
        {
            id:"ff973b96-5005-4d85-93fd-e1025def8415",
            tenantId: "ch",
            businessService: "RRP_SERVICE",
            businessId: "PB-RR-2020-03-16-000053",
            action: "INITIATE",
            moduleName: "RRP_SERVICE",
            state: {
                auditDetails: null,
                uuid: "85030c3d-ac6f-45c3-9e05-a1071077f12f",
                tenantId: "ch",
                businessServiceId: "558533fc-5b2c-4ee9-ac56-b61659d04213",
                sla: 172800000,
                state: "INITIATED",
                applicationStatus: "INITIATED",
                docUploadRequired: false,
                isStartState: true,
                isTerminateState: false,
                isStateUpdatable: null,
                actions: [
                    {
                        auditDetails: null,
                        uuid: "4058683f-b704-4f0e-943f-054316c5b128",
                        tenantId: "ch",
                        currentState: "85030c3d-ac6f-45c3-9e05-a1071077f12f",
                        action: "FORWARD",
                        nextState: "111734a0-bfbe-4999-a71a-2a9832057c5d",
                        roles: [
                            "PMS_DDO"
                        ]
                    }
                ]
            },
            comment: null,
            actorAcccessLevel:{
              employeeOtherDetailsUpdate: false,
              employeeLeaveUpdate: true,
              documentsUpload: true,
              documentComment: false,
              pensionCalculation: false,
              pensionDataUpdate: false,

            },
            documents: [
                {
                    fileStoreId: "32c5828a-6f31-4880-bf43-8d74b09c3a3b",
                    documentType: "EMPLOYEE_PHOTOGRAPH_ATTESTED_BY_DDO",
                    documentTypeName: "Photographs of the retiree duly attested by the DDO",
                    isMandatory: true,
                    documentsUpload: true,
                    documentComment: false,
                    comment: "",
                    url: "https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47.png?sig=wk5VW%2FfPenFaXiLa1bYralyU5TElUcVHGlJnwy522nY%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b,https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47_large.png?sig=dG1AR%2BURjnKfs1IceBNT6xRCpX5LZe6EtZnhGRQm%2Fck%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b,https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47_medium.png?sig=zAyGka7Iaxg1ihNhJJ3JgvOqCUnD8%2BSGWxnkfYjMPKE%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b,https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47_small.png?sig=sHZcwvqwJs1ldXyEb5b5X6a42hBsPddqSxbdz4qKBfw%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b",
                    documentHistory: [
                        {
                            state: "INITIATED",
                            action: "Uploaded",
                            actionBy: "dd654fb3-3154-4185-80dc-b6bfb354aab4",
                            comment: null
                        }
                    ]
                },
                {
                    fileStoreId: "",
                    documentType: "TEST_DOCUMENT",
                    documentTypeName: "TEST DOCUMENT",
                    isMandatory: false,
                    url: "",
                    comment: "",
                    documentHistory: []
                }
            ],
            assigner: {
                id: 100,
                userName: "Abhijit2020",
                name: "ABHIJIT BERA",
                type: "EMPLOYEE",
                mobileNumber: "9163361440",
                emailId: "abhijit.x.bera@in.pwc.com",
                roles: [
                    {
                        id: null,
                        name: "PMS DDO",
                        code: "PMS_DDO"
                    }
                ],
                tenantId: "ch",
                uuid: "dd654fb3-3154-4185-80dc-b6bfb354aab4"
            },
            assignee: null,
            nextActions: [
                {
                    auditDetails: null,
                    uuid: "4058683f-b704-4f0e-943f-054316c5b128",
                    tenantId: "ch",
                    currentState: "85030c3d-ac6f-45c3-9e05-a1071077f12f",
                    action: "FORWARD",
                    nextState: "111734a0-bfbe-4999-a71a-2a9832057c5d",
                    roles: [
                        "PMS_DDO"
                    ]
                }
            ],
            stateSla: -6323906,
            businesssServiceSla: -6323906,
            previousStatus: null,
            entity: null,
            auditDetails: {
                createdBy: "dd654fb3-3154-4185-80dc-b6bfb354aab4",
                lastModifiedBy: "dd654fb3-3154-4185-80dc-b6bfb354aab4",
                createdTime: 1584358990036,
                lastModifiedTime: 1584358990036
            },
            workflowHeader: {
                workflowHeaderId: "05a4f9a3-efb0-4d8a-8fcd-84f4396a1461"
            },
            employee: {
                id: 96,
                uuid: "3a7f1add-1899-4095-9efb-f2ec730baf4d",
                code: "EMP-248430-000005",
                employeeStatus: "EMPLOYED",
                employeeType: "PERMANENT",
                dateOfAppointment: null,
                jurisdictions: [],
                assignments: [
                    {
                        id: "10f7a68d-9757-47a3-863b-e556ea1fa4fa",
                        position: 5,
                        designation: "EO01",
                        department: "TP01",
                        fromDate: 1554057000000,
                        toDate: null,
                        govtOrderNumber: null,
                        tenantid: "ch",
                        reportingTo: null,
                        auditDetails: {
                            createdBy: "3f632cde-b269-499f-8893-78090dab5127",
                            createdDate: 1583152232631,
                            lastModifiedBy: null,
                            lastModifiedDate: 0
                        },
                        isHOD: false,
                        isCurrentAssignment: false
                    }
                ],
                serviceHistory: [
                    {
                        id: "0e489b5d-bfa8-4d59-a4ce-871bd4dbebe0",
                        serviceStatus: null,
                        serviceFrom: 0,
                        serviceTo: null,
                        orderNo: null,
                        location: null,
                        tenantId: "ch",
                        isCurrentPosition: true,
                        auditDetails: {
                            createdBy: "3f632cde-b269-499f-8893-78090dab5127",
                            createdDate: 1583152232631,
                            lastModifiedBy: null,
                            lastModifiedDate: 0
                        }
                    }
                ],
                education: [],
                tests: [],
                tenantId: "ch",
                documents: [],
                deactivationDetails: [],
                auditDetails: {
                    createdBy: "3f632cde-b269-499f-8893-78090dab5127",
                    createdDate: 1583152232631,
                    lastModifiedBy: null,
                    lastModifiedDate: 0
                },
                user: {
                    id: 96,
                    uuid: "3a7f1add-1899-4095-9efb-f2ec730baf4d",
                    userName: "EMP-248430-000005",
                    password: null,
                    salutation: null,
                    name: "Abhijit Bera",
                    gender: "FEMALE",
                    mobileNumber: "9163361440",
                    emailId: null,
                    altContactNumber: null,
                    pan: null,
                    aadhaarNumber: null,
                    permanentAddress: null,
                    permanentCity: null,
                    permanentPinCode: null,
                    correspondenceCity: null,
                    correspondencePinCode: null,
                    correspondenceAddress: "M",
                    active: true,
                    dob: -307756800000,
                    pwdExpiryDate: 1590928232000,
                    locale: null,
                    type: "EMPLOYEE",
                    signature: null,
                    accountLocked: false,
                    roles: [
                        {
                            name: "Super User",
                            code: "SUPERUSER",
                            description: null,
                            tenantId: "ch.chandigarh"
                        },
                        {
                            name: "Employee",
                            code: "EMPLOYEE",
                            description: null,
                            tenantId: "ch.chandigarh"
                        }
                    ],
                    fatherOrHusbandName: "U",
                    bloodGroup: null,
                    identificationMark: null,
                    photo: null,
                    createdBy: "3",
                    createdDate: 1583152232000,
                    lastModifiedBy: "3",
                    lastModifiedDate: 1583152232000,
                    otpReference: null,
                    tenantId: "ch.chandigarh"
                },
                isActive: true,
                pensionEmployeeId: "64ee64f7-b08e-435b-8d48-ee072e6057b5",
                dateOfRetirement: 1585699200000,
                dateOfDeath: 0
            },
            pensionCalculationDetails: {
              nqsSystem: 0,
              basicPensionSystem: 0,
              pensionSystem: 0,
              additionalPensionSystem: 0,
              commutedPensionSystem: 0,
              commutedValueSystem: 0,
              dcrg: 0,
              ltc: 0,
              lpd: 0,
              da: 0,
              pensionArrear: 0,
              interimRelief: 0,
              isDaMedicalAdmissible: true,
              fma: 0,
              medicalRelief: 0,
              miscellaneous: 0,
              overPayment: 0,
              incomeTax: 0,
              cess: 0,
              netDeductionsSystem: 0,
              finalCalculatedPensionSystem: 0,
              bankAddress: "string",
              accountNumber: "string",
              wef: 0,
              dateOfContingent: 0,
              comments: "string",
              nqsVerified: 0,
              basicPensionVerified: 0,
              pensionVerified: 0,
              additionalPensionVerified: 0,
              commutedPensionVerified: 0,
              commutedValueVerified: 0,
              netDeductionsVerified: 0,
              finalCalculatedPensionVerified: 0
            },
            deathCalculationDetails: {
              nqsSystem: 0,
              basicPensionSystem: 0,
              pensionSystem: 0,
              additionalPensionSystem: 0,
              commutedPensionSystem: 0,
              commutedValueSystem: 0,
              familyPensionI: 0,
              familyPensionII: 0,
              dcrg: 0,
              ltc: 0,
              lpd: 0,
              da: 0,
              pensionArrear: 0,
              interimRelief: 0,
              isDaMedicalAdmissible: true,
              fma: 0,
              medicalRelief: 0,
              miscellaneous: 0,
              overPayment: 0,
              incomeTax: 0,
              cess: 0,
              netDeductionsSystem: 0,
              finalCalculatedPensionSystem: 0,
              bankAddress: "string",
              accountNumber: "string",
              wef: 0,
              dateOfContingent: 0,
              comments: "string",
              nqsVerified: 0,
              basicPensionVerified: 0,
              pensionVerified: 0,
              additionalPensionVerified: 0,
              commutedPensionVerified: 0,
              commutedValueVerified: 0,
              netDeductionsVerified: 0,
              finalCalculatedPensionVerified: 0
            },
            claimantDetails: {
              tenantId: "string",
              claimant: "string"
            },
            leaves: [
                {
                    leaveType: "NO-PAY",
                    leaveFrom: "1583798400000",
                    leaveTo: "1583798400000",
                    leave_count: 0,
                    leaveTypeName: "NO-PAY"
                },
                {
                    leaveType: "VACATION",
                    leaveFrom: "1583798400000",
                    leaveTo: "1583798400000",
                    leave_count: 0,
                    leaveTypeName: "VACATION"
                }
            ]
        }
    ]
};
  return res;
};
export const sampleSingleSearch = () => {
  return {
    ResponseInfo: {
      apiId: "string",
      ver: "string",
      ts: 0,
      resMsgId: "string",
      msgId: "string",
      status: "SUCCESSFUL"
    },
    ProcessInstances: [
      {
          id:"ff973b96-5005-4d85-93fd-e1025def8415",
          tenantId: "ch",
          businessService: "RRP_SERVICE",
          businessId: "PB-RR-2020-03-16-000053",
          action: "INITIATE",
          moduleName: "RRP_SERVICE",
          state: {
              auditDetails: null,
              uuid: "85030c3d-ac6f-45c3-9e05-a1071077f12f",
              tenantId: "ch",
              businessServiceId: "558533fc-5b2c-4ee9-ac56-b61659d04213",
              sla: 172800000,
              state: "INITIATED",
              applicationStatus: "INITIATED",
              docUploadRequired: false,
              isStartState: true,
              isTerminateState: false,
              isStateUpdatable: null,
              actions: [
                  {
                      auditDetails: null,
                      uuid: "4058683f-b704-4f0e-943f-054316c5b128",
                      tenantId: "ch",
                      currentState: "85030c3d-ac6f-45c3-9e05-a1071077f12f",
                      action: "FORWARD",
                      nextState: "111734a0-bfbe-4999-a71a-2a9832057c5d",
                      roles: [
                          "PMS_DDO"
                      ]
                  }
              ]
          },
          comment: null,
          documents: [
              {
                  fileStoreId: "32c5828a-6f31-4880-bf43-8d74b09c3a3b",
                  documentType: "EMPLOYEE_PHOTOGRAPH_ATTESTED_BY_DDO",
                  documentTypeName: "Photographs of the retiree duly attested by the DDO",
                  isMandatory: true,
                  url: "https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47.png?sig=wk5VW%2FfPenFaXiLa1bYralyU5TElUcVHGlJnwy522nY%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b,https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47_large.png?sig=dG1AR%2BURjnKfs1IceBNT6xRCpX5LZe6EtZnhGRQm%2Fck%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b,https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47_medium.png?sig=zAyGka7Iaxg1ihNhJJ3JgvOqCUnD8%2BSGWxnkfYjMPKE%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b,https://chstage.blob.core.windows.net/fileshare/ch/pension/March/17/1584423248328Screenshot from 2020-03-06 09-17-47_small.png?sig=sHZcwvqwJs1ldXyEb5b5X6a42hBsPddqSxbdz4qKBfw%3D&st=2020-03-18T13%3A28%3A34Z&se=2020-03-19T13%3A28%3A34Z&sv=2016-05-31&sp=r&sr=b",
                  documentHistory: [
                      {
                          state: "INITIATED",
                          action: "Uploaded",
                          actionBy: "dd654fb3-3154-4185-80dc-b6bfb354aab4",
                          comment: null
                      }
                  ]
              },
              {
                  fileStoreId: "",
                  documentType: "TEST_DOCUMENT",
                  documentTypeName: "TEST DOCUMENT",
                  isMandatory: false,
                  url: "",
                  documentHistory: []
              }
          ],
          assigner: {
              id: 100,
              userName: "Abhijit2020",
              name: "ABHIJIT BERA",
              type: "EMPLOYEE",
              mobileNumber: "9163361440",
              emailId: "abhijit.x.bera@in.pwc.com",
              roles: [
                  {
                      id: null,
                      name: "PMS DDO",
                      code: "PMS_DDO"
                  }
              ],
              tenantId: "ch",
              uuid: "dd654fb3-3154-4185-80dc-b6bfb354aab4"
          },
          assignee: null,
          nextActions: [
              {
                  auditDetails: null,
                  uuid: "4058683f-b704-4f0e-943f-054316c5b128",
                  tenantId: "ch",
                  currentState: "85030c3d-ac6f-45c3-9e05-a1071077f12f",
                  action: "FORWARD",
                  nextState: "111734a0-bfbe-4999-a71a-2a9832057c5d",
                  roles: [
                      "PMS_DDO"
                  ]
              }
          ],
          stateSla: -6323906,
          businesssServiceSla: -6323906,
          previousStatus: null,
          entity: null,
          auditDetails: {
              createdBy: "dd654fb3-3154-4185-80dc-b6bfb354aab4",
              lastModifiedBy: "dd654fb3-3154-4185-80dc-b6bfb354aab4",
              createdTime: 1584358990036,
              lastModifiedTime: 1584358990036
          },
          workflowHeader: {
              workflowHeaderId: "05a4f9a3-efb0-4d8a-8fcd-84f4396a1461"
          },
          employee: {
              id: 96,
              uuid: "3a7f1add-1899-4095-9efb-f2ec730baf4d",
              code: "EMP-248430-000005",
              employeeStatus: "EMPLOYED",
              employeeType: "PERMANENT",
              dateOfAppointment: null,
              jurisdictions: [],
              assignments: [
                  {
                      id: "10f7a68d-9757-47a3-863b-e556ea1fa4fa",
                      position: 5,
                      designation: "EO01",
                      department: "TP01",
                      fromDate: 1554057000000,
                      toDate: null,
                      govtOrderNumber: null,
                      tenantid: "ch",
                      reportingTo: null,
                      auditDetails: {
                          createdBy: "3f632cde-b269-499f-8893-78090dab5127",
                          createdDate: 1583152232631,
                          lastModifiedBy: null,
                          lastModifiedDate: 0
                      },
                      isHOD: false,
                      isCurrentAssignment: false
                  }
              ],
              serviceHistory: [
                  {
                      id: "0e489b5d-bfa8-4d59-a4ce-871bd4dbebe0",
                      serviceStatus: null,
                      serviceFrom: 0,
                      serviceTo: null,
                      orderNo: null,
                      location: null,
                      tenantId: "ch",
                      isCurrentPosition: true,
                      auditDetails: {
                          createdBy: "3f632cde-b269-499f-8893-78090dab5127",
                          createdDate: 1583152232631,
                          lastModifiedBy: null,
                          lastModifiedDate: 0
                      }
                  }
              ],
              education: [],
              tests: [],
              tenantId: "ch",
              documents: [],
              deactivationDetails: [],
              auditDetails: {
                  createdBy: "3f632cde-b269-499f-8893-78090dab5127",
                  createdDate: 1583152232631,
                  lastModifiedBy: null,
                  lastModifiedDate: 0
              },
              user: {
                  id: 96,
                  uuid: "3a7f1add-1899-4095-9efb-f2ec730baf4d",
                  userName: "EMP-248430-000005",
                  password: null,
                  salutation: null,
                  name: "Abhijit Bera",
                  gender: "FEMALE",
                  mobileNumber: "9163361440",
                  emailId: null,
                  altContactNumber: null,
                  pan: null,
                  aadhaarNumber: null,
                  permanentAddress: null,
                  permanentCity: null,
                  permanentPinCode: null,
                  correspondenceCity: null,
                  correspondencePinCode: null,
                  correspondenceAddress: "M",
                  active: true,
                  dob: -307756800000,
                  pwdExpiryDate: 1590928232000,
                  locale: null,
                  type: "EMPLOYEE",
                  signature: null,
                  accountLocked: false,
                  roles: [
                      {
                          name: "Super User",
                          code: "SUPERUSER",
                          description: null,
                          tenantId: "ch.chandigarh"
                      },
                      {
                          name: "Employee",
                          code: "EMPLOYEE",
                          description: null,
                          tenantId: "ch.chandigarh"
                      }
                  ],
                  fatherOrHusbandName: "U",
                  bloodGroup: null,
                  identificationMark: null,
                  photo: null,
                  createdBy: "3",
                  createdDate: 1583152232000,
                  lastModifiedBy: "3",
                  lastModifiedDate: 1583152232000,
                  otpReference: null,
                  tenantId: "ch.chandigarh"
              },
              isActive: true,
              pensionEmployeeId: "64ee64f7-b08e-435b-8d48-ee072e6057b5",
              dateOfRetirement: 1585699200000,
              dateOfDeath: 0
          },
          leaves: [
              {
                  leaveType: "NO-PAY",
                  leaveFrom: "1583798400000",
                  leaveTo: "1583798400000",
                  leave_count: 0,
                  leaveTypeName: "NO-PAY"
              },
              {
                  leaveType: "VACATION",
                  leaveFrom: "1583798400000",
                  leaveTo: "1583798400000",
                  leave_count: 0,
                  leaveTypeName: "VACATION"
              }
          ]
      }
  ]

  };
};
export const sampleDocUpload = () => {
  return {
    "0": {
      documentType: "OWNER",
      documentCode: "OWNER.IDENTITYPROOF",
      documents: [
        {
          fileName: "preview-PB-TL-2018-12-02-001113 (1).pdf",
          fileStoreId: "89fe5959-79e1-4201-b8ca-bcbc4c23c828"
        }
      ],
      dropdown: {
        value: "OWNER.IDENTITYPROOF.AADHAAR"
      }
    },
    "1": {
      documentType: "OWNER",
      documentCode: "OWNER.ADDRESSPROOF"
    },
    "2": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.SITE_PLAN"
    },
    "3": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.GROUND_FLOOR_PLAN"
    },
    "4": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.SECTION_PLAN"
    },
    "5": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.ELEVATION_PLAN"
    },
    "6": {
      documentType: "BUILDING",
      documentCode: "Dsrrh Indigo",
      documentSubCode: "BUILDING.BUILDING_PLAN.BUILTUP_AREA_STATEMENT"
    },
    "7": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.SITE_PLAN",
      documents: [
        {
          fileName: "preview-PB-TL-2018-12-02-001113 (2).pdf",
          fileStoreId: "bcc598cf-04bf-45c8-bbf5-b1d3619b2d78"
        }
      ]
    },
    "8": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.GROUND_FLOOR_PLAN"
    },
    "9": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.SECTION_PLAN"
    },
    "10": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.ELEVATION_PLAN"
    },
    "11": {
      documentType: "BUILDING",
      documentCode: "dsrrh violet",
      documentSubCode: "BUILDING.BUILDING_PLAN.BUILTUP_AREA_STATEMENT"
    },
    "12": {
      documentType: "BUILDING",
      documentCode: "BUILDING.FIRE_FIGHTING_PLAN"
    },
    "13": {
      documentType: "BUILDING",
      documentCode: "BUILDING.OWNERS_CHECKLIST"
    }
  };
};
export const sampleGetBill = () => {
  return {
    ResposneInfo: null,
    Bill: [
      {
        id: "b8378732-c1d0-4910-8d65-f3b027c48d8c",
        mobileNumber: null,
        payerName: null,
        payerAddress: null,
        payerEmail: null,
        isActive: true,
        isCancelled: null,
        additionalDetails: null,
        taxAndPayments: [
          {
            businessService: "FIRENOC",
            taxAmount: 16500,
            amountPaid: null
          }
        ],
        billDetails: [
          {
            id: "31dd68b0-ded3-45de-b241-de96d73b487c",
            tenantId: "pb.amritsar",
            demandId: "02f07856-978f-4a6b-acb9-8ad635699c4f",
            bill: "b8378732-c1d0-4910-8d65-f3b027c48d8c",
            businessService: "FIRENOC",
            billNumber: null,
            billDate: 1560258084110,
            consumerCode: "PB-FN-1234",
            consumerType: "FIRENOC",
            expiryDate: 1560258084110,
            minimumAmount: null,
            totalAmount: 16500,
            fromPeriod: 1554076799000,
            toPeriod: 1585679399000,
            collectedAmount: 0,
            collectionModesNotAllowed: ["DD"],
            partPaymentAllowed: false,
            isAdvanceAllowed: false,
            additionalDetails: null,
            billAccountDetails: [
              {
                id: "48417f1e-f8ac-4469-8e31-b801731884db",
                tenantId: "pb.amritsar",
                billDetail: "31dd68b0-ded3-45de-b241-de96d73b487c",
                demandDetailId: "b15dcc8b-3748-4835-97fa-a9e42e632ecc",
                order: 3,
                amount: 16500,
                adjustedAmount: 0,
                isActualDemand: true,
                glcode: null,
                taxHeadCode: "FIRENOC_FEES",
                additionalDetails: null,
                purpose: "CURRENT"
              }
            ],
            status: null
          }
        ],
        tenantId: "pb.amritsar",
        auditDetails: {
          createdBy: "ed8cebbc-750c-4e03-98b5-488d6e506395",
          lastModifiedBy: "ed8cebbc-750c-4e03-98b5-488d6e506395",
          createdTime: 1560258084110,
          lastModifiedTime: 1560258084110
        }
      }
    ],
    ResponseInfo: {
      apiId: "string",
      ver: "string",
      ts: null,
      resMsgId: "uief87324",
      msgId: "string",
      status: "successful"
    }
  };
};


export const ActionButton =()=>{
  return {
    FORWARD:"FORWARD",
    REJECT:"REJECT",
    BACKWORD:"SEND_BACK",
    BACKWORD1:"SEND_BACK_TO_INITIATED",
    BACKWORD2:"SEND_BACK_TO_PENDING_FOR_CALCULATION_VERIFICATION"
  }
}

export const ActionStep =()=>{
  return {
    INITIATED: "WF_RRP_SERVICE_INITIATED",
    PENDING_FOR_CALCULATION: "WF_RRP_SERVICE_PENDING_FOR_CALCULATION"
};
}
export const ActionStepDoe =()=>{
  return {
    INITIATED: "WF_DOE_SERVICE_INITIATED",
    PENDING_FOR_CALCULATION: "WF_DOE_SERVICE_PENDING_FOR_CALCULATION"
};
}
export const ActionStepDop =()=>{
  return {
    INITIATED: "WF_DOP_SERVICE_INITIATED",
    PENDING_FOR_CALCULATION: "WF_DOP_SERVICE_PENDING_FOR_CALCULATION"
};
}

export const ActionMessage =()=>{
  return {
    INITIATED: "workflow INITIATED successfully",
    PENDING_FOR_CALCULATION: "WF_RRP_SERVICE_PENDING_FOR_CALCULATION",
    SUBMIT:"Workflow data submited successfully! "
};
}

export const ActionWorkflowAccessibility =()=>{
  return {
    isViewEnabled: false,
    isClaimEnabled: false,
    isReleaseEnabled :false,
    InActiveReleaseMessage:'Task cannot be released as it has already been claimed by other user',
    InActiveClaimMessage:'Task cannot be claimed as it has already been claimed',

    ActiveReleaseMessage:'Task released successfully',
    ActiveClaimMessage:'Task claimed successfully',
    InActiveViewMessage:'Task cannot be viewed as it is not  claimed by you',
    businessId :"3a7f1add-1899-4095-9efb-f2ec730baf4d"
};
}

export const ActionAPICheck =()=>{

  return{
    APILocalHost:true
  }
}

export const WFConfig =()=>{

  return{
    businessServiceRRP:"RRP_SERVICE",
    businessServiceDOE:"DOE_SERVICE",
    businessServicDOP:"DOP_SERVICE"
  }
}
export const ActionNotification =()=>{
let res ={
  events: [
    {
        tenantId:"ch",
        id:"557eb6c7-4080-4e20-80c4-2c56adeb704b",
        referenceId:" null",
        eventType:"SYSTEMGENERATED",
        eventCategory:" null",
        name:"RRP_Started",
        description:"RRP STarted",
        status:"ACTIVE",
        source:"WEBAPP",
        postedBy:"8d6accd4-c2b5-4314-8da5-0e3ee217683d",
        recepient: {
            toRoles: [],
            toUsers: [
                "8d6accd4-c2b5-4314-8da5-0e3ee217683d",
            ]
        },
        actions: {
            tenantId:"ch",
            id:"04ff5a36-e56e-4e14-9fa6-7ad7eb2bb0ad",
            eventId:"557eb6c7-4080-4e20-80c4-2c56adeb704b",
            actionUrls: []
        },
        eventDetails: {
            id:"0a46f3ea-7ef8-436d-a880-5d6de0af260b",
            eventId:"557eb6c7-4080-4e20-80c4-2c56adeb704b",
            organizer:" null",
            fromDate:" 1661726008000",
            toDate:" 1661812408000",
            latitude:" null",
            longitude:" null",
            address:" null",
            documents:" null",
            fees: null
        },
        auditDetails:{
            createdBy:"8d6accd4-c2b5-4314-8da5-0e3ee217683d",
            createdTime:" 1584698959178",
            lastModifiedBy:"8d6accd4-c2b5-4314-8da5-0e3ee217683d",
            lastModifiedTime:" 1584698959178",
        },
        recepientEventMap:null,
        generateCounterEvent: null,
    }
],

}
  return res;

}
export const ActionEmployee =()=>{
  let res ={
    Employees: [
      {
          tenantId:"ch",
          id:"557eb6c7-4080-4e20-80c4-2c56adeb704b",
          name:"name1",
          code:"EMP-1",
          dob:1584358990036,
          dateOfRetirement:1584358990036,
         
      },
      {
        tenantId:"ch",
        id:"557eb6c7-4080-4e20-80c4-2c56adeb704b",
        name:"name2",
        code:"EMP-2",
        dob:1584358990036,
        dateOfRetirement:1584358990036,
       
    },
    {
      tenantId:"ch",
      id:"557eb6c7-4080-4e20-80c4-2c56adeb704b",
      name:"name3",
      code:"EMP-4",
      dob:1584358990036,
      dateOfRetirement:1584358990036,
     
  }
  ],
  
  }
    return res;
  
  }

  export const ActionPensionReview =()=>{
    let res ={
      ProcessInstances:[
        {
          tenantId:"ch",
          pensioner: {
            pensionerId: "1234",
            pensionerNumber: "P-01",
            name: "pritam",
            businessService: "DOE_SERVICE",

          },
          pensionRevision:[
            {
              effectiveStartYear:2020,
              effectiveStartMonth:4,
              effectiveEndYear:2030,
              effectiveEndMonth:7,
              
              basicPension:123,
              da:4560,
              commutedPension:0,
              additionalPension:0,
              medicalRelief:0,
              interimRelief:0,
              miscellaneous:0,
              totalPension:0,
              netDeductions:23,
              isEditEnabled:true
            },
            {
              effectiveStartYear:2022,
              effectiveStartMonth:2,
              effectiveEndYear:2032,
              effectiveEndMonth:5,
              basicPension:34,
              da:6,
              netDeductions:256,
              commutedPension:0,
              additionalPension:0,
              medicalRelief:0,
              interimRelief:0,
              miscellaneous:0,
              totalPension:0,
              isEditEnabled:true
            },
            {
              effectiveStartYear:2023,
              effectiveStartMonth:5,
              effectiveEndYear:2033,
              effectiveEndMonth:3,
              basicPension:2,
              da:5,
              netDeductions:276,
              commutedPension:0,
              additionalPension:0,
              medicalRelief:0,
              interimRelief:0,
              miscellaneous:0,
              totalPension:0,
              isEditEnabled:true
            },
            {
              effectiveStartYear:2023,
              effectiveStartMonth:5,
              effectiveEndYear:2033,
              effectiveEndMonth:3,
              basicPension:2,
              da:5,
              netDeductions:276,
              commutedPension:0,
              additionalPension:0,
              medicalRelief:0,
              interimRelief:0,
              miscellaneous:0,
              totalPension:0,
              isEditEnabled:false
            }
          ],
          pensionerFinalCalculatedBenefitDetails:
          {
            basicPension:0,
            pensionDeductions:0,
            additionalPension:0,
            commutedPension:0,
            commutedValue:0,
            familyPensionI:0,
            familyPensionII:0,
            dcrg:0,
            finalCalculatedPension:0,
            interimRelief:0,
            da:0,
            nqsYear:0,
            nqsMonth:0,
            nqsDay:0,
            compassionatePension:0,
            compensationPension:0,
            terminalBenefit:0,
            finalCalculatedGratuity:0,


          },


        }  
      ]
    
    }
      return res;
    
    }