import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,

} from "egov-ui-framework/ui-config/screens/specs/utils";
import { gotoApplyWithStep ,getCheckbox} from "../../utils/index";
import { getapplicationType } from "egov-ui-kit/utils/localStorageUtils";

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
          //labelKey: "Document 1"
          labelKey: "BK_OSB_DOCUMENTS_DETAILS_HEADER"
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

export const documentsSummary1 = getCommonGrayCard({
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
          labelKey: "Other Documents"
        }),
      },
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-services",
    componentPath: "DownloadFileContainer",
    props: {
      sourceJsonPath: "approvalDocument",
      className: "noc-review-documents"
    }
  }
});

export const documentsSummaryForPacc = getCommonGrayCard({
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
          //labelKey: "Document 1"
          labelKey: "BK_OSB_DOCUMENTS_DETAILS_HEADER"
        }),
      },
    }
  },
  body: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-services",
    componentPath: "DownloadFileContainerWithDocumentType",
    props: {
      sourceJsonPath: "documentsPreview",
      className: "noc-review-documents"
    }
  }
});