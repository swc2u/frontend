import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { RRPApplication} from "./searchRecomputationResource/RRPApplication";
import { showHideAdhocPopup, resetFields, getRequiredDocData } from "../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { searchResults } from "./searchRecomputationResource/searchResults";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";
import { ActionBusinessService} from "../../../../ui-utils/PensionResponce";


const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : false;
const header = getCommonHeader({
  labelName: "Re-Computation of Benefits ",
  labelKey: "PENSION_RECOMPUTATION_BENEFIT"
});
export const getData = async (action, state, dispatch) => {
 
   await getMdmsData(action, state, dispatch);
   
   // await wfActionLoad(action, state, dispatch).then(res=>{
     
   // })
 };
export const getMdmsData = async (action, state, dispatch) => {
  
  let tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        { 
          moduleName: "pension", 
          masterDetails: 
          [{ name: "BusinessService" 
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
   //let ActionBusinessService_ = ActionBusinessService();
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
   // dispatch(prepareFinalObject("applyScreenMdmsData", ActionBusinessService_.MdmsRes));
   
    console.log(payload.MdmsRes);
    console.log('mdms')
  } catch (e) {
    console.log(e);
  }
};

const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "searchRecomputation",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    getData(action, state, dispatch).then(responseAction => {
    
    }); 
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
        id: "searchRecomputation"
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
       // pendingApprovals,
        RRPApplication,
        breakAfterSearch: getBreak(),
        // progressStatus,
        searchResults
        
      }
    },

  }
};

export default NOCSearchAndResult;
