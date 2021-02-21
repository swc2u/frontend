import {
  getCommonHeader,
  getLabel,
  getBreak,
  getCommonApplyFooter
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getSearchResultsEmployeeForDeath } from "../../../../ui-utils/commons";
import { empDetails} from "./reviewRegisterResource/employeeDetails"
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
import { footer } from "./reviewRegisterResource/footer";
import { httpRequest } from "../../../../ui-utils";
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
    const response = await getSearchResultsEmployeeForDeath(queryObject);
     //response = sampleSingleSearch(); 
     
     //export const pmsfooter = footer(response) ;
     dispatch(prepareFinalObject("ProcessInstances", get(response, "Employees", [])));

     const ActionItem = [
      { action: "PENSION_INITIATE_PUSH_REGISTER" }, 
    
    ];
     set(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions", ActionItem);
   
  }
};
const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [       
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
const header = getCommonHeader({
  labelName: "PENSION_MANNUAL_REGISTER",
  labelKey: "PENSION_MANNUAL_REGISTER"
});
const DOEapplyResult = {
  uiFramework: "material-ui",
  name: "reviewRegister",
  beforeInitScreen: (action, state, dispatch) => {
  //  resetFields(state, dispatch);
    const tenantId = getTenantId();
    const employeeID = getQueryArg(
      window.location.href,
      "employeeID"
    );
    getData(action, state, dispatch);
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
        id: "reviewRegister"
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
