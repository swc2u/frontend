import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getTodaysDateInYMD } from "../../utils";
  import { getNULMPattern } from "../../../../../ui-utils/commons";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  import set from "lodash/set";

  export const AlfDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Application for ALF program",
        labelKey: "NULM_APPLICATION_FOR_ALF_PROGRAM"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    AlfDetailsContainer: getCommonContainer({
     
      applicantname: {
        ...getTextField({
          label: {
            labelName: "Name of Applicant",
            labelKey: "NULM_ALF_NAME_OF_APPLICANT"
          },
          placeholder: {
            labelName: "Enter Name of Applicant",
            labelKey: "NULM_ALF_NAME_OF_APPLICANT_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Name") || null,
          jsonPath: "NULMALFRequest.name",       
        })
      },
  
      dateofformation: {
        ...getDateField({
          label: {
            labelName: "Date of Formation",
            labelKey: "NULM_ALF_DOF"
          },
          placeholder: {
            labelName: "Enter Date Of Formation",
            labelKey: "NULM_ALF_DOF_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "NULMALFRequest.dof",
          // props: {
          //   inputProps: {
          //     max:  new Date().toISOString().slice(0, 10),
          //   }
          // }
        })
      },

      // registrationNumber: {
      //   ...getTextField({
      //     label: {
      //       labelName: "Registration Number",
      //       labelKey: "NULM_ALF_REGISTRATION_NUMBER_INPUT"
      //     },
      //     placeholder: {
      //       labelName: "Enter Registration Number",
      //       labelKey: "NULM_ALF_REGISTRATION_NUMBER_PLACEHOLDER",
      //       props: {
      //           //InputLabelProps: {
      //             style:{
      //               marginTop: 30
      //             }
                  
      //           //},
      //         },
      //     },         
      //     required: false,
      //     pattern: getPattern("UOMValue") || null,
      //     errorMessage: "NULM_ALF_REGISTRATION_NUMBER_INPUT_VALIDATION",
      //     jsonPath: "NULMALFRequest.registrationNo"
      //   })
      // },

      registrationDate: {
        ...getDateField({
          label: {
            labelName: "Date Of Registration",
            labelKey: "NULM_ALF_DOR"
          },
          placeholder: {
            labelName: "Enter Date Of Registration",
            labelKey: "NULM_ALF_DOR_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("Date") || null,
          jsonPath: "NULMALFRequest.dor",
          // props: {
          //   inputProps: {
          //     max:  new Date().toISOString().slice(0, 10),
          //   }
          // }
        })
      },

      address: {
        ...getTextField({
          label: {
            labelName: "Addrss",
            labelKey: "NULM_ALF_ADDRESS"
          },
          placeholder: {
            labelName: "Enter Addrss",
            labelKey: "NULM_ALF_ADDRESS_PLACEHOLDER"
          },
          required: true,
          props: {
            className: "applicant-details-error",
            multiline: "multiline",
            rowsMax: 2,
          },
          pattern: getNULMPattern("Comment") || null,
          jsonPath: "NULMALFRequest.address"
        })
      },

      contactnumber: {
        ...getTextField({
          label: {
            labelName: "Contact Number",
            labelKey: "NULM_ALF_CONTACT_NUMBER"
          },
          placeholder: {
            labelName: "Enter Contact Number",
            labelKey: "NULM_ALF_CONTACT_NUMBER_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("MobileNo") || null,
          jsonPath: "NULMALFRequest.contact"
        })
      },

      accountName: {
        ...getTextField({
          label: {
            labelName: "A/C Name",
            labelKey: "NULM_ALF_AC_NAME"
          },
          placeholder: {
            labelName: "Enter A/C Name",
            labelKey: "NULM_ALF_AC_NAME_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("alpha-numeric-with-space") || null,
          jsonPath: "NULMALFRequest.accountName"
        })
      },

      bankName: {
        ...getTextField({
          label: {
            labelName: "Bank Name",
            labelKey: "NULM_ALF_BANK_NAME"
          },
          placeholder: {
            labelName: "Enter Bank Name",
            labelKey: "NULM_ALF_BANK_NAME_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("alpha-numeric-with-space") || null,
          jsonPath: "NULMALFRequest.bankName",
        })
        },

      branchName: {
        ...getTextField({
          label: {
            labelName: "Branch Name",
            labelKey: "NULM_ALF_BRANCH_NAME"
          },
          placeholder: {
            labelName: "Enter Branch Name",
            labelKey: "NULM_ALF_BRANCH_NAME_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("alpha-numeric-with-space") || null,
          jsonPath: "NULMALFRequest.branchName",
        })
      }
    })
  });