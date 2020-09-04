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

export const openSpaceOSWMCCSummary = getCommonGrayCard({
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

                    // Sector: getLabelWithValue(
                    //     {
                    //         labelName: "Sector",
                    //         labelKey: "BK_OSB_PROPERTY_SECTOR_LABEL",
                    //     },
                    //     {
                    //         jsonPath: "Booking.bkSector",
                    //     }
                    // ),
                    // PropertyType: getLabelWithValue(
                    //     {
                    //         labelName: "Residential/Commercial",
                    //         labelKey: "BK_OSB_PROPERTY_TYPE_LABEL",
                    //     },
                    //     {
                    //         jsonPath: "Booking.bkType",
                    //     }
                    // ),
                    // StorageArea: getLabelWithValue(
                    //     {
                    //         labelName: "Storage Area",
                    //         labelKey: "BK_OSB_STORAGE_AREA_LABEL",
                    //     },
                    //     {
                    //         jsonPath: "Booking.bkAreaRequired",
                    //     }
                    // ),
                    bookingFromDate: getLabelWithValue(
                        {
                            labelName: "From Date",
                            labelKey: "BK_CGB_FROM_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkFromDate",
                        }
                    ),
                    bookingToDate: getLabelWithValue(
                        {
                            labelName: "To Date",
                            labelKey: "BK_CGB_TO_DATE_LABEL",
                        },
                        {
                            jsonPath: "Booking.bkToDate",
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
