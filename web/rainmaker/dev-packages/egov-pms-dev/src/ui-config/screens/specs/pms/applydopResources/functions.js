import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch ,epochToYmd} from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
const moveToSuccess = async(Action, dispatch) => {
  
  const employeeID = getQueryArg(
    window.location.href,
    "employeeID"
  );
  
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const purpose = Action;
  const status = "success";
  dispatch(
    setRoute(
      `/pms/acknowledgementInitiatedop?purpose=${purpose}&status=${status}&employeeID=${employeeID}`
    )
  );
  
};
export const initiateWFApiCall = async (state, dispatch) => {  
 
  const employeeID = getQueryArg(
    window.location.href,
    "employeeID"
  );
  const tenantId = getQueryArg(window.location.href, "tenantId");
  

  let doe = get(
    state,
    "screenConfiguration.preparedFinalObject.searchScreen.doe"
  );
  let dob = get(
    state,
    "screenConfiguration.preparedFinalObject.ProcessInstances[0].dob"
  );
dob = new Date(epochToYmd(dob))

  if(doe!==undefined)
  {

 
  const  GivenDate = new Date(doe)
  const CurrentDate = new Date();
  
  if(GivenDate > CurrentDate){
   // alert('Given date is greater than the current date.');   

    dispatch( toggleSnackbar(
      true,
      { labelName: "Given date can not be greater than the current date", labelKey: 'PENSION_CURRENT_DATE_VALIDATION' },
      "warning"
    ));
}
else if(GivenDate<= new Date(dob))

{
  dispatch( toggleSnackbar(
    true,
    { labelName: "Given date can not be less than date of birth of an employee", labelKey: 'PENSION_CURRENT_DATE_DOB_VALIDATION' },
    "warning"
  ));

}
else{
    
  let WFBody = {
    ProcessInstances: [
      {
          moduleName: "DOP_SERVICE",
          tenantId: tenantId,
          businessService: "DOP_SERVICE",
          businessId: null,
          action: "INITIATE",
          comment: null,
          assignee: null,
          sla: null,
          previousStatus: null,
          employee: {
            code: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].code", '' ),
            dateOfDeath:convertDateToEpoch(doe, "dob"),
          },
          pensioner:{
            pensionerNumber:get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionerNumber", '' ),

          }
          
        
      }       
  ]
  };
 console.log("WFBody")
 console.log(WFBody)
  try {
    let payload = null;
    //initiateRegularRetirementPensionApiCall(status,dispatch,rowData)
    payload = await httpRequest(
      "post",
      "/pension-services/v1/_processWorkflow",
      "",
      [],
      WFBody
    );
    console.log(payload.ResponseInfo.status);
    //alert(payload.ResponseInfo.status)
    
    dispatch(toggleSnackbar(
      true,
      { labelName: "succcess ", labelKey: "PENSION_DEATH_OF_A_PENSIONER_INITIATE_SUCCESS" },
      "success"
    ))
    moveToSuccess("INITIATED",dispatch)
   
    // dispatch(toggleSnackbar(
    //   true,
    //   { labelName: "succcess ", labelKey: "success" },
    //   "success"
    // ))
  } catch (error) {
    
      dispatch(toggleSnackbar(
        true,
        { labelName: error.message, labelKey: error.message },
        "error"
      ));
     // moveToSuccess("INITIATED",dispatch)
  }
}
  }
  else{
    dispatch( toggleSnackbar(
      true,
      { labelName: "Given date can not be greater than the current date", labelKey: 'PENSION_DATE_VALIDATION' },
      "warning"
    ));

  }

  }


