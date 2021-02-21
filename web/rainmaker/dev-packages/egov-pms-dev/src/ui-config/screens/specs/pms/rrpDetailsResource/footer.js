import {
  dispatchMultipleFieldChangeAction,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getCommonApplyFooter, validateFields,convertDateToEpoch,convertEpochToDate,epochToYmd } from "../../utils";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";
import {  
  sampleSingleSearch,
  ActionButton,
  ActionStep,
  ApplicationConfiguration,
  WFConfig
  
  } from "../../../../../ui-utils/sampleResponses";
import {
  createUpdateNPApplication,
  prepareDocumentsUploadData,
  getworkflowData,
  getworkflowhistoryData,
  prepareDocumentsUploadRedux
} from "../../../../../ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import axios from 'axios';
import { downloadAcknowledgementLetter , downloadAcknowledgementForm} from "../../utils";
import { validateForm } from "egov-ui-framework/ui-redux/screen-configuration/utils";
;
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
  let activeStep_= ActionStep()
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

let payload =[];

const setvalue =(state) =>{ 

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
    employeeGroup:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.reasonForRetirement", '' ),
    lpd:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.lpd", 0 ),
    ltc:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.ltc", 0 ),
    fma:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.fma", 0 ),
    miscellaneous:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.miscellaneous", 0 ),
    incomeTax:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.incomeTax", 0 ),
    cess:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.cess", 0 ),
    overPayment:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.overPayment", 0),
    isDuesPresent:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDuesPresent", false ) === true? "YES" : "NO",
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
//  let payload =  sampleSingleSearch();
  let payload = await httpRequest(
    "post",
    "/pension-services/v1/_searchWorkflow",
    "_search",
    
    queryObject
  );
  
//   let ActionButton_= ActionButton()
// //payload= response;
// for (let index = 0; index < payload.ProcessInstances[0].state.actions.length; index++) {
//   const element = payload.ProcessInstances[0].state.actions[index]; 

//   if(element.action===ActionButton_.FORWARD) 
//   {
//     isforword =true;  
//     F_Action =element.action;
   
    
//   }
//   else if(element.action===ActionButton_.REJECT) 
//   {
//     isreject =true;  
//     R_Action =element.action;
   
    
//   }
//   else if(element.action===ActionButton_.CLOSE) 
//   {
//     isclose =true;  
//     C_Action =element.action;
   
    
//   }
//   else if(element.action===ActionButton_.BACKWORD) 
//   {
    
//     isBack =true;
//     B_Action =element.action;
//   }
//   else if(element.action===ActionButton_.BACKWORD1) 
//   {
    
//     isBack1 =true;
//     B_Action_1 =element.action;
//   }
//   else if(element.action===ActionButton_.BACKWORD2) 
//   {
    
//     isBack2 =true;
//     B_Action_2 =element.action;
//   }
  
// }

let activeStep = get(
  state.screenConfiguration.screenConfig["rrpDetails"],
  "components.div.children.stepper.props.activeStep",
  0
);

// if(activeStep ==1)
// {
//   dispatch(
//     prepareFinalObject(
//       "ProcessInstances[0].documents",
//       payload.ProcessInstances[0].documents
//      // get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].documents", [] ),
//     )
//   );
// prepareDocumentsUploadData(state, dispatch);
// //prepareDocumentsUploadRedux(state,dispatch)
// }
  ////
return payload
} catch (e) {
  console.log(e);
}
 
  console.log(payload) 
};

const wfActionSubmit= async (state, dispatch) => {

  let activeStep = get(
    state.screenConfiguration.screenConfig["rrpDetails"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  let ApplicationDetails_ = setvalue(state)
  let IsValidApplication= get(state.screenConfiguration.preparedFinalObject,"IsValidApplication", false ) 
  if(IsValidApplication)
  {
let IsFormValid = ValidateForm(state,dispatch,activeStep,false)
 let FormValid = true;
 
  let isOtherCardValid = validateFields(
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
    state,
    dispatch,
    "rrpDetails"
  );
  await IsFormValid.then(function(result){
   
    FormValid = result;
  }).catch( err => console.log(err));
 
  if(FormValid)
  {
  //   let isDuesAmountDecided =  get(
  //     state.screenConfiguration.screenConfig["rrpDetails"],
  //     "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.DuesAmountDecided.children.isDuesAmountDecided.props.value",
  //     0
  //   );
   
  //   isDuesAmountDecided = isDuesAmountDecided==="YES"?true:false
    
  //   set(
  //     state,
  //     "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided",
  //     isDuesAmountDecided
  //   );

  //   let isDuesPresent = get(
  //     state.screenConfiguration.screenConfig["rrpDetails"],
  //     "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.isDuesPresent.props.value",
  //     0
  //   );
  
  //   isDuesPresent = isDuesPresent==="YES"?true:false
    
  //   set(
  //     state,
  //     "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent",
  //     isDuesAmountDecided
  //   );
  // let payload = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "ProcessInstances",
  //   []
  // );
  //get set due option in boolean
  let isDuesPresent =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent") 
  isDuesPresent = isDuesPresent==="YES"?true:false
  let isDuesAmountDecided =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided") 
  isDuesAmountDecided = isDuesAmountDecided==="YES"?true:false
  
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent", isDuesPresent);
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided", isDuesAmountDecided);

  let isAnyMisconductInsolvencyInefficiency =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isAnyMisconductInsolvencyInefficiency") 
  isAnyMisconductInsolvencyInefficiency = isAnyMisconductInsolvencyInefficiency==="YES"?true:false
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isAnyMisconductInsolvencyInefficiency", isAnyMisconductInsolvencyInefficiency);
  let wef =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef",0) 
  wef = convertDateToEpoch(wef);
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef", wef);


  // im case of AOP 
  let TakenMonthlyPensionAndGratuity = ''
    let isTakenMonthlyPensionAndGratuity = false;
    let isTakenGratuityCommutationTerminalBenefit = false;
    let isTakenCompensationPensionAndGratuity = false;
    TakenMonthlyPensionAndGratuity = get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isTakenMonthlyPensionAndGratuity",'') ;
    
    if(TakenMonthlyPensionAndGratuity === "YES")
    {
      
    isTakenMonthlyPensionAndGratuity = true
    isTakenGratuityCommutationTerminalBenefit = false
    isTakenCompensationPensionAndGratuity = false

    }
   if(TakenMonthlyPensionAndGratuity === "NO")
    {
     
    isTakenMonthlyPensionAndGratuity = false
    isTakenGratuityCommutationTerminalBenefit = true
    isTakenCompensationPensionAndGratuity = false

    }
   if (TakenMonthlyPensionAndGratuity === "DEFAULT")
    {
      
    isTakenMonthlyPensionAndGratuity = false
    isTakenGratuityCommutationTerminalBenefit = false
    isTakenCompensationPensionAndGratuity = true

    }
   
set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isTakenMonthlyPensionAndGratuity", isTakenMonthlyPensionAndGratuity);
set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isTakenGratuityCommutationTerminalBenefit", isTakenGratuityCommutationTerminalBenefit);
set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isTakenCompensationPensionAndGratuity", isTakenCompensationPensionAndGratuity);

  

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
  let isFormValid = true;
  let hasFieldToaster = false;
  let isLeaveValid = true;
  let isLeaveValidDate = true;
  let isLeaveValidCount = true;
  let  ischeckboxfield= false;
  let isValidwef = true;
  if (activeStep === 0) {
  
   
    let isEmployeeCardValid = validateFields(
      "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.employeedetails.children",
      state,
      dispatch,
      "rrpDetails"
    );
    const isEmployeeOtherValid = validateFields(
      "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children",
      state,
      dispatch,
      "rrpDetails"
    );
    const ReasionContainer = validateFields(
      "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.ReasionContainer.children",
      state,
      dispatch,
      "rrpDetails"
    );
    let leaveJsonPath =
    "components.div.children.formwizardFirstStep.children.empDetails.children.cardContent.children.leaveUnitcard.props.items";
  let leave = get(
    state.screenConfiguration.screenConfig.rrpDetails,
    leaveJsonPath,
    []
  );
  
 
  for (var i = 0; i < leave.length; i++) {
    if (
      (leave[i].isDeleted === undefined ||
        leave[i].isDeleted !== false) &&
      !validateFields(
        `${leaveJsonPath}[${i}].item${i}.children.cardContent.children.leaveUnitcardContainer.children`,
        state,
        dispatch,
        "rrpDetails"
      )
    )
    isLeaveValid = false;
  }
  const fields = get(
    state.screenConfiguration.screenConfig["rrpDetails"],
    "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children",
    {}
  );
  
    if (
      !isEmployeeCardValid  ||
      !isEmployeeOtherValid //||
      //!isLeaveValid  
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
      else if(fields.isCompassionatePensionGranted!==undefined)
      {
        if(fields.isCompassionatePensionGranted.isFieldValid ===false)
        isFormValid = true
        
      }
      else{
        isFormValid = false;
      }
       
    }
    if(fields.dues!==undefined 
      &&fields.miscellaneous!==undefined 
      &&fields.medicalRelief!==undefined 
      &&fields.fma!==undefined       
      &&fields.pensionArrear!==undefined       
      &&fields.lpd!==undefined 
      &&fields.cess!==undefined 
      &&fields.incomeTax!==undefined 
      &&fields.overPayment!==undefined 
      &&fields.ltc!==undefined 
      &&fields.totalNoPayLeavesMonths!==undefined 
      &&fields.totalNoPayLeavesYears!==undefined 
      &&fields.employeeGroup!==undefined 
      &&fields.accountNumber!==undefined 
      &&fields.bankAddress!=undefined
      && fields.totalNoPayLeaves!==undefined) 
      {
        
        if(fields.dues.isFieldValid ===false 
          ||fields.miscellaneous.isFieldValid ===false 
          ||fields.medicalRelief.isFieldValid ===false 
          ||fields.fma.isFieldValid ===false           
          ||fields.pensionArrear.isFieldValid ===false           
          ||fields.lpd.isFieldValid ===false 
          ||fields.cess.isFieldValid ===false 
          ||fields.incomeTax.isFieldValid ===false 
          ||fields.overPayment.isFieldValid ===false 
          ||fields.ltc.isFieldValid ===false 
          ||fields.totalNoPayLeavesMonths.isFieldValid ===false
          ||fields.totalNoPayLeavesYears.isFieldValid ===false
          ||fields.totalNoPayLeaves.isFieldValid ===false
          ||fields.accountNumber.isFieldValid ===false
          ||fields.bankAddress.isFieldValid ===false
          ||fields.employeeGroup.isFieldValid ===false)
          {
            isFormValid = false
          }
        else{
// wef validation
          if(!Accesslable[0].employeeOtherDetailsUpdate)
          {
            
          let dateOfRetirement = get(
            state.screenConfiguration.preparedFinalObject,
            "ProcessInstances[0].employee.dateOfRetirement",//dateOfDeath
            0
          );
          if(Number(dateOfRetirement))
          {
            //alert('i am number')
            dateOfRetirement = epochToYmd(dateOfRetirement)
          }
          let wef =
          get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.wef",0) 
          //wef = convertDateToEpoch(wef);
          if(wef)
          {
          const  wef_ = new Date(wef)
          const  dateOfRetirement_ = new Date(dateOfRetirement)
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
      if(isFormValid)
      {
        // const fields = get(
        //   state.screenConfiguration.screenConfig["rrpDetails"],
        //   "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children",
        //   {}
        // );
      
        // if(fields.reasonForRetirement !==undefined)
        // {
        //   if(fields.reasonForRetirement.isFieldValid !== undefined)
        //   {
        //     if(fields.reasonForRetirement.isFieldValid ===false)
        //     {
        //       isFormValid = false;
        //     }
        //   }
        //   else
        //   {
        //     if(!fields.reasonForRetirement.props.disabled)
        //     isFormValid = false;
        //     else
        //     isFormValid = true;
        //   }
         
        // }
        // let Retirement = get(
        //   state.screenConfiguration.preparedFinalObject,
        //   "ProcessInstances[0].employeeOtherDetails.reasonForRetirement",
        //   null
        // );
        // if(Retirement)
       
        isFormValid= ReasionContainer;
       

      }   
   
    
  }

  if (activeStep === 1) {
    // wfActionLoad(state, dispatch).then(res=>{   
    // })
    const documentsRequired = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsContract")
  ); 
  let wef = get(
    state.screenConfiguration.screenConfig["rrpDetails"],
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
      
      let id = get(state.screenConfiguration.preparedFinalObject,`ProcessInstances[0].documents[${i}].fileStoreId`, '' );
     
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
    let isPensionCardValid = validateFields(
      "components.div.children.formwizardSecondStep.children.pensionDetails.children.cardContent.children.pensionDetailsConatiner.children",
      state,
      dispatch,
      "rrpDetails"
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
        "rrpDetails"
      );
      
      if (
        !isOtherCardValid
      ) {
         isFormValid = false;
      }
      if (isFormValid) {
        let responseStatus = "success"; 
       
        
      } 
      else if (!hasFieldToaster) {
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
        if (!isLeaveValidCount)
            {
              errorMessage = {
                labelName:
                  "leave count should be less then or equal to total days count in select date range, then do next !",
                labelKey: "PENSION_ERR_FILL_EMP_VALD_LEAVE_COUNT"
              };
              
            }
        else if (!isLeaveValidDate)
        {
          errorMessage = {
            labelName:
              "end date  should be greater then start date, then do next !",
            labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_RANGE"
          };
        }
        else if(!isLeaveValid)
        {
          errorMessage = {
            labelName:
              "Enter valid Leave Information, then do next !",
            labelKey: "PENSION_ERR_FILL_EMP_VALD_LEAVE_INFORMATION"
          };

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
         
          // if (!isLeaveValidDate)
          // {
          //   errorMessage = {
          //     labelName:
          //       "end date  should be greater then start date, then do next !",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_RANGE"
          //   };
          // }
          // else if (!isLeaveValidCount)
          // {
          //   errorMessage = {
          //     labelName:
          //       "leave count should be less then or equal to total days count in select date range, then do next !",
          //     labelKey: "PENSION_ERR_FILL_EMP_VALD_LEAVE_COUNT"
          //   };
            
          // }
          // else{
           
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Employee Details, then do next !",
              labelKey: "PENSION_ERR_FILL_EMP_MANDATORY_FIELDS"
            };
          //}
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Pension  Details, then do next !",
            labelKey: "PENSION_ERR_FILL_PENSION_MANDATORY_FIELDS"
          };
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
      else if (!isLeaveValidDate)
      {
        errorMessage = {
          labelName:
            "end date  should be greater then start date, then do next !",
          labelKey: "PENSION_ERR_FILL_EMP_VALD_DATE_RANGE"
        };
      }
      else if(!isLeaveValid)
      {
        errorMessage = {
          labelName:
            "Enter valid Leave Information, then do next !",
          labelKey: "PENSION_ERR_FILL_EMP_VALD_LEAVE_INFORMATION"
        };

      }

      else if(!isValidwef)
      {
        errorMessage = {
          labelName:
          " Date of Commencement is greater then Date of Retirement of a employee!",
          labelKey: "PENSION_ERR_FILL_EMP_VALD_WEF_DOR"
        };

      }
      //alert(errorMessage.labelKey);
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
  
return isFormValid
}

const callBackForNext = async (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["rrpDetails"],
    "components.div.children.stepper.props.activeStep",
    0
  );
 if(!Accesslable[6].IswfClose)
 {
  let details = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].state.actions", [] );
 // setButtons(details)

 let IsValidApplication= get(state.screenConfiguration.preparedFinalObject,"IsValidApplication", false ) 
 if(IsValidApplication)
  ValidateForm(state,dispatch,activeStep,true)
  else{
    setInvalidApplicationRequestMessage(state,dispatch,IsValidApplication)
  }
  
}
else
{
  const ActionItem = [
    { action: "INITIATE" }, 
  
  ];

   set(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions", ActionItem);

  
  changeStep(state, dispatch);

}

 // validate doc upload
};

 const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["rrpDetails"],
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
  dispatchMultipleFieldChangeAction("rrpDetails", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

 const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "rrpDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "rrpDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep" 
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "rrpDetails",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
      case 3:
        dispatchMultipleFieldChangeAction(
          "rrpDetails",
          getActionDefinationForStepper(
            "components.div.children.formwizardThirdStep"
          ),
          dispatch
        );
        break;
    default:
      dispatchMultipleFieldChangeAction(
        "rrpDetails",
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
        pageName:"rrpDetails",
        Visible:true,
        Accesslable:Accesslable
       // updateUrl: "/tl-services/v1/_processWorkflow"
      },
      visible: isforword    

   },

    SubmitButton: {
      componentPath: "Button",
      // gridDefination: {
      //   xs: 4,
      //   sm: 2,
      //   align: "right"
      // },
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
      uiFramework: "custom-containers-local",
    moduleName: "egov-pms",
    componentPath: "DropdownButton",
    props: {
        dataPath: "ProcessInstances",
        moduleName: "INITIATE_RRP_CLOSE",
        pageName:"rrpDetails",
        Visible:true,
        Accesslable:Accesslable
       // updateUrl: "/tl-services/v1/_processWorkflow"
      },
      
      visible: IswfINITIATE
    },

    previousButton: {
      componentPath: "Button",
      // gridDefination: {
      //   xs: 4,
      //   sm: 2,
      //   align: "right"
      // },
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
      // gridDefination: {
      //   xs: 4,
      //   sm: 2,
      //   align: "right"
      // },
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
