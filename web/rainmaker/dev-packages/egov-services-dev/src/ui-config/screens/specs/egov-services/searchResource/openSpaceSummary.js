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

export const openSpaceSummary = getCommonGrayCard({
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
                    labelKey: "BK_MY_BK_APPLICATION_DETAILS_HEADER",
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
        uiFramework: "custom-containers-local",
        componentPath: "MultiItemsWithImageContainer",
        moduleName: "egov-services",
        props: {
            contents: [
                {
                    label: "BK_MY_BK_APPLICATION_NUMBER_LABEL",
                    jsonPath: "bkApplicationNumber",
                },
                {
                    label: "BK_MY_BK_APPLICATION_STATUS_LABEL",
                    jsonPath: "bkApplicationStatus",
                    prefix: "BK_"
                },
                {
                    label: "BK_MY_BK_HOUSE_NO_LABEL",
                    jsonPath: "bkHouseNo",
                },
                {
                    label: "BK_MY_BK_COMPLETE_ADDRESS_LABEL",
                    jsonPath: "bkCompleteAddress",
                },
                {
                    label: "BK_MY_BK_PROPERTY_SECTOR_LABEL",
                    jsonPath: "bkSector",
                },
                {
                    label: "BK_MY_BK_STORAGE_AREA_LABEL",
                    jsonPath: "bkAreaRequired",
                },
                {
                    label: "BK_MY_BK_CITY_LABEL",
                    jsonPath: "bkVillCity",
                },
                {
                    label: "BK_MY_BK_CONSTRUCTION_TYPE_LABEL",
                    jsonPath: "bkConstructionType",
                },
                {
                    label: "BK_MY_BK_PROPERTY_TYPE_LABEL",
                    jsonPath: "bkType",
                },

                {
                    label: "BK_MY_BK_DURATION_LABEL",
                    jsonPath: "bkDuration",
                },

                {
                    label: "BK_MY_BK_CATEGORY_LABEL",
                    jsonPath: "bkCategory",
                },
            ],
            style: {
                backgroundColor: "rgb(242, 242, 242)",
                boxShadow: "none",
                borderRadius: "0",
                overflow: "visible"
            },
            moduleName: "egov-services",
        },
        type: "array",
        // props: {
        //     className: "sellmeatapplicant-summary",
        //     scheama: getCommonGrayCard({
        //         applicantContainer: getCommonContainer({
        //             applicationNumber: getLabelWithValue(
        //                 {
        //                     labelName: "Application ID",
        //                     labelKey: "BK_MY_BK_APPLICATION_NUMBER_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkApplicationNumber",
        //                 }
        //             ),
        //             applicationStatus: getLabelWithValue(
        //                 {
        //                     labelName: "Application Status",
        //                     labelKey: "BK_MY_BK_APPLICATION_STATUS_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkApplicationStatus",
        //                 }
        //             ),
        //             HouseNo: getLabelWithValue(
        //                 {
        //                     labelName: "House No.",
        //                     labelKey: "BK_MY_BK_HOUSE_NO_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkHouseNo",
        //                 }
        //             ),
        //             CompleteAddress: getLabelWithValue(
        //                 {
        //                     labelName: "House No.",
        //                     labelKey: "BK_MY_BK_COMPLETE_ADDRESS_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkCompleteAddress",
        //                 }
        //             ),
        //             Sector: getLabelWithValue(
        //                 {
        //                     labelName: "Sector",
        //                     labelKey: "BK_MY_BK_PROPERTY_SECTOR_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkSector",
        //                 }
        //             ),
        //             PropertyType: getLabelWithValue(
        //                 {
        //                     labelName: "Residential/Commercial",
        //                     labelKey: "BK_MY_BK_PROPERTY_TYPE_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkType",
        //                 }
        //             ),
        //             StorageArea: getLabelWithValue(
        //                 {
        //                     labelName: "Storage Area",
        //                     labelKey: "BK_MY_BK_STORAGE_AREA_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkAreaRequired",
        //                 }
        //             ),
        //             DurationLabel: getLabelWithValue(
        //                 {
        //                     labelName: "Duration",
        //                     labelKey: "BK_MY_BK_DURATION_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkDuration",
        //                 }
        //             ),
        //             Category: getLabelWithValue(
        //                 {
        //                     labelName: "Category",
        //                     labelKey: "BK_MY_BK_CATEGORY_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkCategory",
        //                 }
        //             ),
        //             VillageCity: getLabelWithValue(
        //                 {
        //                     labelName: "Village/City",
        //                     labelKey: "BK_MY_BK_CITY_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkVillCity",
        //                 }
        //             ),
        //             ConstructionType: getLabelWithValue(
        //                 {
        //                     labelName: "Construction Type",
        //                     labelKey: "BK_MY_BK_CONSTRUCTION_TYPE_LABEL",
        //                 },
        //                 {
        //                     jsonPath: "Booking.bkConstructionType",
        //                 }
        //             ),
        //         }),
        //     }),
        //     items: [],
        //     hasAddItem: false,
        //     isReviewPage: true,
        //     sourceJsonPath: "Booking",
        //     prefixSourceJsonPath:
        //         "children.cardContent.children.applicationContainer.children",
        //     afterPrefixJsonPath: "children.value.children.key",
        // },
    },
});
