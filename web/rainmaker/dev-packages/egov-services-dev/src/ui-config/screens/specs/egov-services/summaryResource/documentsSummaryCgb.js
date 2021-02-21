import {
    getBreak,
    getCommonContainer,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep } from "../../utils/index";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";

export const documentsSummary = getCommonGrayCard({
    header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
            style: { marginBottom: "10px" }
        },
        children: {
            header: {
                gridDefination: {
                    xs: 8
                },
                ...getCommonSubHeader({
                    labelName: "Documents",
                    labelKey: "BK_CGB_DOCUMENTS_DETAILS_HEADER"
                }),
            },
        }
    },
    body: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-services",
        componentPath: "DownloadFileContainer",
        props: {
            sourceJsonPath: "documentsPreview",
            className: "noc-review-documents"
        }
    }
});
