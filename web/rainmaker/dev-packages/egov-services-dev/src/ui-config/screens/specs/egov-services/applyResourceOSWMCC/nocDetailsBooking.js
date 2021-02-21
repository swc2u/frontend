import {
    getBreak,
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
    getSelectField,
    getPattern,
    getRadioButton,
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
    getCurrentFinancialYear,
    clearlocalstorageAppDetails,
    convertDateInDMY,
} from "../../utils";

import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
    furnishNocResponse,
    getSearchResults,
} from "../../../../../ui-utils/commons";

export const personalDetails = getCommonCard({
    
    personalDetailsContainer: getCommonContainer({
        bkApplicantName: {
            ...getTextField({
                label: {
                    labelName: "Applicant Name",
                    labelKey: "BK_OSWMCC_BOOKING_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Applicant Name",
                    labelKey: "BK_OSWMCC_BOOKING_NAME_PLACEHOLDER",
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
                    labelName: "Father Name",
                    labelKey: "BK_OSWMCC_BOOKING_FATHER_NAME_LABEL",
                },
                placeholder: {
                    labelName: "Enter Father Name",
                    labelKey: "BK_OSWMCC_BOOKING_FATHER_NAME_PLACEHOLDER",
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
                    labelKey: "BK_OSWMCC_BOOKING_EMAIL_LABEL",
                },
                placeholder: {
                    labelName: "Enter Email Address",
                    labelKey: "BK_OSWMCC_BOOKING_EMAIL_PLACEHOLDER",
                },
                required: true,
                pattern: getPattern("Email"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                requiredMessage: "required Message",
                jsonPath: "Booking.bkEmail",
                props: {
                    required: true,
                },
            }),
        },
        bkMobileNumber: {
            ...getTextField({
                label: {
                    labelName: "Contact Number",
                    labelKey: "BK_OSWMCC_BOOKING_MOBILE_NO_LABEL",
                },
                placeholder: {
                    labelName: "Enter Contact Number",
                    labelKey: "BK_OSWMCC_BOOKING_MOBILE_NO_PLACEHOLDER",
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
                    labelName: "Address",
                    labelKey: "BK_OSWMCC_BOOKING_APP_ADDRESS_LABEL",
                },
                placeholder: {
                    labelName: "Enter Address",
                    labelKey: "BK_OSWMCC_BOOKING_APP_ADDRESS_PLACEHOLDER",
                },
                pattern: getPattern("Address"),
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
            ...getTextField({
              label: {
                labelName: "From Date",
                labelKey: "BK_OSWMCC_BOOKING_FROM_DATE_LABEL"
              },
              placeholder: {
                labelName: "From Date",
                labelKey: "BK_OSWMCC_BOOKING_FROM_DATE_PLACEHOLDER"
              },
              required: true,
              props: {
                disabled: true,
              },
              //pattern: getPattern("NoOfEmp"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              jsonPath: "Booking.bkFromDate",
            }),
            // beforeFieldChange: (action, state, dispatch) => {
            //   return convertDateInDMY(action.value)
            // },
          },
          todate: {
            ...getTextField({
              label: {
                labelName: "To Date",
                labelKey: "BK_OSWMCC_BOOKING_TO_DATE_LABEL"
              },
              placeholder: {
                labelName: "To Date",
                labelKey: "BK_OSWMCC_BOOKING_TO_DATE_PLACEHOLDER"
              },
              required: true,
              props: {
                disabled: true,
              },
              //pattern: getPattern("NoOfEmp"),
              errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
              jsonPath: "Booking.bkToDate",
            })
          },
        bkSector: {
            ...getTextField({
                label: {
                    labelName: "Booking Venue",
                    labelKey: "BK_OSWMCC_BOOKING_SECTOR_LABEL",
                },
                placeholder: {
                    labelName: "Enter Booking Venue",
                    labelKey: "BK_OSWMCC_BOOKING_SECTOR_PLACEHOLDER",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.bkSector",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    disabled: true
                },
            }),
        },
        bkBookingVenue: {
            ...getTextField({
                label: {
                    labelName: "Booking Venue",
                    labelKey: "BK_OSWMCC_BOOKING_VENUE_LABEL",
                },
                placeholder: {
                    labelName: "Enter Booking Venue",
                    labelKey: "BK_OSWMCC_BOOKING_VENUE_PLACEHOLDER",
                },
                pattern: getPattern("Address"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "Booking.bkBookingVenue",
                props: {
                    className: "applicant-details-error",
                    required: true,
                    disabled: true
                },
            }),
        },

        bkBookingPurpose: {
            ...getTextField({
                label: {
                    labelName: "Purpose",
                    labelKey: "BK_OSWMCC_BOOKING_PURPOSE_LABEL",
                },
                placeholder: {
                    labelName: "Enter Purpose",
                    labelKey: "BK_OSWMCC_BOOKING_PURPOSE_PLACEHOLDER",
                },
                pattern: getPattern("Address"),
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                // helperText : "new helper outside",
                required: true,
                jsonPath: "Booking.bkBookingPurpose",
                props: {
                    required: true,
                },
            }),
        },
        // bkBookingDuration: {
        //     ...getTextField({
        //         label: {
        //             labelName: "Booking Duration",
        //             labelKey: "BK_OSWMCC_BOOKING_DURATION_LABEL",
        //         },
        //         placeholder: {
        //             labelName: "Booking Duration",
        //             labelKey: "BK_OSWMCC_BOOKING_DURATION_PLACEHOLDER",
        //         },
        //         pattern: getPattern("Address"),
        //         errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        //         // helperText : "new helper outside",
        //         required: true,
        //         jsonPath: "Booking.bkBookingDuration",
        //         props: {
        //             required: true,
        //         },
        //     }),
        // }
        
        
        
    }),
});
