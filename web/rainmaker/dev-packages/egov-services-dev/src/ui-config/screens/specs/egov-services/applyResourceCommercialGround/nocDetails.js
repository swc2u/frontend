import {
  getBreak, getCommonGrayCard, getDateField, getLabel, getTodaysDateInYMD,
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getTextField,
  getSelectField,
  getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  getTextFieldReadOnly
} from "../../utils/index"
import { convertDateInDMY } from "../../utils/index";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import jp from "jsonpath";
import set from "lodash/set";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  furnishNocResponse,
  getSearchResults,
} from "../../../../../ui-utils/commons";

export const personalDetails = getCommonCard({

  nocDetailsContainer: getCommonContainer({
    bkApplicantName: {
      ...getTextField({
        label: {
          labelName: "Applicant Name",
          labelKey: "BK_CGB_NAME_LABEL",
        },
        placeholder: {
          labelName: "Applicant Name",
          labelKey: "BK_CGB_NAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkApplicantName",
      }),
    },
    bkFatherName: {
      ...getTextField({
        label: {
          labelName: "Father's Name",
          labelKey: "BK_CGB_FATHERNAME_LABEL",
        },
        placeholder: {
          labelName: "Father's Name",
          labelKey: "BK_CGB_FATHERNAME_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkFatherName",
      }),
    },
    bkEmail: {
      ...getTextField({
        label: {
          labelName: "Email Address",
          labelKey: "BK_CGB_EMAIL_LABEL",
        },
        placeholder: {
          labelName: "Email Address",
          labelKey: "BK_CGB_EMAIL_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Email"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkEmail",
      }),
    },
    bkMobileNumber: {
      ...getTextField({
        label: {
          labelName: "Contact Number",
          labelKey: "BK_CGB_MOBILE_NO_LABEL",
        },
        placeholder: {
          labelName: "Contact Number",
          labelKey: "BK_CGB_MOBILE_NO_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("MobileNo"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkMobileNumber",
      }),
    },
    bkCompleteAddress: {
      ...getTextField({
        label: {
          labelName: "Complete Address",
          labelKey: "BK_CGB_COMPLETE_ADDRESS_LABEL",
        },
        placeholder: {
          labelName: "Complete Address",
          labelKey: "BK_CGB_COMPLETE_ADDRESS_PLACEHOLDER",
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "Booking.bkCompleteAddress",
        maxLength: 500,
      }),
    },
    dummyDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      props: {
        disabled: true,
      },
    },
  }),
});


export const bookingDetails = getCommonCard({
  

  applicationDetailsConatiner: getCommonContainer({

    fromdate: {
      ...getTextFieldReadOnly({
        label: {
          labelName: "From Date",
          labelKey: "BK_CGB_FROM_DATE_LABEL"
        },
        placeholder: {
          labelName: "From Date",
          labelKey: "BK_CGB_FROM_DATE_PLACEHOLDER"
        },
        readOnlyValue: true,
        required: true,

        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",

        jsonPath: "Display.bkFromDate",


      })
    },
    todate: {
      ...getTextFieldReadOnly({
        label: {
          labelName: "To Date",
          labelKey: "BK_CGB_TO_DATE_LABEL"
        },
        placeholder: {
          labelName: "To Date",
          labelKey: "BK_CGB_TO_DATE_PLACEHOLDER"
        },

        required: true,
        readOnlyValue: true,
     
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Display.bkToDate",

      })
    },
    Venue: {
      ...getTextFieldReadOnly({
        label: {

          labelName: "Booking Venue",
          labelKey: "BK_CGB_BOOKING_VENUE_LABEL",
        },

        placeholder: {
          labelName: "Select Booking Venue",
          labelKey: "BK_CGB_BOOKING_VENUE_PLACEHOLDER",
        },
        readOnlyValue: true,
        required: true,
    
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkBookingVenue",
      })
    },

    Purpose: {
      ...getTextField({
        label: {
          labelName: "Purpose",
          labelKey: "BK_CGB_PURPOSE_LABEL",
        },
        placeholder: {
          labelName: "Purpose",
          labelKey: "BK_CGB_PURPOSE_PLACEHOLDER",
        },
        required: true,
        //pattern: getPattern("Name"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Booking.bkBookingPurpose",
        maxLength: 500,
      }),
    },


    bkCategory: {
      ...getSelectField({
        label: {
          labelName: "Category",
          labelKey: "BK_CGB_CATEGORY_LABEL",
        },
        
        optionLabel: "name",
        placeholder: {
          labelName: "Select Category",
          labelKey: "BK_CGB_CATEGORY_PLACEHOLDER",
        },
      
        sourceJsonPath: "applyScreenMdmsData.Booking.Commerical_Ground_Cat",
        jsonPath: "Booking.bkCategory",
        required: true,
        props: {
          className: "applicant-details-error",
          required: true,
        },
      }),
    },
  }),
});


export const bankAccountDetails = getCommonCard({
  // header: getCommonTitle(
  //   {
  //     labelName: "Applicant Details",
  //     labelKey: "BK_PCC_HEADER_STEP_1",
  //   },
  //   {
  //     style: {
  //       marginBottom: 18,
  //     },
  //   }
  // ),
  // break: getBreak(),

  personalDetailsContainer: getCommonContainer({
      bkAccountName: {
          ...getTextField({
              label: {
                  labelName: "Bank Name(For security refund)",
                  labelKey:  "Bank Name(For security refund)",
                  
                 },
              placeholder: {
                  labelName: "Bank Name",
                  labelKey:  "Bank Name",
               
              },
              required: true,
              pattern: getPattern("Name"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              jsonPath: "Booking.bkBankName",
          }),
      },

      bkAccountNumber: {
          ...getTextField({
              label: {
                  labelName: "Account Number",
                  labelKey: "Account Number",
                  //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
              },
              placeholder: {
                  labelName: "Account Number",
                  labelKey: "Account Number",
                  //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
               },
              required: true,
              pattern: getPattern("bankAccountNo"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              requiredMessage: "required Message",
              jsonPath: "Booking.bkBankAccountNumber",
              props: {
                  required: true,
              },
          }),
      },
      bkIFSCCode: {
          ...getTextField({
              label: {
                  labelName: "IFSC Code",
                  labelKey:  "IFSC Code",
                  //labelKey: "BK_PCC_IFSC_CODE_LABEL",
              },
              placeholder: {
                  labelName: "IFSC Code",
                  labelKey:  "IFSC Code",
                  //labelKey: "BK_PCC_IFSC_CODE_LABEL",
              },
              required: true,
              pattern: getPattern("IFSCCode"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              jsonPath: "Booking.bkIfscCode",
          }),
      },
      bkAccountHolderName: {
          ...getTextField({
              label: {
                  labelName: "Account Holder Name",
                  labelKey: "Account Holder Name",
                  //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
              },
              placeholder: {
                  labelName: "Account Holder Name",
                  labelKey: "Account Holder Name",
                  //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
              },
              required: true,
              pattern: getPattern("Name"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              jsonPath: "Booking.bkBankAccountHolder",
          }),
      },

        bankAccountTypeRadioGroup: {
          uiFramework: "custom-containers",
          componentPath: "RadioGroupContainer",
          moduleName: "egov-services",
          gridDefination: {
            xs: 12,
            sm: 12,
            md: 6,
          },
          jsonPath: "Booking.bkAccountType",
          props: {
            label: {
              name: "Bank Account Type",
              key: "Bank Account Type",
              },
            buttons: [
              {
                labelName: "Saving",
                labelKey: "Saving",
                value: "Saving"
              },
              {
                label: "Current",
                labelKey: "Current",
                value: "Current"
              }
            ],
            jsonPath: "Booking.bkAccountType",
            defaultValue: "Saving",
            required: true,
          },
          required: true,
          type: "array",
      },
      bkNomineeName: {
          ...getTextField({
              label: {
                  labelName: "Nominee Name",
                  labelKey: "Nominee Name",
                  //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
              },
              placeholder: {
                  labelName: "Nominee Name",
                  labelKey: "Nominee Name",
                  //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
              },
              required: true,
              pattern: getPattern("Name"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              jsonPath: "Booking.bkNomineeName",
          }),
      },

      dummyDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
              xs: 12,
              sm: 12,
              md: 6,
          },
          props: {
              disabled: true,
          },
      },
  }),
});