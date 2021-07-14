import {
    getTextField,
    getDateField,
    getSelectField,
    getCommonContainer,
    getPattern,
    getBreak,
    getCommonCard,
    getCommonParagraph,
    getCommonTitle,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const documentDetails = getCommonCard({
    alfBankDetails: getCommonContainer({
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
        required: false,
        pattern: getPattern("alpha-numeric-with-space") || null,
        jsonPath: "NULMALFRequest.bankName",
      })
      },

      accountNumber: {
        ...getTextField({
          label: {
            labelName: "A/C Number",
            labelKey: "NULM_ALF_AC_NO"
          },
          placeholder: {
            labelName: "Enter A/C Number",
            labelKey: "NULM_ALF_AC_NO_PLACEHOLDER"
          },
          required: false,
          pattern: getPattern("numeric-only") || null,
          jsonPath: "NULMALFRequest.accountNumber"
        })
      },
      
      accOpenDate: {
        ...getDateField({
          label: {
            labelName: "Date of Account Opening",
            labelKey: "NULM_ALF_ACC_OPEN_DT"
          },
          placeholder: {
            labelName: "Enter Date Of Account Opening",
            labelKey: "NULM_ALF_ACC_OPEN_DT_PLACEHOLDER"
          },
          required: false,
          pattern: getPattern("Date") || null,
          jsonPath: "NULMALFRequest.dateOfOpeningAccount",
          props: {
            inputProps: {
              min:  new Date().toISOString().slice(0, 10),
            }
          }
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
          required: false,
          pattern: getPattern("alpha-numeric-with-space") || null,
          jsonPath: "NULMALFRequest.branchName",
        })
      }
    }),
    header: getCommonTitle(
      {
        labelName: "Required Documents",
        labelKey: "NOC_DOCUMENT_DETAILS_HEADER_POPUP"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    subText: getCommonParagraph({
      labelName:
        "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
      labelKey: "NOC_DOCUMENT_DETAILS_SUBTEXT_POPUP"
    }),
    break: getBreak(),
    documentList: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DocumentListContainer",
      required: false,
      props: {      
        buttonLabel: {
          labelName: "UPLOAD FILE",
          labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
        },
        description: "Only .jpg and .pdf files. 1MB max file size.",
        inputProps: {
           accept: ".pdf,.png,.jpeg"
         // accept: ".png,.jpeg,.jpg"
        },
        maxFileSize: 1000
      },
      type: "array"
    } 
  });
  