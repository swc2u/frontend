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
                    labelName: "New Location Details",
                    labelKey: "BK_OSWMCC_NEW_LOC_DETAILS_HEADER",
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
                    label: "BK_MY_BK_APPLICATION_NUMBER_LABEL",
                    jsonPath: "applicationNumber",
                },
                {
                    label: "BK_MY_BK_APPLICATION_STATUS_LABEL",
                    jsonPath: "applicationStatus",
                },
                {
                    label: "BK_OSWMCC_LOC_SECTOR_LABEL",
                    jsonPath: "sector",
                },
                {
                    label: "BK_OSWMCC_LOC_ADDRESS_LABEL",
                    jsonPath: "localityAddress",
                },
                {
                    label: "BK_OSWMCC_LOC_LANDMARK_LABEL",
                    jsonPath: "landmark",
                },
                
                {
                    label: "BK_OSWMCC_LOC_AREA_REQUIRED_LABEL",
                    jsonPath: "areaRequirement",
                }
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
