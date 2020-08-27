import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { RRPApplication} from "./searchRegisterResource/RRPApplication";
import { showHideAdhocPopup, resetFields } from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import { searchResults } from "./searchRegisterResource/searchResults";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";

const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : false;

const header = getCommonHeader({
  labelName: "Mannual Regiater",
  labelKey: "PENSION_MANNUAL_REGISTER"
});
const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "Department", filter: "[?(@.active == true)]" },
            { name: "Designation", filter: "[?(@.active == true)]" }
           
          ]
        },
        {
          moduleName: "pension",
          masterDetails: [
            { name: "PensionConfig", },
          
           
          ]
        },
       
      ]
    }
  };
  try {
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("searchScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const getData = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};
const pageResetAndChange = (state, dispatch) => {
  dispatch(
    prepareFinalObject("FireNOCs", [{ "fireNOCDetails.fireNOCType": "NEW" }])
  );
  // dispatch(setRoute("/tradelicence/apply"));
};

const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "searchRegister",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    getData(action, state, dispatch);
    //set search param blank
dispatch(prepareFinalObject("searchScreen",{}));
  
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "searchRegister"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },

              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px"
                    }
                  }
                },

                buttonLabel: getLabel({
                  labelName: "NEW APPLICATION",
                  labelKey: "PENSION_SEARCH_RESULTS_BUTTON_SEARCH"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  pageResetAndChange(state, dispatch);
                  showHideAdhocPopup(state, dispatch, "searchRegiater");
                }
              },
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["NOC_CEMP", "SUPERUSER"]
              }
            }
          }
        },
       // pendingApprovals,
        RRPApplication,
        breakAfterSearch: getBreak(),
        // progressStatus,
        searchResults
        
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-noc",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "searchRegister"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default NOCSearchAndResult;
