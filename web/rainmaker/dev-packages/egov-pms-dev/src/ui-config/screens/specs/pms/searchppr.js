import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { PensionReviewApplication } from "./searchReviewResource/PensionReviewApplication";
import { searchResults } from "./searchReviewResource/searchResults";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import {
  ActionPensionReview
} from "../../../../ui-utils/PensionResponce";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getRequiredDocuments } from "./requiredDocuments/reqDocs";

import { httpRequest } from "../../../../ui-utils";


const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : false;

const header = getCommonHeader({
  labelName: "PENSION_PENSIONER_REVESION",
  labelKey: "PENSION_PENSIONER_REVESION"
});

const pageResetAndChange = (state, dispatch) => {
  dispatch(
    prepareFinalObject("FireNOCs", [{ "fireNOCDetails.fireNOCType": "NEW" }])
  );
  // dispatch(setRoute("/tradelicence/apply"));
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
const NOCSearchAndResult = {
  uiFramework: "material-ui",
  name: "searchppr",
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
        id: "searchppr"
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
        PensionReviewApplication,
        breakAfterSearch: getBreak(),
        searchResults,
        // PensionReview: {
        //   uiFramework: "custom-containers-local",
        //   componentPath: "PensionReviewContainer",
        //   moduleName: "egov-pms",
        //     // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
        //     props: {
        //       dataPath: "ProcessInstances",
        //       moduleName: "DOE_SERVICE",
        //       pageName:"REVESION"
        //      // updateUrl: "/tl-services/v1/_processWorkflow"
        //     }
        // },
        
      }
    },

  }
};

export default NOCSearchAndResult;
