import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertDateInDMY,getCheckbox } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

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

export const commercialGroundSummary = getCommonGrayCard({
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
                    labelKey: "BK_CGB_APPLICATION_DETAILS_HEADER",
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

                    bookingFromDate: getLabelWithValue(
                        {
                            labelName: "From Date",
                            labelKey: "BK_CGB_FROM_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFromDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                    return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            },
                        }
                    ),
                    bookingToDate: getLabelWithValue(
                        {
                            labelName: "To Date",
                            labelKey: "BK_CGB_TO_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkToDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                    return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            },

                        }
                    ),
                    BookingVenue: getLabelWithValue(
                        {
                            labelName: "Booking Venue",
                            labelKey: "BK_CGB_BOOKING_VENUE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBookingVenue",

                        }
                    ),
                    Category: getLabelWithValue(
                        {
                            labelName: "Category",
                            labelKey: "BK_CGB_CATEGORY_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkCategory",
                        }
                    ), Purpose: getLabelWithValue(
                        {
                            labelName: "Purpose",
                            labelKey: "BK_CGB_PURPOSE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBookingPurpose",
                        }
                    ),


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
