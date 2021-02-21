import {
    getCommonHeader,
    getCommonContainer,
    getCommonSubHeader
  } from "egov-ui-framework/ui-config/screens/specs/utils";

  import { SUSVReviewDetails } from "./viewSUSVResource/susv-review";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";  
  
  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "SUSV - Summary",
      labelKey: "NULM_SUSV_SUMMARY"
    })
  });
  
  export const subHeader = getCommonContainer({
    subHeader: getCommonSubHeader({
      labelName:
        "Verify entered details before submission.",
      labelKey: "STORE_PURCHASE_ORDER_SUB_HEADER"
    })
  });
  
  const tradeReview = SUSVReviewDetails(true);
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "review-susv",
    beforeInitScreen: (action, state, dispatch) => {
  
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...header
              },
              subHeader: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...subHeader
              }
            }
          },
          tradeReview
        }
      }
    }
  };
  
  export default screenConfig;
  