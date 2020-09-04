import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertDateInDMY } from "../../utils";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

export const openSpaceSummaryOSWMCC = getCommonGrayCard({
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
                    labelName: "Application Details",
                    labelKey: "BK_OSWMCC_NEW_LOC_DETAILS_HEADER",
                }),
            },
            
        },
    },
    cardOne: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        // moduleName: "egov-services",
        props: {
            className: "sellmeatapplicant-summary",
            scheama: getCommonGrayCard({
                applicationContainer: getCommonContainer({
                    fromDate: getLabelWithValue(
                        {
                            labelName: "From Date",
                            labelKey: "BK_OSWMCC_BOOKING_FROM_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFromDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            }
                        }
                    ),
                    toDate: getLabelWithValue(
                        {
                            labelName: "To Date",
                            labelKey: "BK_OSWMCC_BOOKING_TO_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkToDate",
                            callBack: (value) => {
                                if (value === undefined || value === "" || value === null) {
                                   return "NA"
                                } else {
                                    return convertDateInDMY(value);
                                }
                            }
                        }
                    ),
                    sector: getLabelWithValue(
                        {
                            labelName: "Locality",
                            labelKey: "BK_OSWMCC_BOOKING_SECTOR_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkSector",
                        }
                    ),
                    venue: getLabelWithValue(
                        {
                            labelName: "Venue",
                            labelKey: "BK_OSWMCC_BOOKING_VENUE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBookingVenue",
                        }
                    ),
                    purpose: getLabelWithValue(
                        {
                            labelName: "Purpose",
                            labelKey: "BK_OSWMCC_BOOKING_PURPOSE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkBookingPurpose",
                        }
                    )
                }),
            }),
            items: [],
            hasAddItem: false,
            isReviewPage: true,
            sourceJsonPath: "Booking",
        },
        // props: {
        //     contents: [
        //         {
        //             label: "BK_OSWMCC_BOOKING_FROM_DATE_LABEL",
        //             jsonPath: "bkFromDate",
        //         },
        //         {
        //             label: "BK_OSWMCC_BOOKING_TO_DATE_LABEL",
        //             jsonPath: "bkToDate",
        //         },
        //         {
        //             label: "BK_OSWMCC_BOOKING_SECTOR_LABEL",
        //             jsonPath: "bkSector",
        //         },
        //         {
        //             label: "BK_OSWMCC_BOOKING_VENUE_LABEL",
        //             jsonPath: "bkBookingVenue",
        //         },
        //         {
        //             label: "BK_OSWMCC_BOOKING_PURPOSE_LABEL",
        //             jsonPath: "bkBookingPurpose",
        //         },
                
        //         // {
        //         //     label: "BK_OSWMCC_LOC_AREA_REQUIRED_LABEL",
        //         //     jsonPath: "areaRequirement",
        //         // }
        //     ],
        //     moduleName: "egov-services",
        // },
        type: "array",
    },
});
