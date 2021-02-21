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
                    labelKey: "BK_OSB_APPLICATION_DETAILS_HEADER",
                }),
            },
        },
    },
    cardOne: {
        uiFramework: "custom-containers-local",
        componentPath: "MultiItemsWithImageContainer",
        moduleName: "egov-services",
        props: {
            contents: [
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
    },
});
