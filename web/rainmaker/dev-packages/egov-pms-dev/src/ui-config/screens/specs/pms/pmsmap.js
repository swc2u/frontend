

import {
  getCommonHeader,
  getCommonContainer,
  getLabel,
  getLabelWithValue,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
  getTenantId,
  localStorageGet
} from "egov-ui-kit/utils/localStorageUtils";
import {
  prepareFinalObject,
  toggleSnackbar,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { footer } from "./pmsmapResource/footer";
import { empDetails } from "./pmsmapResource/employeeDetails";
import get from "lodash/get";
import set from "lodash/set";
import { convertEpochToDate, checkValueForNA, checkValueForNotAsigned } from "../utils";
import {  
  ActionWorkflowAccessibility
  } from "../../../../ui-utils/sampleResponses";
  import { claimReleaseWorkflowApplication,getWorkflowAccessibility, getSearchResultsEmployeeForDeath} from '../../../../ui-utils/commons'
//SU0001 fix for set application number
const tenantId = getQueryArg(window.location.href, "tenantId");
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const applicationNumberContainer = () => {
     applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    if (applicationNumber)
      return {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-noc",
        componentPath: "ApplicationNoContainer",
        props: {
          number: `${applicationNumber}`,
          visibility: "hidden"
        },
        visible: true
      };
    else return {};
  };


  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: "pension Claim/release",
      labelKey: "PENSION_CLIAM_RELEASE_HEADER"
    }),
    applicationNumber: applicationNumberContainer()
    // applicationNumber: {
    //   uiFramework: "custom-atoms-local",
    //   moduleName: "egov-pms",
    //   componentPath: "ApplicationNoContainer",
    //   props: {
    //     number: applicationNumber
    //   },
    //   visible: true
    // }
  });


let isClaimEnabled = true;
let isReleaseEnabled = true;
let isViewEnabled = true;
let businessId ='';
export const getwfAccessibility = async (  state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
   applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  queryObject.push({
    key: "businessIds",
    value: applicationNumber
  });
 
  let payload = null;//ActionWorkflowAccessibilitye(); 
  try {
     payload = await getWorkflowAccessibility(queryObject)
   businessId = applicationNumber;
  isClaimEnabled = payload.ProcessInstances[0].isClaimEnabled;
  isReleaseEnabled = payload.ProcessInstances[0].isReleaseEnabled;
  isViewEnabled = payload.ProcessInstances[0].isViewEnabled;  
  dispatch(prepareFinalObject("WorkflowAccessibility", payload.ProcessInstances));
  let ActionItem =[];
  if(isClaimEnabled)
  ActionItem.push( { action: "CLAIM" }) 
  if(isReleaseEnabled)
  ActionItem.push( { action: "RELEASE" })  
  if(isViewEnabled)
  ActionItem.push( { action: "VIEW" })
  set(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions", ActionItem);
  
  return payload;
  } catch (e) {
    console.log(e);
  }
};
export const wfActionRelease= async (state, dispatch) => {
  let response = await claimReleaseWorkflowApplication(
    state,
    dispatch,
    isReleaseEnabled,
    'RELEASE',
    businessId
  );
  await getwfAccessibility( state, dispatch);
  
};
export const wfActionClaim = async (state, dispatch) => {
  let response = await claimReleaseWorkflowApplication(
    state,
    dispatch,
    isClaimEnabled,
    'CLAIM',
    businessId
  );
  await getwfAccessibility( state, dispatch);
};
export const wfActionView= async (state, dispatch) => {
 
 if(isViewEnabled)
 {
  const pmsmodule = getQueryArg(
    window.location.href,
    "module"
  );
  const tenantId = getQueryArg(window.location.href, "tenantId");
   applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const step = getQueryArg(window.location.href, "step");
  
   // move to workflow detail page
   switch (pmsmodule.toUpperCase()) {
    case "RRP_SERVICE":
      dispatch(
        setRoute(
          `/pms/rrpDetails?applicationNumber=${applicationNumber}&tenantId=${tenantId}&step=${step}`
        )
      );
      break
    case "DOE_SERVICE":
      dispatch(
        setRoute(
          `/pms/doeDetails?applicationNumber=${applicationNumber}&tenantId=${tenantId}&step=${step}`
        )
      );
      break
    case "DOP_SERVICE":
      dispatch(
        setRoute(
          `/pms/dopDetails?applicationNumber=${applicationNumber}&tenantId=${tenantId}&step=${step}`
        )
      );
      break;
   }

 }
 else
 {
  
   let message  = ActionWorkflowAccessibility()
   dispatch(toggleSnackbar(true, { labelName: message.InActiveViewMessage}, "warning"));

 }
 await getwfAccessibility(  state, dispatch);
};
export const getData = async (action, state, dispatch) => {
  let responce = await getwfAccessibility(  state, dispatch);
  //set button visibility based on API responce
console.log(responce)
  //businessId = response.businessId;
  // isClaimEnabled = responce.ProcessInstances[0].isClaimEnabled;
  // isReleaseEnabled = responce.ProcessInstances[0].isReleaseEnabled;
  // isViewEnabled = responce.ProcessInstances[0].isViewEnabled;
  // set(action.screenConfig,'"components.div.children.ClaimButton.visible',isClaimEnabled)
  // set(action.screenConfig,'components.div.children.ReleaseButton.visible',isReleaseEnabled)
  // set(action.screenConfig,'components.div.children.ViewButton.visible',isViewEnabled)
  dispatch(prepareFinalObject("WorkflowAccessibility", responce.ProcessInstances));
  let queryObject = [
    {
      key: "code",
    value: responce.ProcessInstances[0].code
     
    }];
  queryObject.push({
    key: "tenantId",
    value: tenantId
  });
  responce = await getSearchResultsEmployeeForDeath(queryObject);
  dispatch(prepareFinalObject("ProcessInstancestemp", get(responce, "Employees", [])));
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "pmsmap",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
   //SU0001
    applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
   set(
    action.screenConfig,
    "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
    applicationNumber
  );
  getData(action, state, dispatch).then(responseAction => {
    
  });
    
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        
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
           
          }
        }, 
        break: getBreak(),
        assigneeName: getLabelWithValue(
          {
            labelName: "Assignee Name",
            labelKey: "PENSION_ASSIGNEE_NAME"
          },

          
          {jsonPath:"WorkflowAccessibility[0].assigneeName",callBack: checkValueForNotAsigned }

         // { jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom", callBack: checkValueForNA }
        ),     
        // break: getBreak(),
        // ReleaseButton: {
        //   componentPath: "Button",
        //   props: {
        //     variant: "contained",
        //     color: "primary",
        //     style: {
        //       //minWidth: "200px",
        //       height: "48px",
        //       marginRight: "45px"
        //     }
        //   },
        //   children: {
           
        //     submitButtonLabel: getLabel({
        //       labelName: "Submit",
        //       labelKey: "RELEASE"
        //     }),
           
           
        //   },
        //   onClickDefination: {
        //     action: "condition",
        //     callBack: wfActionRelease
        //   },
          
        // },
        // ClaimButton: {
        //   componentPath: "Button",
        //   props: {
        //     variant: "contained",
        //     color: "primary",
        //     style: {
        //       //minWidth: "200px",
        //       height: "48px",
        //       marginRight: "45px"
        //     }
        //   },
        //   children: {
           
        //     submitButtonLabel: getLabel({
        //       labelName: "Submit",
        //       labelKey: "CLAIM"
        //     }),
           
           
        //   },
        //   onClickDefination: {
        //     action: "condition",
        //     callBack: wfActionClaim
        //   },
          
        // },
        // ViewButton: {
        //   componentPath: "Button",
        //   props: {
        //     variant: "contained",
        //     color: "primary",
        //     style: {
        //       //minWidth: "200px",
        //       height: "48px",
        //       marginRight: "45px"
        //     }
        //   },
        //   children: {
           
        //     submitButtonLabel: getLabel({
        //       labelName: "Submit",
        //       labelKey: "VIEW"
        //     }),
           
           
        //   },
        //   onClickDefination: {
        //     action: "condition",
        //     callBack: wfActionView
        //   },
          
        // },
        break: getBreak(),
        empDetails:empDetails(),
        footer:footer()
      }
    },
    
  }
};

export default screenConfig;
