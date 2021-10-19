import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertDateInDMY, getCheckbox } from "../../utils";

export const waterTankerSummary = getCommonGrayCard({
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
                    labelName: "Booking Details",
                    labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
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
                    // applicantName: getLabelWithValue(
                    //     {
                    //         labelName: "Name",
                    //         labelKey: "BK_WTB_NAME_LABEL",
                    //     },
                    //     {
                    //         jsonPath: "Booking.bkApplicantName",
                    //     }
                    // ),
                    // applicantEmail: getLabelWithValue(
                    //     {
                    //         labelName: "Email Address",
                    //         labelKey: "BK_WTB_EMAIL_LABEL",
                    //     },
                    //     {
                    //         jsonPath: "Booking.bkEmail",
                    //     }
                    // ),
                    // applicantMobile: getLabelWithValue(
                    //     {
                    //         labelName: "Mobile Number",
                    //         labelKey: "BK_WTB_MOBILE_NO_LABEL",
                    //     },
                    //     {
                    //         jsonPath: "Booking.bkMobileNumber",
                    //     }
                    // ),
                    HouseNo: getLabelWithValue(
                        
                        {
                            labelName: "House No.",
                            labelKey: "BK_WTB_HOUSE_NUMBER_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkHouseNo",
                        }
                    ),
                    CompleteAddress: getLabelWithValue(
                        {
                            labelName: "Place of Delivery of Water Tanker",
                            labelKey: "Place of Delivery of Water Tanker",
                        },
                        {
                            jsonPath: "Booking.bkCompleteAddress",
                        }
                    ),
                    Sector: getLabelWithValue(
                        {
                            labelName: "Sector",
                            labelKey: "BK_WTB_PROPERTY_SECTOR_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSector",
                        }
                    ),
                    PropertyType: getLabelWithValue(
                        {
                            labelName: "Residential/Commercial",
                            labelKey: "BK_WTB_PROPERTY_TYPE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkType",
                        }
                    ),
                    BookingCase: getLabelWithValue(
                        {
                            labelName: "Case",
                            labelKey: "BK_WTB_CASE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkStatus",
                        }
                    ),
                    BookingDate: getLabelWithValue(
                        {
                            labelName: "Booking Date",
                            labelKey: "BK_WTB_DATE_LABEL",
                        },
                        {
							jsonPath: "Booking.bkDate",
							callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            },
                        }
                    ),
                    BookingTime: getLabelWithValue(
                        {
                            labelName: "Booking Time",
                            labelKey: "BK_WTB_TIME_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkTime",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return value;
                                }
                            },
                        }
                        ),
                        BookingQuantity: getLabelWithValue(
                            {
                                labelName: "Booking Quantity",
                                labelKey: "Booking Quantity",
                            },
                            {
                                jsonPath: "Booking.quantity",
                                callBack: (value) => {
                                    if (value === undefined || value === "" || value === null) {
                                       return "NA"
                                    } else {
                                        return value;
                                    }
                                },
                            }
                        ),

                    }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
            // prefixSourceJsonPath:
            //     "children.cardContent.children.applicantContainer.children",
            // afterPrefixJsonPath: "children.value.children.key",
        },
        type: "array",
    },
});

export const userAggrement = getCommonGrayCard({
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
                    labelName: "Booking Agreement",
                    labelKey: "Booking Agreement",
                }),
            },
        },
    },
    
       
    checkBoxContainer: getCheckbox(
        "I understand that I will be liable for prosecution if any incorrect information is shared by me in this application.",
        "userAggrement"
      )
    
});
