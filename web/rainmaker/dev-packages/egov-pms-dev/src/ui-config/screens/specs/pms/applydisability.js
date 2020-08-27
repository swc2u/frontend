import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { DisabilityApplyApplication} from "./applydisabilityResources/DisabilityApplyApplication";
import { getsearchApplication } from "../../../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { footer } from "./applydisabilityResources/footer";
import { empDetails} from "./applydisabilityResources/employeeDetails"
import {
  getEmployeeDisability,getPensionEmployees
} from "../../../../ui-utils/commons";
import find from "lodash/find";
import set from "lodash/set";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

import { httpRequest } from "../../../../ui-utils";
import {  
  Actiongetlocalization,  
  } from "../../../../ui-utils/LocalizationCode";
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
          [{ name: "Disability" 
          },
         
        ] }
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
    let emp =  get(
      state.screenConfiguration.preparedFinalObject,
      "Employees",
      []
    );
    console.log(emp)
    console.log("emp")
   
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
   
    console.log(payload.MdmsRes);
    console.log('mdms')
  } catch (e) {
    console.log(e);
  }
};
export const prepareEditFlow = async (
  state,
  dispatch,
  employeeID,
  tenantId,
  action
) => {
 
  
  if (employeeID) {
    let queryObject = [
      {
        key: "code",
      value: employeeID
       
      }];
    queryObject.push({
      key: "tenantId",
      value: tenantId
    });
    let response = await getEmployeeDisability(queryObject);    

    const response_ = await getsearchApplication(queryObject);
    let Applications = response_.Applications.filter((x)=>x.state !== null)
    Applications = Applications.filter((x) => x.state !=="INITIATED")// || x.state !=="REJECT" || x.state !=="CLOSED")
    if(Applications.length>0)
    Applications = Applications.filter((x) => x.state !=="REJECT")
    if(Applications.length>0)
    Applications = Applications.filter((x) => x.state !=="CLOSED")

  dispatch(prepareFinalObject("Applicationstate", Applications, []));
  let emp =  get(
    state.screenConfiguration.preparedFinalObject,
    "Employees",
    []
  );

  dispatch(prepareFinalObject("Employees", response.Employees, []));
  response = await getPensionEmployees(queryObject)
  dispatch(prepareFinalObject("EmployeeTemp", response.Employees, []));
  const ActionItem = [
    { action: "PENSION_INITIATE" }, 
  
  ];
   set(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions", ActionItem);
 
  }
};
const header = getCommonHeader({
  labelName: "Disability Registration",
  labelKey: Actiongetlocalization().localization[0].PENSION_DISABILITY_REGISTER.key
});
const applyResult = {
  uiFramework: "material-ui",
  name: "applydisability",
  beforeInitScreen: (action, state, dispatch) => {
    
    getData(action, state, dispatch).then(responseAction => {
    
    });
    const employeeID = getQueryArg(
      window.location.href,
      "employeeID"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    //set disability info if exist
    prepareEditFlow(state, dispatch, employeeID, tenantId, action).then(res=>
      {
    
      });
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "applydisability"
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
        DisabilityApplyApplication,
        footer:footer(),
       
      }
    },
   
  }
};

export default applyResult;
