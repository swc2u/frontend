import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getCommonApplyFooter, validateFields,convertDateToEpoch,epochToYmd } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { downloadAcknowledgementLetter , downloadAcknowledgementForm} from "../../utils";;
import { httpRequest } from "../../../../../ui-utils";
import {  
  sampleSingleSearch,
  ActionButton,
  ActionStepDop,
  ActionMessage,
  ApplicationConfiguration,
  WFConfig
  } from "../../../../../ui-utils/sampleResponses";
import {
  createUpdateNPApplication,
  prepareDocumentsUploadData,
  getworkflowData,
  getworkflowhistoryData,
  prepareDocumentsUploadRedux,
} from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { loginRequest } from "egov-ui-framework/ui-utils/api";
export const footer = (Accesslabledata) => {
  
  let employeeOtherDetailsUpdate = true;
  let employeeLeaveUpdate = true;
  let pensionCalculation = true;
  let pensionDataUpdate = true;
  let IsCalculate = false;
  let Isletter =false;
  let IswfClose = false
  let IswfINITIATE = false
  let IsSave = false
  //const Accesslable = [];
  let activeStep_= ActionStepDop()
  const step = getQueryArg(window.location.href, "step");
  let responce = get
  switch(step.toUpperCase())
  {
   case activeStep_.INITIATED:
     employeeOtherDetailsUpdate = false;   
     employeeLeaveUpdate= false;    
     break;   
     case activeStep_.PENDING_FOR_CALCULATION:  
     pensionCalculation = false;  
     pensionDataUpdate= false;
     IsCalculate = true;
     case activeStep_.PENDING_FOR_AUDIT:  
     Isletter = true; 
     break;
     case activeStep_.CLOSE:
       IswfClose = true
       break;
        
  }
   const Accesslable =[
   {employeeOtherDetailsUpdate:employeeOtherDetailsUpdate},
   {pensionCalculation:pensionCalculation},
   {employeeLeaveUpdate:employeeLeaveUpdate},
   {pensionDataUpdate:pensionDataUpdate},
   {IsCalculate:IsCalculate},
   {Isletter:Isletter},
   {IswfClose:IswfClose},
 
  ]
  if(IswfClose)
  IsSave = false
  else 
  IsSave = true
  let res = ActionButton();
let isPreviousButtonVisible = false;
let isNextButtonVisible = true;
let isPayButtonVisible = false;
let isBack = false;
let isBack1 = false;
let isBack2 = false;
let isforword = false;
let isreject = false;
let isclose = false;
let B_Action =res.BACKWORD;
let B_Action_1 =res.BACKWORD1;
let B_Action_2 =res.BACKWORD2;
let F_Action =res.FORWARD;;
let R_Action =res.REJECT;;
let C_Action =res.CLOSE;;
let payload =[];


const setvalue =(state) =>{ 
  let Group = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.reasonForRetirement", '' );
  Group = Group;
  let ApplicationDetails = {
// basic details
    businessId: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].businessId", '' ),
    dob:  convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.dob", 0 ),'dob'),
    dateOfRetirement:convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.dateOfRetirement",  0 ),'dob'),
    employee_name:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.name", '' ),
    department:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.assignments[0].department", '' ),
    designation:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.assignments[0].designation", '' ),
    employee_type:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.employeeType", '' ),
    employee_status:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.employeeStatus", '' ),    
    permanentAddress:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.permanentAddress", '' ),
    permanentCity:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.permanentCity", '' ),
    permanentPinCode:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.permanentPinCode", '' ),
    serviceStatus:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.serviceHistory[0].serviceStatus", '' ),
    serviceFrom:convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.serviceHistory[0].serviceFrom", 0 ),'dob'),
    serviceTo:convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.serviceHistory[0].serviceTo", 0 ),'dob'),
    // other details

    reasonForRetirement:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.reasonForRetirement", '' ),
    employeeGroup: Group,
    lpd:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.lpd", 0 ),
    ltc:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.ltc", 0 ),
    fma:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.fma", 0 ),
    miscellaneous:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.miscellaneous", 0 ),
    incomeTax:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.incomeTax", 0 ),
    cess:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.cess", 0 ),
    overPayment:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.overPayment", 0),
    isDuesPresent:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDuesPresent", false ),
    isDuesAmountDecided:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided", false),
    dues:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.dues", 0),
    totalNoPayLeavesDays: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesDays", 0 ),
    totalNoPayLeavesMonths: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesMonths", 0 ),
    totalNoPayLeavesYears: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesYears", 0 ),
    accountNumber:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.accountNumber", 0 ),
    bankAddress:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.bankAddress", 0 ),
    isEligibleForPension:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isEligibleForPension", false ),
    isCommutationOpted:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isCommutationOpted", false ),
    isCompassionatePensionGranted:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isCompassionatePensionGranted", '' ),
    isTakenMonthlyPensionAndGratuity:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isTakenMonthlyPensionAndGratuity", false ),
    isTakenGratuityCommutationTerminalBenefit:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isTakenGratuityCommutationTerminalBenefit", false ),
    isTakenCompensationPensionAndGratuity:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isTakenCompensationPensionAndGratuity", false),
    isAnyJudicialProceedingIsContinuing:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isAnyJudicialProceedingIsContinuing", false ),   
    isAnyMisconductInsolvencyInefficiency:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isAnyMisconductInsolvencyInefficiency", false ),
    isConvictedSeriousCrimeOrGraveMisconduct:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isConvictedSeriousCrimeOrGraveMisconduct", false), 
    isDiesOrInjuredInExtremistsDacoitsSmugglerAntisocialAttack: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.diesInExtremistsDacoitsSmugglerAntisocialAttack", false), 
    isDaMedicalAdmissible:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDaMedicalAdmissible", false), 
    isEmployeeDiesInTerroristAttack:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isEmployeeDiesInTerroristAttack", false), 
    // disability info
    disabilityPercentage:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeDisability.disabilityPercentage", 0 ),
    woundExtraordinaryPension:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeDisability.woundExtraordinaryPension", false ),
    attendantAllowanceGranted:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeDisability.attendantAllowanceGranted", false ),
    
    

    
  }


  return ApplicationDetails
}
const moveToSuccess = (Action, dispatch) => {
  
  const applicationNo = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const purpose = Action;
  const status = "success";
  dispatch(
    setRoute(
      `/pms/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
    )
  );
};


const wfActionLoad = async (state, dispatch) => {
  
 
  isBack = false;
  isBack1 = false;
  isforword = false;
   let response = sampleSingleSearch(); 
 const applicationNumber = getQueryArg(
   window.location.href,
   "applicationNumber"
 );
 const tenantId = getQueryArg(window.location.href, "tenantId");
 let queryObject = [
   {
     key: "tenantId",
     value: tenantId
   }];
 queryObject.push({
   key: "businessIds",
   value: applicationNumber
 });
 try {
  // let payload =  sampleSingleSearch();
   let payload = await httpRequest(
     "post",
     "/pension-services/v1/_searchWorkflow",
     "_search",
     
     queryObject
   );
   
   let ActionButton_= ActionButton()
 //payload= response;
 for (let index = 0; index < payload.ProcessInstances[0].state.actions.length; index++) {
   const element = payload.ProcessInstances[0].state.actions[index]; 
 
   if(element.action===ActionButton_.FORWARD) 
   {
     isforword =true;  
     F_Action =element.action;
    
     
   }
   else if(element.action===ActionButton_.REJECT) 
   {
     isreject =true;  
     R_Action =element.action;
    
     
   }
   else if(element.action===ActionButton_.CLOSE) 
   {
     isclose =true;  
     C_Action =element.action;
    
     
   }
   else if(element.action===ActionButton_.BACKWORD) 
   {
     
     isBack =true;
     B_Action =element.action;
   }
   else if(element.action===ActionButton_.BACKWORD1) 
   {
     
     isBack1 =true;
     B_Action_1 =element.action;
   }
   else if(element.action===ActionButton_.BACKWORD2) 
   {
     
     isBack2 =true;
     B_Action_2 =element.action;
   }
   
 }
 
 let activeStep = get(
   state.screenConfiguration.screenConfig["dopDetails"],
   "components.div.children.stepper.props.activeStep",
   0
 );
 
//  if(activeStep ==1)
//  {
//    dispatch(
//      prepareFinalObject(
//        "ProcessInstances[0].documents",
//        payload.ProcessInstances[0].documents
//      )
//    );
//  //prepareDocumentsUploadData(state, dispatch);
//  }
   
 return payload
 } catch (e) {
   console.log(e);
 }
  
   console.log(payload) 
 };
 const wfActionINITIATE=async (state, dispatch)=>{
  const applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber"
  );
  const tenantId = getQueryArg(
    window.location.href,
    "tenantId"
  );
  const recomputedBusinessId = getQueryArg(
    window.location.href,
    "id"
  );
  if(recomputedBusinessId)
  {
    let INITIATEWarnning = {   
      labelName: "Workflow data submited successfully!",
      labelKey: "PENSION_WF_INITIATE_WARNING"
    };
    dispatch(toggleSnackbar(true, INITIATEWarnning, "warning"));
    

  }
  else{
  let WFBody = {
    ProcessInstances: [
      {
          moduleName: WFConfig().businessServiceDOP,
          tenantId: tenantId,
          businessService: WFConfig().businessServiceDOP,
          businessId: null,
          action: "INITIATE",
          comment: null,
          assignee: null,
          sla: null,
          previousStatus: null,
          closedWorkflow: {
            businessId: applicationNumber,            
          },
        
      }       
  ]
  };
 
  try {
    let payload = null;
    
    payload = await httpRequest(
      "post",
      "/pension-services/v1/_initiateReComputation",
      "",
      [],
      WFBody
    );
    console.log(payload.ResponseInfo.status);
    moveToSuccess("INITIATED",dispatch)

  } catch (error) {
    
      toggleSnackbar(
        true,
        { labelName: "succcess", labelKey: error },
        "error"
      )
    
    console.log(error);
  }
}
}
const wfActionR= async (state, dispatch) => {
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  if(isOtherCardValid)
  {
    set(state.screenConfiguration.preparedFinalObject, "ProcessInstances[0].employeeOtherDetails.reasonForRetirement", "DEATH_AS_EMPLOYEE");
  let response = await createUpdateNPApplication(
    state,
    dispatch,
    R_Action
  );
  let payload = get(
    state.screenConfiguration.preparedFinalObject,
    "ProcessInstances[0]",
    []
  );

  if(response !== undefined)
  {  
    if(response.status !=='failure')
    {    
    moveToSuccess(R_Action, dispatch);
    }
  } 
}
else{
  let errorMessage = {   
    labelName: "Please fill all mandatory fields for Other  Details, then do next !",
    labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
}
};
const wfAction= async (state, dispatch) => {
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  if(isOtherCardValid)
  {
  // check declaration for DDO and Acount Officer for application  and letter download
  const fields = get(
    state.screenConfiguration.screenConfig["dopDetails"],
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children",
    {}
  ); 
  console.log(fields)
  console.log("fields")
  let declarationvalid= true;
  if(Accesslable[0].employeeOtherDetailsUpdate === false)
  {
    declarationvalid = false;
  }
  if(fields.isDDODeclaration.visible===true) 
  {
    declarationvalid = false;
    declarationvalid =  get(state.screenConfiguration.preparedFinalObject, "ProcessInstances[0].employeeOtherDetails.isDDODeclaration")
    if(declarationvalid === undefined)
    {
      declarationvalid=false;
    }

  }
  
  else{
    declarationvalid= true;
  }
  if(declarationvalid)
  {
    //alert('valid declaration')
    let response = await createUpdateNPApplication(
    state,
    dispatch,
    F_Action
  );
  let payload = get(
    state.screenConfiguration.preparedFinalObject,
    "ProcessInstances[0]",
    []
  );

  if(response !== undefined)
  {  
    if(response.status !=='failure')
    {  
      // call api for get application or letter object then call pdf download API passing objct which is get from first  API  
      // for application pdf
      if(fields.isDDODeclaration.visible===true)
      {
      const applicationNumber = getQueryArg(
        window.location.href,
        "applicationNumber"
      );
      const tenantId = getQueryArg(window.location.href, "tenantId");
      let queryObject = [
        {
          key: "tenantId",
          value: tenantId
        }];
      queryObject.push({
        key: "businessIds",
        value: applicationNumber
      });
        let url = "/pension-services/v1/_searchWorkflowApplicationDetails";
      if(!Accesslable[0].employeeOtherDetailsUpdate)
      {
        url = "pension-services/v1/_searchWorkflowApplicationDetails";
      }
      // else if (Accesslable[5].Isletter)
      // {
      //   url = "pension-services/v1/_searchWorkflowPaymentDetails";
      // }
       // let payload =  sampleSingleSearch();
        let pdfResponce = await httpRequest(
          "post",
          url,
          "_search",          
          queryObject
        );
     
      let config = ApplicationConfiguration();
      if(!Accesslable[0].employeeOtherDetailsUpdate)
      {
        
        downloadAcknowledgementForm(pdfResponce.ApplicationDetails,config.DOP_APPLICATION,config.DOP_APPLICATION_config); 
      }
      
      // for Letter PDF
      // if(Accesslable[5].Isletter)
      // {
        
      //   downloadAcknowledgementLetter(pdfResponce.PaymentDetails,config.RRP_PAYMENT_ORDER,config.RRP_PAYMENT_ORDER_config)

      // }
    }
      
   moveToSuccess(F_Action, dispatch);
    }
  } 


  }
  else{
    let errorMessage = {   
      labelName: "Declaration checkbox must be checked before proceeding",
      labelKey: "PENSION_WORKFLOW_DECLARATION_MSG"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));

  }
  }
else{
  let errorMessage = {   
    labelName: "Please fill all mandatory fields for Other  Details, then do next !",
    labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
}
};
const wfActionC= async (state, dispatch) => {
  loginRequest('close')
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  if(isOtherCardValid)
  {
    set(state.screenConfiguration.preparedFinalObject, "ProcessInstances[0].employeeOtherDetails.reasonForRetirement", "DEATH_AS_EMPLOYEE");
  let response = await createUpdateNPApplication(
    state,
    dispatch,
    C_Action
  );
  let payload = get(
    state.screenConfiguration.preparedFinalObject,
    "ProcessInstances[0]",
    []
  );

  if(response !== undefined)
  {  
    if(response.status !=='failure')
    {    
    moveToSuccess(C_Action, dispatch);
    }
  } 
}
else{
  let errorMessage = {   
    labelName: "Please fill all mandatory fields for Other  Details, then do next !",
    labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));
}
};
const wfActionBack= async (state, dispatch) => {
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  if(isOtherCardValid)
  {
  let response = await createUpdateNPApplication(
    state,
    dispatch,
    B_Action
  );
  // let payload = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "ProcessInstances[0]",
  //   []
  // );
  if(response !== undefined)
  {  
    if(response.status !=='failure')
    {    
    moveToSuccess(B_Action, dispatch);
    }
  } 
  }
  else{
    let errorMessage = {   
      labelName: "Please fill all mandatory fields for Other  Details, then do next !",
      labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
};
const wfActionBack1= async (state, dispatch) => {
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  if(isOtherCardValid)
  {
  let response = await createUpdateNPApplication(
    state,
    dispatch,
    B_Action_1
  );
  if(response !== undefined)
  {  
    if(response.status !=='failure')
    {    
    moveToSuccess(B_Action_1, dispatch);
    }
  } 
}
else{
  let errorMessage = {   
    labelName: "Please fill all mandatory fields for Other  Details, then do next !",
    labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));

}
};
const wfActionBack2= async (state, dispatch) => {
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  if(isOtherCardValid)
  {
  let response = await createUpdateNPApplication(
    state,
    dispatch,
    B_Action_2
  );
  if(response !== undefined)
  {  
    if(response.status !=='failure')
    {    
    moveToSuccess(B_Action_2, dispatch);
    }
  } 
}
else{
  let errorMessage = {   
    labelName: "Please fill all mandatory fields for Other  Details, then do next !",
    labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
  };
  dispatch(toggleSnackbar(true, errorMessage, "warning"));

}
};
const setButtons = (details) => {
  let ActionButton_= ActionButton()
  //payload= response;
  for (let index = 0; index < details.length; index++) {
    const element = details[index]; 
  console.log(element)
  console.log(element.action)
    if(element.action===ActionButton_.FORWARD) 
    {
      isforword =true;  
      F_Action =element.action;
     
      
    }
    else if(element.action===ActionButton_.REJECT) 
    {
      isreject =true;  
      R_Action =element.action;
     
      
    }
    else if(element.action===ActionButton_.CLOSE) 
    {
      isclose =true;  
      C_Action =element.action;
     
      
    }
    else if(element.action===ActionButton_.BACKWORD) 
    {
      
      isBack =true;
      B_Action =element.action;
    }
    else if(element.action===ActionButton_.BACKWORD1) 
    {
      
      isBack1 =true;
      B_Action_1 =element.action;
    }
    else if(element.action===ActionButton_.BACKWORD2) 
    {
      
      isBack2 =true;
      B_Action_2 =element.action;
    }
    
  }
}
const wfActionSubmit= async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["dopDetails"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let IsValidApplication= get(state.screenConfiguration.preparedFinalObject,"IsValidApplication", false ) 
  if(IsValidApplication)
  {
  let IsFormValid = ValidateForm(state,dispatch,activeStep,false)
 let FormValid = true;
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "dopDetails"
  );
  await IsFormValid.then(function(result){
   
    FormValid = result;
  }).catch( err => console.log(err));
  if(FormValid)
  {
    
   //get set due option in boolean
   let isDuesPresent =
   get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent") 
   isDuesPresent = isDuesPresent==="YES"?true:false
   let isDuesAmountDecided =
   get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided") 
   isDuesAmountDecided = isDuesAmountDecided==="YES"?true:false
   
   set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent", isDuesPresent);
   set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided", isDuesAmountDecided);
   let wef =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef",0) 
  wef = convertDateToEpoch(wef);
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef", wef);
   if(activeStep ==1)
   {
    
    setcommentFile(state,dispatch);
  }
  let response = await createUpdateNPApplication(
    state,
    dispatch,
    ""
  ); 
 
  let successMsg = {   
    labelName: "Workflow data submited successfully!",
    labelKey: "PENSION_WF_SUBMIT_MESSAGE"
  };
  dispatch(toggleSnackbar(true, successMsg, "success"));
  // reload on interim save 
  let queryObject = [
    {
      key: "businessIds",
    value: getQueryArg(window.location.href, "applicationNumber")
     
    }];
  queryObject.push({
    key: "tenantId",
    value: getQueryArg(window.location.href, "tenantId")
  });
   response = await getworkflowData(queryObject);
  

    const queryObjecth = [
      { key: "businessIds", value: getQueryArg(window.location.href, "applicationNumber") },
      { key: "history", value: true },
      { key: "tenantId", value: getQueryArg(window.location.href, "tenantId") },
      { key: "offset", value: 0 },
      { key: "limit", value: 100 }]

    let payload_ = await getworkflowhistoryData(queryObjecth)
     //response = sampleSingleSearch(); 
     
     //export const pmsfooter = footer(response) ;
     dispatch(prepareFinalObject("ProcessInstances", get(response, "ProcessInstances", [])));    
     dispatch(prepareFinalObject("TaskHistory", get(payload_, "ProcessInstances", [])));
     dispatch(prepareFinalObject("IsCalculated", true));    
    prepareDocumentsUploadData(state,dispatch)
  }
  else{
    // let errorMessage = {   
    //   labelName: "Please fill all mandatory fields for Other  Details, then do next !",
    //   labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
    // };
    // dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
}
  
else{
  setInvalidApplicationRequestMessage(state,dispatch,IsValidApplication)
}
};
const setcommentFile = async (state, dispatch)=>{
  
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  ); 
  const documentsContract = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsContract")
  ); 
 
  for (let i = 0; i < documentsFormat.length; i++) {
    let documentType = get(documentsFormat[i], "documentType");
    let code = get(documentsContract[i], "code");
 
    let documents = get(documentsFormat[i], "documents");
    if (documents && documents.length > 0) { 
     
      let tempfileStoreId = (documents[0]).fileStoreId
     
      let Index = documents[0].fileIndex;
      let oldfilestoreid =get(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].fileStoreId`)
      let olddocumentType =get(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].documentType`)
      if(documentType!== undefined)
      {
        if(tempfileStoreId !== oldfilestoreid && documentType===olddocumentType )
        {
          
          set(
            state,
            `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].fileStoreId`,
            tempfileStoreId
            );
        }
      }
      else{
        if(code===olddocumentType )
        {
          
          set(
            state,
            `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].fileStoreId`,
            tempfileStoreId
            );
        }
        else{
          set(
            state,
            `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${Index}].fileStoreId`,
            tempfileStoreId
            );

        }
      }
     
      set(
        state,
        `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${Index}].fileStoreId`,
        tempfileStoreId
        );

    }
  }
  //set commentrequired for different role
  //    
  const documentsFormat_ = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  ); 
  const documentsContract_ = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsContract")
  ); 

  const commentrequired = documentsContract_[0].documentComment
 
  if(commentrequired)
  {
  for (let i = 0; i < documentsFormat_.length; i++) {
    let documentType = get(documentsFormat_[i], "documentType");
    // console.log(documentsContract_[i])
    // console.log("pritam")
    let code = get(documentsContract_[i], "code");
 
    let documents = get(documentsFormat_[i], "dropdown");
    if (documents ) { 
     let comment = documents.value
     // let tempfileStoreId = (documents[0]).fileStoreId
   
      let olddocumentType =get(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].documentType`)
      if(documentType!== undefined)
      {
        if( documentType===olddocumentType )
        {
          
          set(
            state,
            `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].comment`,
            comment
            );
        }
      }
      else{
        if(code===olddocumentType )
        {
          
          set(
            state,
            `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].comment`,
            comment
            );
        }
      }

    }
  }
  }

}
const setInvalidApplicationRequestMessage = async (state, dispatch, Valid)=>{
  
  // check calculate click then next
  
  if(!Valid)
  {
    let errorMessage = {
      labelName:
        "You are not authorized to access this resource!",
      labelKey: "PENSION_ERR_INVALID_APPLICATION"
    }
 
    dispatch(toggleSnackbar(true, errorMessage, "error"));
   }
 
 }
const ValidateForm = async (state , dispatch, activeStep, IsMove)=>{
  // let activeStep = get(
  //   state.screenConfiguration.screenConfig["dopDetails"],
  //   "components.div.children.stepper.props.activeStep",
  //   0
  // );
  // console.log(activeStep);
  let isFormValid = true;
  let hasFieldToaster = false;
  let isDependentValid = true;
  let isDependentValidDOB = true;
  let isLeaveValidCount = true;
  let  ischeckboxfield= false;
 let isGratuityAmountValid = true;
 let isGratuityPensionValid = true;
 let isValidwef = true;
  if (activeStep === 0) {
  
   
    let isEmployeeCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.employeedetails.children",
      state,
      dispatch,
      "dopDetails"
    );
    const isEmployeeOtherValid = validateFields(
      "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children",
      state,
      dispatch,
      "dopDetails"
    );
    let depJsonPath =
    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.dependentUnitcard.props.items";
  let dependent = get(
    state.screenConfiguration.screenConfig.dopDetails,
    depJsonPath,
    []
  );
  for (var i = 0; i < dependent.length; i++) {
    if (
      (dependent[i].isDeleted === undefined ||
        dependent[i].isDeleted !== false) &&
      !validateFields(
        `${depJsonPath}[${i}].item${i}.children.cardContent.children.dependentUnitcardContainer.children`,
        state,
        dispatch,
        "dopDetails"
      )
    )
    { 
      const fields = get(
      state.screenConfiguration.screenConfig["dopDetails"],
      `${depJsonPath}[${i}].item${i}.children.cardContent.children.dependentUnitcardContainer.children`,
      {}
    );
    if((fields.Address.isFieldValid ===false
      ||fields.Name.isFieldValid === false
      ||fields.Phone.isFieldValid === false
      ||fields.dob.isFieldValid ===false
      ||fields.accountNumber.isFieldValid ===false
      || fields.relationType.isFieldValid ===false))
      {
        isDependentValid = false
  
      }
      else{
        isDependentValid = true;
        if(fields.relationType.props.value )
        {
          if((fields.relationType.props.value ==='DAUGHTER' 
          || fields.relationType.props.value ==='SISTER'
          || fields.relationType.props.value==='STEP_SISTER') && fields.maritalStatus.isFieldValid ===false)
              {
                isDependentValid = false
              }
              else{
                isDependentValid = true
              }
        }
        
        
      }
   
    }
   
  }
  const fields = get(
    state.screenConfiguration.screenConfig["dopDetails"],
    "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children",
    {}
  );  
    if (
      !isEmployeeCardValid  ||
      !isEmployeeOtherValid ||
      !isDependentValid  
    ) {
      

      if(fields.isConvictedSeriousCrimeOrGraveMisconduct!==undefined) 
      {
        if(fields.isConvictedSeriousCrimeOrGraveMisconduct.isFieldValid ===false)
        isFormValid = true
        
      }
      else if(fields.isEmploymentActive!==undefined)
      {
        if(fields.isEmploymentActive.isFieldValid ===false)
        isFormValid = true
        
        
      }
      else if(fields.isDaMedicalAdmissible!==undefined)
      {
        if(fields.isDaMedicalAdmissible.isFieldValid ===false)
        isFormValid = true
        
      }
      else if(fields.isAnyJudicialProceedingIsContinuing!==undefined)
      {
        if(fields.isAnyJudicialProceedingIsContinuing.isFieldValid ===false)
        isFormValid = true
      }
      else if(fields.isAnyMisconductInsolvencyInefficiency!==undefined)
      {
        if(fields.isAnyMisconductInsolvencyInefficiency.isFieldValid ===false)
        isFormValid = true
        
      }
      else if(fields.isEmployeeDiesInTerroristAttack!==undefined)
      {
        if(fields.isEmployeeDiesInTerroristAttack.isFieldValid ===false)
        isFormValid = true
        
      }
      else if(fields.isEmployeeDiesInAccidentalDeath!==undefined)
      {
        if(fields.isEmployeeDiesInAccidentalDeath.isFieldValid ===false)
        isFormValid = true
        
      }
      else if(fields.isCommutationOpted!==undefined)
      {
        if(fields.isCommutationOpted.isFieldValid ===false)
        isFormValid = true
        
      }
      else if(fields.isEligibleForPension!==undefined)
      {
        if(fields.isEligibleForPension.isFieldValid ===false)
        isFormValid = true
        
      }
      else{
        isFormValid = false;
      }
       
    }
    if(fields.lpd!==undefined 
      &&fields.fma!==undefined 
      &&fields.cess!==undefined 
      &&fields.incomeTax!==undefined 
      &&fields.overPayment!==undefined 
      &&fields.totalNoPayLeavesMonths!==undefined 
      &&fields.employeeGroup!==undefined 
      && fields.totalNoPayLeaves!==undefined) 
      {
        
        if(fields.lpd.isFieldValid ===false 
          ||fields.fma.isFieldValid ===false 
          ||fields.cess.isFieldValid ===false 
          ||fields.incomeTax.isFieldValid ===false 
          ||fields.overPayment.isFieldValid ===false 
          ||fields.totalNoPayLeavesMonths.isFieldValid ===false
          ||fields.totalNoPayLeavesYears.isFieldValid ===false
          ||fields.totalNoPayLeaves.isFieldValid ===false
          ||fields.employeeGroup.isFieldValid ===false)
          {
            isFormValid = false
          }
          else{
            // wef validation
                      if(!Accesslable[0].employeeOtherDetailsUpdate)
                      {
                        
                      let dateOfDeath = get(
                        state.screenConfiguration.preparedFinalObject,
                        "ProcessInstances[0].employee.dateOfDeath",//dateOfDeath
                        0
                      );
                      if(Number(dateOfDeath))
                      {
                        //alert('i am number')
                        dateOfDeath = epochToYmd(dateOfDeath)
                      }
                      let wef =
                      get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef",0) 
                      //wef = convertDateToEpoch(wef);
                      if(wef)
                     {
                      const  wef_ = new Date(wef)
                      const  dateOfRetirement_ = new Date(dateOfDeath)
                      if(wef_ < dateOfRetirement_ )
                      {
                        isFormValid = false;
                        isValidwef = false;
                      }
                      else
                      {
                        isFormValid = true;
                        isValidwef = true;
            
                      } 
                    } 
                    }       
                      
                    }
        
      }
     if(!isDependentValid)
     {
       isFormValid = false;
     }
     if(isFormValid)
     { 
    if(isDependentValid)
    {

      let leave = get(
        state.screenConfiguration.preparedFinalObject,
        "ProcessInstances[0].dependents",
        []
      );
      
      for (let index = 0; index < leave.length; index++) {
        const element = leave[index];
       // if ((leave[index].isDeleted === undefined || leave[index].isDeleted !== false))
       if(element)
        {
          
         const  dob = new Date(element.dob);
         const  end =  new Date() ;      
         if(dob>end)
         {
           
           isDependentValid = false;
           isDependentValidDOB = false;
           isFormValid = false;
           break;
         }      
        
        }
       
        
      }
    }
  }
   
    // wfActionLoad(state, dispatch).then(res=>{   
    // })
   
    let dependentstemp = get(
      state.screenConfiguration.preparedFinalObject,
      "ProcessInstances[0].dependents",
      []
    );
    let gratuityamount =0;
    dependentstemp = dependentstemp.filter((item) => item.isDeleted === undefined || item.isDeleted !== false); 
    let payloadtemp = get(
      state.screenConfiguration.preparedFinalObject,
      "ProcessInstances",
      []
    );
    set(payloadtemp[0], 
    "dependents",
    dependentstemp);
    dispatch(prepareFinalObject("ProcessInstances", payloadtemp)); 
    for (let index = 0; index < dependentstemp.length; index++) {
      const element = dependentstemp[index];
      let tempamount = 0
      if ((dependentstemp[index].isDeleted === undefined || dependentstemp[index].isDeleted !== false))
      //if (element.leaveFrom!=="2020")
      {     
        
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].dob`, convertDateToEpoch(element.dob, "dob"));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].name`, (element.name));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].address`, (element.address));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].mobileNumber`, (element.mobileNumber));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].relationship`, (element.relationship));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isDisabled`, Boolean(element.isDisabled));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isEligibleForGratuity`, Boolean(element.isEligibleForGratuity));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isEligibleForPension`, Boolean(element.isEligibleForPension));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isGrandChildFromDeceasedSon`, Boolean(element.isGrandChildFromDeceasedSon));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].isHollyDependent`, Boolean(element.isHollyDependent));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].maritalStatus`, (element.maritalStatus));
        set(state,`screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].noSpouseNoChildren`, Boolean(element.noSpouseNoChildren)); 
      tempamount =  get(
          state,
          `screenConfiguration.preparedFinalObject.ProcessInstances[0].dependents[${index}].gratuityPercentage`,
          0
        );
        if(Boolean(element.isEligibleForPension))
        {
          isGratuityPensionValid = true;
        }
        
        
      }
      
      if(Boolean(element.isEligibleForGratuity))
      {

        gratuityamount = gratuityamount+ Number(tempamount);
      }
      
    }
    // logic to check ggratuity amount
    if(isFormValid)
   {
   
    if(isGratuityPensionValid)
    {
      if(gratuityamount===100 )
      {
        isGratuityAmountValid = true;
        isFormValid=true;
      }
      else{
        isGratuityAmountValid = false;
        isFormValid=false;
  
      }
    }
    else{
      isFormValid=false;

    }
  }


    
  }

  if (activeStep === 1) {
    // wfActionLoad(state, dispatch).then(res=>{   
    // })
    isGratuityPensionValid = true;
    const documentsRequired = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsContract")
  ); 
  let wef = get(
    state.screenConfiguration.screenConfig["dopDetails"],
    "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.wef.props.value",
    0
  );

    if (wef)
    {
      wef = convertDateToEpoch(wef,"Date")
      set(
        state,
        "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef",
        wef
      );
    }

   
  
  let documentsUpload_ = get(documentsRequired[0], "documentsUpload");

  if(documentsUpload_)
  {
    const documentsFormat = Object.values(
      get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
    ); 
    for (let i = 0; i < documentsFormat.length; i++) {
//      docupload = true docupload
      let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
      let isDocumentTypeRequired = get(
        documentsFormat[i],
        "isDocumentTypeRequired"
      );
      // const documentsFormat = Object.values(
      //   get(documentsFormat[i], "documentsUploadRedux")
      // ); 
      let documents = get(documentsFormat[i], "documents");
      let dropdown = get(documentsFormat[i], "dropdown");
      let documentsUpload = get(state.screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[i].documentsUpload, "documentsUpload")
          
      if (isDocumentRequired) {
        if (documents && documents.length > 0) {  
             
          // set(
          //   state,
          //   `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].fileStoreId`,
          //   get(documents[i], "fileStoreId")
          // );
          set(
            state,
            `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].comment`,
            get(dropdown, "value")
          );
          isFormValid=true
        }
        else
        {
          
         
          let id = get(state.screenConfiguration.preparedFinalObject,`ProcessInstances[0].documents[${i}].fileStoreId`, '' );
         
          if (documents === undefined) {
            
            if(id)
            {
              isFormValid = true;
             
            }
            else{
              isFormValid = false;
            //
            break;

            }         


          }
    if(documentsUpload !== undefined)
    {
          if(documentsUpload_)
            {
              isFormValid=false
            }
          }
          else
          {
            isFormValid=true
          }
          
        
        }
      }
      else{
       
        if (documents && documents.length > 0) {  
          
      set(
        state,
        `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${i}].comment`,
        get(dropdown, "value")
      );
      
    }

      }
    }
    if(documentsFormat.length ==0)
                  {
                    for (let index = 0; index < documentsRequired.length; index++) {
                      const element = documentsRequired[index];                     
                      if(element.required)
                      {
                      if(element.url.length>0)
                      {
                        isFormValid = true;
                      }
                      
                    }

                      
                    }
                   
                    
                  }
   
  }
  else
  {
    const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  ); 
  for (let index = 0; index < documentsFormat.length; index++) {
    //isDocumentRequired
    let isDocumentRequired = get(documentsFormat[index], "isDocumentRequired");
    if(isDocumentRequired)
    {  
      
      if(documentsFormat[index].dropdown!== undefined) 
      {
        const element = documentsFormat[index].dropdown.value;    
        set(
          state,
          `screenConfiguration.preparedFinalObject.ProcessInstances[0].documents[${index}].comment`,
          element
        ); 
    } 
  }   
  }
    isFormValid=true
  }
  }

  if (activeStep === 2) {
    isGratuityPensionValid = true;
    let isPensionCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.pensionDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "dopDetails"
    );
    
    if (
      !isPensionCardValid
    ) {
       isFormValid = false;
    }
      //set filestoreid after upload all required or non required documnt upload
    // 
    setcommentFile(state,dispatch)
   
  }

  if (activeStep === 3) {
    // if (activeStep === 31) {
      //   prepareDocumentsUploadData(state, dispatch);
      // }
      let isOtherCardValid = validateFields(
        "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
        state,
        dispatch,
        "dopDetails"
      );
      
      if (
        !isOtherCardValid
      ) {
         isFormValid = false;
      }
      if (isFormValid) {
        let responseStatus = "success"; 
       
        
      } 
      else if (!hasFieldToaster && !isFormValid) {
        let errorMessage = {
          labelName:
            "Please fill all mandatory fields and upload the documents !",
          labelKey: "PENSION_ERR_UPLOAD_REQUIRED_DOCUMENTS"
        };
       
        switch (activeStep) {
         
          case 0:
         
              errorMessage = {
                labelName:
                  "Please fill all mandatory fields for Employee Details, then do next !",
                labelKey: "PENSION_ERR_FILL_EMP_MANDATORY_FIELDS"
              };
          
            break;
          case 2:
            
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Pension  Details, then do next !",
              labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
            };
          //   if (!isDependentValidDOB)
          // {
          //   errorMessage = {
          //     labelName:
          //       "Date of birth should be less then current date!",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_OF_BIRTH"
          //   };
          // }
          // else if(!isGratuityAmountValid)
          // {
          //   errorMessage = {
          //     labelName:
          //       "Total gratuity percentage should not be greater then 100",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_GRATUITY_AMOUNT"
          //   };
  
          // }
          // else if(!isGratuityPensionValid)
          // {
          //   errorMessage = {
          //     labelName:
          //       "Please add at lease one valid dependent to get pension amount",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_PENSION"
          //   };
  
          // }
         
          // else{
           
           
          //   errorMessage = {
          //     labelName:
          //       "Please fill all mandatory fields for Employee Details, then do next !",
          //     labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
          //   };
          // }
            
            break;
          case 3:
            errorMessage = {
              labelName: "Please fill all mandatory fields for Other  Details, then do next !",
              labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
            };
            break;
            case 1:
            errorMessage = {
              labelName: "Please upload all the required documents !",
              labelKey: "PENSION_ERR_UPLOAD_REQUIRED_DOCUMENTS"
            };
            break;
        }
        if(activeStep <2)
        {
        if (!isDependentValidDOB)
        {
          errorMessage = {
            labelName:
              "Date of birth should be less then current date!",
            labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_OF_BIRTH"
          };
        }
        else if(!isDependentValid)
        {
          errorMessage = {
            labelName:
              "Enter valid Dependent Information, then procced !",
            labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_INFORMATION"
          };

        }
        else if(!isGratuityAmountValid)
        {
          errorMessage = {
            labelName:
              "Total gratuity percentage should not be greater then 100",
            labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_GRATUITY_AMOUNT"
          };

        }
        else if(!isGratuityPensionValid)
          {
            errorMessage = {
              labelName:
                "Please add at lease one valid dependent to get pension amount",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_PENSION"
            };
  
          }
        }
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
      }
   
  }
  //if (activeStep !== 3) {
    else  {
     
    if (isFormValid && IsMove) {
      
      if(activeStep === 2 && Accesslable[4].IsCalculate)
      {
        // check calculate click then next
        let IsCalculated= get(state.screenConfiguration.preparedFinalObject,"IsCalculated", false ) 
        if(IsCalculated)
        {
          let errorMessage = {
            labelName:
              "Please click on calculate before procceding for next action !",
            labelKey: "PENSION_CALCULATION_RE_CHECK_WARNING_MESSAGE"
          }
          let IsCalculatedWarning= get(state.screenConfiguration.preparedFinalObject,"IsCalculatedWarning", false ) 
            if(!IsCalculatedWarning)
            {
              dispatch(toggleSnackbar(true, errorMessage, "warning"));
              changeStep(state, dispatch);
            }
            else{
              changeStep(state, dispatch);
            }
        }        
        else{
          let errorMessage = {
            labelName:
              "Please click on calculate before procceding for next action !",
            labelKey: "PENSION_ERR_CALCULATION"
          }

          dispatch(toggleSnackbar(true, errorMessage, "warning"));
        }

      }
      else
      changeStep(state, dispatch);
    } 
    else if (!hasFieldToaster && !isFormValid) {
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields and upload the documents !",
        labelKey: "PENSION_ERR_UPLOAD_REQUIRED_DOCUMENTS"
      };
   
      switch (activeStep) {
        case 0:
         
          if (!isDependentValidDOB)
          {
            errorMessage = {
              labelName:
                "Date of birth should be less then current date!",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_OF_BIRTH"
            };
          }
          else if(!isGratuityAmountValid)
          {
            errorMessage = {
              labelName:
                "Total gratuity percentage should not be greater then 100",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_GRATUITY_AMOUNT"
            };
  
          }
          else if(!isGratuityPensionValid)
          {
            errorMessage = {
              labelName:
                "Please add at lease one valid dependent to get pension amount",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_PENSION"
            };
  
          }
         
          else{
           
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Employee Details, then do next !",
              labelKey: "PENSION_ERR_FILL_EMP_MANDATORY_FIELDS"
            };
          }
        case 2:
         
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Pension  Details, then do next !",
            labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
          };
          // if (!isDependentValidDOB)
          // {
          //   errorMessage = {
          //     labelName:
          //       "Date of birth should be less then current date!",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_OF_BIRTH"
          //   };
          // }
          // else if(!isGratuityAmountValid)
          // {
          //   errorMessage = {
          //     labelName:
          //       "Total gratuity percentage should not be greater then 100",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_GRATUITY_AMOUNT"
          //   };
  
          // }
          // else if(!isGratuityPensionValid)
          // {
          //   errorMessage = {
          //     labelName:
          //       "Please add at lease one valid dependent to get pension amount",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_PENSION"
          //   };
  
          // }
         
          // else{
           
          //   errorMessage = {
          //     labelName:
          //       "Please fill all mandatory fields for Employee Details, then do next !",
          //     labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
          //   };
          // }
          break;
        case 3:
          errorMessage = {
            labelName: "Please fill all mandatory fields for Other  Details, then do next !",
            labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
          };
          break;
          case 1:
          errorMessage = {
            labelName: "Please upload all the required documents !",
            labelKey: "PENSION_ERR_UPLOAD_REQUIRED_DOCUMENTS"
          };
          break;
      }
      if( !isLeaveValidCount)
      {
        errorMessage = {
          labelName:
            "leave count should be less then or equal to total days count in select date range, then do next !",
          labelKey: "PENSION_ERR_FILL_EMP_VALD_LEAVE_COUNT"
        };
      }
      else if (!isDependentValidDOB)
      {
        errorMessage = {
          labelName:
            "Date of birth should be less then current date!",
          labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_OF_BIRTH"
        };
      }
      else if(!isDependentValid)
      {
        errorMessage = {
          labelName:
            "Enter valid dependent information, then procced !",
          labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_INFORMATION"
        };

      }
      else if(!isGratuityPensionValid)
          {
            errorMessage = {
              labelName:
                "Please add at lease one valid dependent to get pension amount",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_PENSION"
            };
  
          }
          else if(!isGratuityAmountValid)
          {
            errorMessage = {
              labelName:
                "Total gratuity percentage should not be greater then 100",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_DEPENDENT_GRATUITY_AMOUNT"
            };
  
          }
          else if(!isValidwef)
          {
            errorMessage = {
              labelName:
                " Date of Commencement is greater then Date of Death of a employee!",
              labelKey: "PENSION_ERR_FILL_EMP_VALD_WEF_DOD"
            };
    
          }
      
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
 // validate doc upload
  
return isFormValid
}

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["dopDetails"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 if(!Accesslable[6].IswfClose)
 {
  let details = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].state.actions", [] );
  setButtons(details)
  let IsValidApplication= get(state.screenConfiguration.preparedFinalObject,"IsValidApplication", false ) 
  if(IsValidApplication)
   ValidateForm(state,dispatch,activeStep,true)
   else{
     setInvalidApplicationRequestMessage(state,dispatch,IsValidApplication)
   }
  
}
else
{
  
  changeStep(state, dispatch);

}
};

const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["dopDetails"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    // if (activeStep === 2 && mode === "next") {
    //   const isDocsUploaded = get(
    //     state.screenConfiguration.preparedFinalObject,
    //     "LicensesTemp[0].reviewDocData",
    //     null
    //   );
    //   activeStep = isDocsUploaded ? 3 : 2;
    // } else {
    activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    // }
  } else {
    activeStep = defaultActiveStep;
  }

  isPreviousButtonVisible = activeStep > 0 ? true : false;
  isNextButtonVisible = activeStep < 3 ? true : false;
  isforword = (activeStep > 2 && IswfClose === false) ? true : false;  
  IswfINITIATE = (activeStep > 2  && IswfClose == true) ? true : false;
  IsSave = (activeStep <3  && IswfClose == false) ? true : false;
  isPayButtonVisible = true; 

 const actionDefination = [
   {
     path: "components.div.children.stepper.props",
     property: "activeStep",
     value: activeStep
   },
   {
     path: "components.div.children.footer.children.previousButton",
     property: "visible",
     value: isPreviousButtonVisible
   },
   {
     path: "components.div.children.footer.children.InitiateButton",
     property: "visible",
     value: IswfINITIATE
   },
   {
     path: "components.div.children.footer.children.BactionButton",
     property: "visible",
     value: isBack,
     
   },
   {
     path: "components.div.children.footer.children.BactionButton1",
     property: "visible",
     value: isBack1,
    
     
   },
   {
     path: "components.div.children.footer.children.BactionButton2",
     property: "visible",
     value: isBack2,
    
     
   },
   {
     path: "components.div.children.footer.children.FactionButton",
     property: "visible",
     value: isforword
   },
   {
     path:"components.div.children.footer.children.ActionButton",
     property: "visible",
     value: isforword
   },
   {
     path: "components.div.children.footer.children.RejectButton",
     property: "visible",
     value: isreject
   },
   {
     path: "components.div.children.footer.children.CloseButton",
     property: "visible",
     value: isclose
   },
   {
     path: "components.div.children.footer.children.SubmitButton",
     property: "visible",
     value: IsSave
   },
   {
     path: "components.div.children.footer.children.nextButton",
     property: "visible",
     value: isNextButtonVisible
   },
   {
     path: "components.div.children.footer.children.payButton",
     property: "visible",
     value: isPayButtonVisible
   }
 ];
  dispatchMultipleFieldChangeAction("dopDetails", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

 const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "dopDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "dopDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep" 
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "dopDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
      case 3:
        dispatchMultipleFieldChangeAction(
          "dopDetails",
          getActionDefinationForStepper(
            "components.div.children.formwizardThirdStep"
          ),
          dispatch
        );
        break;
    default:
      dispatchMultipleFieldChangeAction(
        "dopDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
  }
};

 const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

 const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};


return getCommonApplyFooter({
  // export const footer = getCommonApplyFooter({
  
     ActionButton:{
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "DropdownButton",
      props: {
          dataPath: "ProcessInstances",
          moduleName: "WF_SERVICE",
          pageName:"dopDetails",
          Visible:true,
          Accesslable:Accesslable
         // updateUrl: "/tl-services/v1/_processWorkflow"
        },
        visible: isforword    
  
     },
     SubmitButton: {
       componentPath: "Button",
       props: {
         variant: "contained",
         color: "primary",
         style: {
           //minWidth: "200px",
           height: "48px",
           marginRight: "10px"
         }
       },
       children: {
        
         submitButtonLabel: getLabel({
           labelName: "Submit",
           labelKey: "PENSION_SAVE"
         }),
        
        
       },
       onClickDefination: {
         action: "condition",
         callBack: wfActionSubmit
       },
       visible: IsSave
     },
     InitiateButton: {
       componentPath: "Button",
       props: {
         variant: "contained",
         color: "primary",
         style: {
           //minWidth: "200px",
           height: "48px",
           marginRight: "10px"
         }
       },
       children: {
        
         submitButtonLabel: getLabel({
           labelName: "Submit",
           labelKey: "PENSION_INITIATE"
         }),
        
        
       },
       onClickDefination: {
         action: "condition",
         callBack: wfActionINITIATE
       },
       visible: IswfINITIATE
     },
 
   previousButton: {
     componentPath: "Button",
     props: {
       variant: "outlined",
       color: "primary",
       style: {
        // minWidth: "200px",
         height: "48px",
         marginRight: "16px" 
       }
     },
     children: {
       previousButtonIcon: {
         uiFramework: "custom-atoms",
         componentPath: "Icon",
         props: {
           iconName: "keyboard_arrow_left"
         }
       },
       previousButtonLabel: getLabel({
         labelName: "Previous Step",
         labelKey: "PENSION_COMMON_BUTTON_PREV_STEP"
       })
     },
     onClickDefination: {
       action: "condition",
       callBack: callBackForPrevious
     },
     visible: isPreviousButtonVisible
   },
   nextButton: {
     componentPath: "Button",
     props: {
       variant: "contained",
       color: "primary",
       style: {
        // minWidth: "200px",
         height: "48px",
         marginRight: "10px"
       }
     },
     children: {
       nextButtonLabel: getLabel({
         labelName: "Next Step",
         labelKey: "PENSION_COMMON_BUTTON_NXT_STEP"
       }),
       nextButtonIcon: {
         uiFramework: "custom-atoms",
         componentPath: "Icon",
         props: {
           iconName: "keyboard_arrow_right"
         }
       }
     },
     onClickDefination: {
       action: "condition",
       callBack: callBackForNext
     },
     visible:isNextButtonVisible
   },
  
 });
}
