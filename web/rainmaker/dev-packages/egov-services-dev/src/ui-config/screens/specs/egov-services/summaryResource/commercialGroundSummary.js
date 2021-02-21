import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    convertEpochToDate,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertDateInDMY } from "../../utils/index";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";

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
