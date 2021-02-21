import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { SearchPensionApplication } from "./searchPensionResource/SearchApplication";
import {searchResults} from "./searchPensionResource/searchResults"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { httpRequest } from "../../../../ui-utils";
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : false;

const header = getCommonHeader({
  labelName: "Pension Search",
  labelKey: "PENSION_PENSION_SEARCH"
});
export const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { 
          moduleName: "pension", 
          masterDetails: 
          [{ name: "PensionRevisionYear" 
          },
          {
            name:"PensionRevisionMonth"
          },
          {
            name:"Disability"
          },
          {
            name:"relationships"
          },
          {
            name:"marritalStatus"
          },
          
        ] },
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
     let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
   
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
   
    console.log(payload.MdmsRes);
    console.log('mdms')
  } catch (e) {
    console.log(e);
  }
};
export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
}

const SearchAndResult = {
  uiFramework: "material-ui",
  name: "searchPension",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    getData(action, state, dispatch).then(responseAction => {
    
    });
    //await getMdmsData(action, state, dispatch);
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
        id: "searchPension"
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
        //pendingApprovals,
        SearchPensionApplication,
        breakAfterSearch: getBreak(),   
        searchResults  ,
        
        
      }
    },
   
  }
};

export default SearchAndResult;
