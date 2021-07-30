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
        labelName: "Application for SMID ALF program",
        labelKey: "NULM_APPLICATION_FOR_SMID_ALF_PROGRAM"
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
            labelName: "Name of ALF",
            labelKey: "NULM_NAME_OF_ALF"
          },
          placeholder: {
            labelName: "Enter Name of ALF",
            labelKey: "NULM_ALF_NAME_OF_PLACEHOLDER"
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

      adharNumber: {
        ...getTextField({
          label: {
            labelName: "Aadhar Number",
            labelKey: "NULM_ALF_AADHAR_NUMBER"
          },
          placeholder: {
            labelName: "Enter Aadhar Number",
            labelKey: "NULM_ALF_AADHAR_NUMBER_PLACEHOLDER"
          },
          required: true,
          pattern: getPattern("AdharCardNumber") || null,
          jsonPath: "NULMALFRequest.adharNumber"
        })
      },

      // alfFormattedThrough: {
      //   ...getTextField({
      //     label: {
      //       labelName: "ALF Formatted Through",
      //       labelKey: "NULM_ALF_FORMATTED_THROUGH"
      //     },
      //     placeholder: {
      //       labelName: "Enter ALF Formatted Through",
      //       labelKey: "NULM_ALF_FORMATTED_THROUGH_PLACEHOLDER"
      //     },
      //     required: true,
      //     pattern: getPattern("alpha-numeric-with-space") || null,
      //     jsonPath: "NULMALFRequest.alfFormattedThrough"
      //   })
      // },
      alfFormattedThrough : {
        ... getSelectField({
          label: {
            labelName: "SMID ALF formatted through",
            labelKey: "NULM_ALF_FORMATTED_THROUGH",
          },
          props: {
            className: "applicant-details-error",
            optionLabel: "name",
            optionValue: "code",
            data: [
              {
                code: "RO",
                name: "RO"
              },
              {
                code: "CO",
                name: "CO"
              },
              {
                code: "Others",
                name: "Others"
              },
            ]
          },
          placeholder: {
            labelName: "Select SMID ALF formatted through",
            labelKey: "NULM_ALF_FORMATTED_THROUGH_PLACEHOLDER",
          },
          jsonPath: "NULMALFRequest.alfFormattedThrough",
         // sourceJsonPath: "createScreenMdmsData.store-asset.Department",
          required: true,
        }),
      },
    })
  });