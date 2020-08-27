import {
    getLabel,
    dispatchMultipleFieldChangeAction
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { download } from "egov-common/ui-utils/commons";
  import { applyTradeLicense } from "../../../../../ui-utils/commons";
  import {
    getButtonVisibility,
    getCommonApplyFooter,
    
    downloadAcknowledgementForm,
    downloadCertificateForm
  } from "../../utils";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import {
    toggleSnackbar,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
 
  import get from "lodash/get";
  import set from "lodash/set";
  export const initiateWFApiCall = async (state, dispatch) => { 
      alert('i am in ititiate') 
  }
export const footerReview = (
    
    state,
    dispatch,
   
  ) => {
    /** MenuButton data based on status */
    let downloadMenu = [];
    let printMenu = [];
    
    let applicationPrintObject = {
      label: { labelName: "Initiate", labelKey: "PENSION_INITIATE" },
      link: () => {
        initiateWFApiCall(state,dispatch)
        
      },
      //leftIcon: "assignment"
    };
    
    /** END */
  
    return getCommonApplyFooter({
      container: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          leftdiv: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            props: {
              style: { textAlign: "left", display: "flex" }
            },
            children: {
              downloadMenu: {
                uiFramework: "custom-atoms-local",
                moduleName: "egov-tradelicence",
                componentPath: "MenuButton",
                props: {
                  data: {
                    label: {
                      labelName:"Download",labelKey:"TL_DOWNLOAD"},
                    leftIcon: "cloud_download",
                    rightIcon: "arrow_drop_down",
                    props: { variant: "outlined", style: { marginLeft: 10 } },
                    menu: downloadMenu
                  }
                }
              },
              printMenu: {
                uiFramework: "custom-atoms-local",
                moduleName: "egov-tradelicence",
                componentPath: "MenuButton",
                props: {
                  data: {
                    label: {
                      labelName:"Print",labelKey:"TL_PRINT"},
                    leftIcon: "print",
                    rightIcon: "arrow_drop_down",
                    props: { variant: "outlined", style: { marginLeft: 10 } },
                    menu: printMenu
                  }
                }
              }
            },
            gridDefination: {
              xs: 12,
              sm: 6
            }
          },
         
        }
      }
    });
  };