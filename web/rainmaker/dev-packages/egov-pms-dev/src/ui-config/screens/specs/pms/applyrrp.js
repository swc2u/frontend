import {
  getCommonHeader,
  getLabel,
  getBreak,
  getCommonApplyFooter
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSearchResults } from "../../../../ui-utils/commons";
import { empDetails} from "./applyrrpResource/employeeDetails"
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { footer } from "./applyrrpResource/footer";
export const prepareEditFlow = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
 
  
  if (applicationNumber) {

    let queryObject = [
      {
        key: "code",
      value: applicationNumber
       
      }];
    queryObject.push({
      key: "tenantId",
      value: tenantId
    });
    const response = await getSearchResults(queryObject);
     //response = sampleSingleSearch(); 
     
     //export const pmsfooter = footer(response) ;
     dispatch(prepareFinalObject("ProcessInstances", get(response, "Employees", [])));

     const ActionItem = [
      { action: "PENSION_INITIATE" }, 
    
    ];

     set(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions", ActionItem);

   
   
  }
};
const header = getCommonHeader({
  labelName: "Regular Retirement Pension",
  labelKey: "PENSION_REGULAR_RETIREMENT_PENSION_HEADER"
});
const DOEapplyResult = {
  uiFramework: "material-ui",
  name: "applyrrp",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    const employeeID = getQueryArg(
      window.location.href,
      "employeeID"
    );
   //get Eployee details data
prepareEditFlow(state, dispatch, employeeID, tenantId).then(res=>
  {

  }
);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "applyrrp"
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
        empDetails:empDetails(),
       break:getBreak(),       
        footer:footer(),
      }
    },
   
  }
};

export default DOEapplyResult;
