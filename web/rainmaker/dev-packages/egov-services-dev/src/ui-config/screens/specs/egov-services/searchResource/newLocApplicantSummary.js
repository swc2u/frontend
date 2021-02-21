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
                    labelKey: "BK_MY_BK_APPLICANT_DETAILS_HEADER",
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
                    label: "BK_OSB_NAME_LABEL",
                    jsonPath: "applicantName",
                },
                {
                    label: "BK_OSB_EMAIL_LABEL",
                    jsonPath: "mailAddress",
                },
                {
                    label: "Mobile Number",
                    jsonPath: "contact",
                },
                {
                    label: "Address",
                    jsonPath: "applicantAddress",
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
