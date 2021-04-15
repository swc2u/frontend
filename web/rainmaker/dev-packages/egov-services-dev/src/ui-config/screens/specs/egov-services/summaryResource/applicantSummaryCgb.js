import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const applicantSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Applicant Details",
                    labelKey: "BK_CGB_APPLICANT_DETAILS_HEADER",
                }),
            },
            // editSection: {
            //   componentPath: "Button",
            //   props: {
            //     color: "primary",
            //     style: {
            //       marginTop: "-10px",
            //       marginRight: "-18px",
            //     },
            //   },
            //   gridDefination: {
            //     xs: 4,
            //     align: "right",
            //   },
            //   children: {
            //     editIcon: {
            //       uiFramework: "custom-atoms",
            //       componentPath: "Icon",
            //       props: {
            //         iconName: "edit",
            //       },
            //     },
            //     buttonLabel: getLabel({
            //       labelName: "Edit",
            //       labelKey: "BK_SUMMARY_EDIT",
            //     }),
            //   },
            //   onClickDefination: {
            //     action: "condition",
            //     callBack: (state, dispatch) => {
            //       gotoApplyWithStep(state, dispatch, 0);
            //     },
            //   },
            // },
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicantContainer: getCommonContainer({
                    applicantName: getLabelWithValue(
                        {
                            labelName: "Name",
                            labelKey: "BK_CGB_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkApplicantName",
                        }
                    ),
                    applicantFatherName: getLabelWithValue(
                        {
                            labelName: "Father Name",
                            labelKey: "BK_CGB_FATHERNAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFatherName",
                        }
                    ),
                    applicantEmail: getLabelWithValue(
                        {
                            labelName: "Email Address",
                            labelKey: "BK_CGB_EMAIL_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkEmail",
                        }
                    ),
                    applicantMobile: getLabelWithValue(
                        {
                            labelName: "Mobile Number",
                            labelKey: "BK_CGB_MOBILE_NO_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkMobileNumber",
                        }
                    ),
                    applicantAddress: getLabelWithValue(
                        {
                            labelName: "Complete Address",
                            labelKey: "BK_CGB_COMPLETE_ADDRESS_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCompleteAddress",
                        }
                    )
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
            prefixSourceJsonPath:
                "children.cardContent.children.applicantContainer.children",
            afterPrefixJsonPath: "children.value.children.key",
        },
        type: "array",
    },
});


export const cgbBankSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" },
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8,
                },
                ...getCommonSubHeader({
                    labelName: "Bank Details",
                    labelKey:  "Bank Details"
                    //labelKey: "BK_PCC_BANK_DETAILS_HEADER",
                }),
            },
            
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicantContainer: getCommonContainer({
                    bkBankName: getLabelWithValue(
                        {
                            labelName: "Bank Name",
                            labelKey:  "Bank Name",
                            //labelKey: "BK_PCC_BANK_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankName",
                        }
                    ),
                    bkBankAccountNumber: getLabelWithValue(
                        {
                            labelName: "Account Number",
                            labelKey: "Account Number",
                            //labelKey: "BK_PCC_ACCOUNT_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankAccountNumber",
                        }
                    ),
                    bkIfscCode: getLabelWithValue(
                        {
                            labelName: "IFSC Code",
                            labelKey:  "IFSC Code",
                            //labelKey: "BK_PCC_IFSC_CODE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkIfscCode",
                        }
                    ),
                    bkAccountHolderName: getLabelWithValue(
                      
                        {
                            labelName: "Account Holder Name",
                            labelKey: "Account Holder Name",
                            //labelKey: "BK_PCC_ACCOUNT_HOLDER_NAME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBankAccountHolder",
                        }
                    ),
                    bankAccountTypeRadioGroup: getLabelWithValue(
                        {
                            labelName: "Bank Account Type",
                            labelName: "Bank Account Type",
                            //labelKey: "BK_PCC_BANK_ACCOUNT_TYPE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkAccountType",
                        }
                    ),
                    bkNomineeName: getLabelWithValue(
                        {
                            labelName: "Nominee Name",
                            labelName: "Nominee Name",
                            //labelKey: "BK_PCC_BANK_ACCOUNT_TYPE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkNomineeName",
                        }
                    ),
                   
                   
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
        },
        type: "array",
    },
});
