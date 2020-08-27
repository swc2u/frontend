import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { RRPApplication } from "./searchResource/RRPApplication";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchResults } from "./searchResource/searchResults";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
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
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : false;

const header = getCommonHeader({
  labelName: "Regular Retirement Pension",
  labelKey: "PENSION_REGULAR_RETIREMENT_PENSION_HEADER"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(
    prepareFinalObject("FireNOCs", [{ "fireNOCDetails.fireNOCType": "NEW" }])
  );
  // dispatch(setRoute("/tradelicence/apply"));
};

const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
  getData(action, state, dispatch);
    const tenantId = getTenantId();
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
        id: "search"
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
           
          }
        },
        
        RRPApplication,
        breakAfterSearch: getBreak(),       
        searchResults
      }
    },

  }
};

export default NOCSearchAndResult;
