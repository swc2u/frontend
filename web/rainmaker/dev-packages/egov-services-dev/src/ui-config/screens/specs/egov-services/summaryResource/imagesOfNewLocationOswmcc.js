import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const ImageLocationSummary = getCommonGrayCard({
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
          labelName: "New Location Images",
          labelKey: "BK_OSWMCC_NEW_LOC_IMAGES_DETAILS_HEADER"
        }),
      },
    }
  },
  body: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-services",
    componentPath: "ImageList",
    props: {
      sourceJsonPath: "mccNewLocImagesPreview",
      className: "mcc-new-location-imgs"
    }
  }

});
