import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import set from "lodash/set";
import { validateFields}from "../../ui-config/screens/specs/utils"
import { validate } from "egov-ui-framework/ui-redux/screen-configuration/utils";
import { createUpdateNPApplication } from "../../ui-utils/commons";
//import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { httpRequest } from "../../ui-utils/api";
import { saveEmployeeDisability, getWorkflowAccessibility} from "../../ui-utils/commons";
import {   ApplicationConfiguration,  WFConfig,ActionWorkflowAccessibility, ActionButton } from "../../ui-utils/sampleResponses";
import { Actiongetlocalization, } from "../../ui-utils/LocalizationCode";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg , epochToYmd, getDateInEpoch, setBusinessServiceDataToLocalStorage} from "egov-ui-framework/ui-utils/commons";
import { convertEpochToDate ,getLocalizationCodeValue} from "../../ui-config/screens/specs/utils";
import { downloadAcknowledgementLetter , downloadAcknowledgementForm} from "../../ui-config/screens/specs/utils";
import {
  getUserInfo,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
class DropdownButton extends Component {

  state = {
    open: false,
    action: ""
  };
  RRP_INITIATE = async( moduleName)=>{
    
    const { prepareFinalObject, toggleSnackbar, state } = this.props;
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let WFBody = {
      ProcessInstances: [
        {
            moduleName: WFConfig().businessServiceRRP,
            tenantId: tenantId,
            businessService: WFConfig().businessServiceRRP,
            businessId: null,
            action: "INITIATE",
            comment: null,
            assignee: null,
            sla: null,
            previousStatus: null,
            employee: {
              pensionEmployeeId: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionEmployeeId", '' ),
              code: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].code", '' ),
            },
          
        }       
    ]
    };
   
    try {
      let payload = null;
      
      payload = await httpRequest(
        "post",
        "/pension-services/v1/_processWorkflow",
        "",
        [],
        WFBody
      );
      // console.log(payload.ResponseInfo.status);
     
      toggleSnackbar(
        true,
        { labelName: "succcess ", labelKey: 'PENSION_RRP_INITIATED' },
        "success"
      )
     // window.location.href = "/inbox";
     
      //dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      
        toggleSnackbar(
          true,
          { labelName: "succcess", labelKey:e },
          "error"
        )
  
    }
  }
  DOE_INITIATE = async( moduleName)=>{
   
    const { prepareFinalObject, toggleSnackbar, state } = this.props;
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
  
      ( toggleSnackbar(
        true,
        { labelName: "Given date can not be greater than the current date", labelKey: 'PENSION_CURRENT_DATE_VALIDATION' },
        "warning"
      ))
  }
  else if(GivenDate<= new Date(dob))
  
  {
    ( toggleSnackbar(
      true,
      { labelName: "Given date can not be less than date of birth of an employee", labelKey: 'PENSION_CURRENT_DATE_DOB_VALIDATION' },
      "warning"
    ))
  
  }
  else{
    let WFBody ={};
    let key = "PENSION_DEATH_OF_A_EMPLOYEE_INITIATE_SUCCESS";
      if(moduleName ==="INITIATE_DOP")
      { 
        key = "PENSION_DEATH_OF_A_PENSIONER_INITIATE_SUCCESS"
         WFBody = {
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
              employee: {
                code: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].code", '' ),// ,employeeID,
                dateOfDeath:convertDateToEpoch(doe, "dob"),
              },
              pensioner:{
                pensionerNumber:get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionerNumber", '' ),// pensionerNumber,
    
              }
              
            
          }       
      ]
      };

      }
      else{
        key = "PENSION_DEATH_OF_A_EMPLOYEE_INITIATE_SUCCESS"
         WFBody = {
          ProcessInstances: [
            {
                moduleName: WFConfig().businessServiceDOE,
                tenantId: tenantId,
                businessService: WFConfig().businessServiceDOE,
                businessId: null,
                action: "INITIATE",
                comment: null,
                assignee: null,
                sla: null,
                previousStatus: null,
                employee: {
                  code: employeeID,
                  dateOfDeath:convertDateToEpoch(doe, "dob"),
                },
                
              
            }       
        ]
        };
      }
     
     
      try {
        let payload = null; 
        payload = await httpRequest(
          "post",
          "/pension-services/v1/_processWorkflow",
          "",
          [],
          WFBody
        );
       
        toggleSnackbar(
          true,
          { labelName: "succcess ", labelKey: key },
          "success"
        )
       
        
      } catch (error) {      
        
          toggleSnackbar(
            true,
            { labelName: error.message, labelKey: error.message },
            "error"
          )
      }
  }
    }
    else{
     toggleSnackbar(
        true,
        { labelName: "Given date can not be greater than the current date", labelKey: 'PENSION_DATE_VALIDATION' },
        "warning"
      )
  
    }
  
  }
  ClaimRelease = async(Action)=>{    
    const { prepareFinalObject, toggleSnackbar, state, dispatch } = this.props;   
    const businessId = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    let view = false;
    switch (Action){
      case 'CLAIM':
        view = false
        break
        case 'RELEASE':
          view = false
        break
        case 'VIEW':
          view = true
        break

    }
    if(!view)
    {
    let WFBody = {
      ProcessInstances: [
        {
          businessId : businessId
        }       
    ]
    };
    try{
      let message  = ActionWorkflowAccessibility()
      let displaymessage =''
      let url='';     
      if(true)
      {
        if(Action ==="RELEASE")
        {
        url = '/pension-services/v1/_releaseWorkflow';
        }
        else if (Action ==="CLAIM")
        {
          url = '/pension-services/v1/_claimWorkflow';
        } 
  
        // validate cross browser claim validation
        let ValidClaim = false
        if(Action === "CLAIM")
        {
          let queryObject = [
            {
              key: "tenantId",
              value: getQueryArg(window.location.href, "tenantId")
            }
          ];
          queryObject.push({
            key: "businessIds",
            value: getQueryArg(
              window.location.href,
              "applicationNumber"
            )
          });
          let response = await getWorkflowAccessibility(queryObject)
          let id = response.ProcessInstances[0].assignee
          if(id)
          {
          let userinfo = JSON.parse(getUserInfo());         
            if(id !== userinfo.uuid)
            ValidClaim = false;
          }
          else{
            ValidClaim = true
          }
        }
        else 
        ValidClaim = true

       if(ValidClaim)
       {

      
          let response = await httpRequest(
              "post",
             url,
              "",
              [],
             WFBody
            );
            toggleSnackbar(
              true,
              { labelName: "Clain Release success", labelKey: `PENSION_WF_${Action}_SUCCESS_MESSAGE` },
              "success"
            )

            //set Action
            const tenantId = getQueryArg(window.location.href, "tenantId");
            let queryObject = [
              {
                key: "tenantId",
                value: tenantId
              }
            ];
            queryObject.push({
              key: "businessIds",
              value: businessId
            });
            let payload = await getWorkflowAccessibility(queryObject)
            
            let ActionItem =[];
            if(payload.ProcessInstances[0].isClaimEnabled)
            ActionItem.push( { action: "CLAIM" }) 
            if(payload.ProcessInstances[0].isReleaseEnabled)
            ActionItem.push( { action: "RELEASE" })  
            if(payload.ProcessInstances[0].isViewEnabled)
            ActionItem.push( { action: "VIEW" })
            set(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions", ActionItem);
           // window.location.reload();
            window.location.reload(false);
          }
          else
          {
            toggleSnackbar(
              true,
              { labelName: "Task cannot be claimed as it has already been claimed by you or other user", labelKey: `PENSION_WF_CLAIM_VALIDATION_MESSAGE` },
              "warning"
            )
          }
        }
         
        
     
  
      
    }
   catch (error) {
    (toggleSnackbar(true, { labelName: error.message }, "error"));
  
  }
}
else{
  const pmsmodule = getQueryArg(
    window.location.href,
    "module"
  );
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
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
    
  }
 
  PushToMannualRegister = async( )=>{
    const { prepareFinalObject, toggleSnackbar, state } = this.props;
   
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let WFBody = {
      Employees: [
        {
          code: get(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].code", '' ),// ,employeeID,,
            tenantId: tenantId,
           
        }       
    ]
    };
   
    try {
      let payload = null;
      
      payload = await httpRequest(
        "post",
        "/pension-services/v1/_pushManualRegisterToPensionNotificationRegister",
        "",
        [],
        WFBody
      );
     
  
      toggleSnackbar(
        true,
        { labelName: "succcess ", labelKey: 'PENSION_PUSH_MANNUAL_SUCCESS' },
        "warning"
      )
     
      //dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    } catch (error) {
      
   
        toggleSnackbar(
          true,
          { labelName: "error", labelKey: error.message },
          "error"
        )
      
    }
  }
  disabiltyRegister = async(pagename)=>{
    
    const { prepareFinalObject, toggleSnackbar, dispatch , state} = this.props;
    let localizationkey = Actiongetlocalization();

    console.log(localizationkey)
    console.log("localizationkey")
    const tenantId = getQueryArg(window.location.href, "tenantId");
  const employeeID = getQueryArg(window.location.href, "employeeID");
  let isDisabilityValid = validateFields(
    "components.div.children.DisabilityApplyApplication.children.cardContent.children.DisabilityDetailsConatiner.children",
    state,
    dispatch,
    pagename
  );
  if(!isDisabilityValid)
  {
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields then submit!",
      labelKey: localizationkey.localization[0].PENSION_ERR_DISABILITY_REQUIRED_VALIDATION.key
    };
   
    toggleSnackbar(
      true,
      { labelName: errorMessage.labelName, labelKey: errorMessage.labelKey },
      "warning"
    )
  }
  else{
    let dateOfInjury = get(
      state.screenConfiguration.preparedFinalObject,
      "Employees[0].dateOfInjury",
      0
    );
    if(Number(dateOfInjury))
    {
      //alert('i am number')
      dateOfInjury = epochToYmd(dateOfInjury)
    }
    let injuryApplicationDate = get(
      state.screenConfiguration.preparedFinalObject,
      "Employees[0].injuryApplicationDate",
      0
    );
    if(Number(injuryApplicationDate))
    {
      //alert('i am number')
      injuryApplicationDate = epochToYmd(injuryApplicationDate)
    }
    

    // let dateOfInjury = get(
    //   state.screenConfiguration.screenConfig["applydisability"],
    //   "components.div.children.DisabilityApplyApplication.children.cardContent.children.DisabilityDetailsConatiner.children.dateOfInjury.props.value",
    //   0
    // );
    
    // let woundExtraordinaryPension_ = get(
    //   state.screenConfiguration.screenConfig[pagename],
    //   "components.div.children.DisabilityApplyApplication.children.cardContent.children.DisabilityDetailsConatiner.children.woundExtraordinaryPension.props.value",
    //   0
    // );
    let woundExtraordinaryPension_= get(
      state.screenConfiguration.preparedFinalObject,
      "Employees[0].woundExtraordinaryPension",
      0
    );
    
    let IsValiddateOfInjury = false
    let IsValidinjuryApplicationDate = false
    let IsValidDateDifference = false
    
    const  dateOfInjury_ = new Date(dateOfInjury)
    const  injuryApplicationDate_ = new Date(injuryApplicationDate)
    const CurrentDate = new Date();
    if(dateOfInjury_ > CurrentDate  || injuryApplicationDate_ >CurrentDate ){
      
       toggleSnackbar(
         true,
         { labelName: "Given date can not be greater than the current date", labelKey: localizationkey.localization[0].PENSION_CURRENT_DATE_VALIDATION.key },
         "warning"
       )
   }
   else{
    IsValiddateOfInjury = true
    IsValidinjuryApplicationDate = true
    
    //if( )
    if(dateOfInjury_> injuryApplicationDate_)
    {
      IsValiddateOfInjury = false
      dispatch( toggleSnackbar(
        true,
        { labelName: "Application Submmission date should be greater then or equal to  date of injury", labelKey: localizationkey.localization[0].PENSION_DISABILITY_SUBMIT_DATE_VALIDATION.key },
        "warning"
      ));
    }
    else{
      // check date differnce 
    let ydoj = dateOfInjury_.getFullYear();
    let mdoj = dateOfInjury_.getMonth();
    let ddoj = dateOfInjury_.getDay();
    let ydoa = injuryApplicationDate_.getFullYear();
    let mdoa = injuryApplicationDate_.getMonth();
    let ddoa = injuryApplicationDate_.getDay();
    let diff = ydoa - ydoj
    if(mdoj > mdoa) diff--;
    else{
      if(mdoj===mdoa)
      {
        if(ddoj > ddoa) diff--;
      }
    }
    let _wfconfig = WFConfig()    
    if(diff>=_wfconfig.DISABILITY_SUBMIT_YEAR)
    {
      IsValidDateDifference = false
  //     alert(get(
  //       state.screenConfiguration.preparedFinalObject,
  //       "Employees[0].woundExtraordinaryPension",
  //       0
  // ))
      // dispatch(
      //   pfo(
      //     "Employees[0].woundExtraordinaryPension",
      //     0
      //   )
      // );
      // set(
      //   state.screenConfiguration.screenConfig["applydisability"],
      //   "components.div.children.DisabilityApplyApplication.children.cardContent.children.DisabilityDetailsConatiner.children.woundExtraordinaryPension.props.value",
      //   0
      // );
     
    // alert(get(
    //           state.screenConfiguration.preparedFinalObject,
    //           "Employees[0].woundExtraordinaryPension",
    //           0
    //     ))
      //alert(woundExtraordinaryPension_)
      if(Number( woundExtraordinaryPension_ )=== 0)
      IsValidDateDifference = true
      else
      {
        IsValidDateDifference = false
   toggleSnackbar(
          true,
          { labelName: "Application Submmission date should be less then  5 year ", labelKey: localizationkey.localization[0].PENSION_DATE_DIFFERENCE_VALIDATION.key },
          "warning"
        )
      }
     

      //woundExtraordinaryPension_ = 0;


    }
    else{
    IsValidDateDifference = true
    }


    }
    
   }
    if(IsValiddateOfInjury && IsValidinjuryApplicationDate && IsValidDateDifference)
    {
      if (dateOfInjury)
      {
        dateOfInjury = convertDateToEpoch(dateOfInjury,"Date")
        set(
          state,
          "screenConfiguration.preparedFinalObject.Employees[0].dateOfInjury",
          dateOfInjury
        );
      }
    
      if (injuryApplicationDate)
      {
        injuryApplicationDate = convertDateToEpoch(injuryApplicationDate,"Date")
        set(
          state,
          "screenConfiguration.preparedFinalObject.Employees[0].injuryApplicationDate",
          injuryApplicationDate
        );
      }
      // call api
      
        set(
          state,
          "screenConfiguration.preparedFinalObject.Employees[0].woundExtraordinaryPension",
         Number(woundExtraordinaryPension_)

        );
      set(
        state,
        "screenConfiguration.preparedFinalObject.Employees[0].tenantId",
        tenantId
        
      );
      set(
      state,
      "screenConfiguration.preparedFinalObject.Employees[0].code",
      employeeID
      );
      let payload = get(
        state.screenConfiguration.preparedFinalObject,
        "Employees",
        []
      );
      console.log('employees');
    //   let list =[]
    // list = payload && payload.Employees.filter((item) => item.code === employeeID);
    // alert((list[0].uuid));
    // set(
    //   state,
    //   "screenConfiguration.preparedFinalObject.Employees[0].uuid",
    //   employeeID
      
    //);
      let response = await saveEmployeeDisability(
        state,
        dispatch,
      );

      if(response !== undefined)
      {  
        if(response.status !=='failure')
        { 
          // if(IsValidDateDifference)

          // dispatch(toggleSnackbar(true, 
          //   { labelName: "DISABILITY_SUCCESS", 
          //   labelKey:localizationkey.localization[0].PENSION_DISABILITY_SUCCESS.key},
          //    "success"));
             toggleSnackbar(
              true,
              { labelName: "DISABILITY_SUCCESS", labelKey: localizationkey.localization[0].PENSION_DISABILITY_SUCCESS.key },
              "success"
            )
        }
      }

    }
   
  
      
    
  }
  }
   wfActionINITIATE=async (ModuleName,pagename)=>{
    const { prepareFinalObject, toggleSnackbar, dispatch } = this.props;
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
      toggleSnackbar(
        true,
        { labelName: INITIATEWarnning.labelName, labelKey: INITIATEWarnning.labelKey },
        "warning"
      )
      
  
    }
    else{
    let WFBody = {
      ProcessInstances: [
        {
            moduleName: ModuleName,
            tenantId: tenantId,
            businessService: ModuleName,
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
     
      this.moveToSuccess("INITIATED",dispatch,pagename)
  
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
  setvalue =(state) =>{ 
    let Group = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.employeeGroup", '' );
    Group = getLocalizationCodeValue(`EGOV_PENSION_EMPLOYEEGROUP_${Group}`);
    let reasonForRetirement = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.reasonForRetirement", '' );
    let businessService = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].businessService", '' )   
    let TakenMonthlyPensionAndGratuity =  "NA";
    let TakenGratuityCommutationTerminalBenefit = "NA";
    let TakenCompensationPensionAndGratuity = "NA";
    let bankAddress =get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.bankAddress", 0 );
    let Obj  = get(state, `screenConfiguration.preparedFinalObject.applyScreenMdmsData.pension.BankDetails`,[]) 
    let Name = bankAddress
    Obj = Obj.filter(x=>x.code === bankAddress)
    if(Obj &&Obj[0])
    Name = Obj[0].name
     bankAddress = Name;
    let accountNumber =get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.accountNumber", 0 );
    if(reasonForRetirement === "ABOLITION_OF_POST")
    {
      TakenMonthlyPensionAndGratuity=get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isTakenMonthlyPensionAndGratuity", false)=== true? "YES" : "NO";
      TakenGratuityCommutationTerminalBenefit=get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isTakenGratuityCommutationTerminalBenefit", false)=== true? "YES" : "NO";
      TakenCompensationPensionAndGratuity=get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isTakenCompensationPensionAndGratuity", false)=== true? "YES" : "NO";
    }
    if(businessService === WFConfig().businessServiceRRP)
    reasonForRetirement = getLocalizationCodeValue(`EGOV_PENSION_REASONFORRETIREMENT_${reasonForRetirement}`)
    let serviceTo = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.serviceHistory[0].serviceTo", 0 )
    if(serviceTo !== null)
    serviceTo = convertEpochToDate(serviceTo,'dob')
    if(businessService === WFConfig().businessServiceDOE || businessService === WFConfig().businessServiceDOP)
    {
      let dependents =
      get(state.screenConfiguration.preparedFinalObject, "ProcessInstances[0].dependents",[]) 
      for (let index = 0; index < dependents.length; index++) {
        if(dependents[index].isEligibleForPension && dependents[index].isEligibleForGratuity)
        {         
          bankAddress= dependents[index].bankDetails;
          let Obj  = get(state, `screenConfiguration.preparedFinalObject.applyScreenMdmsData.pension.BankDetails`,[]) 
          let Name = bankAddress
          Obj = Obj.filter(x=>x.code === bankAddress)
          if(Obj &&Obj[0])
          Name = Obj[0].name
           bankAddress = Name;
          accountNumber= dependents[index].bankAccountNumber;
        }
      }
    }
    // else
    // {
    //   TakenMonthlyPensionAndGratuity="NA"
    //   TakenGratuityCommutationTerminalBenefit="NA"
    //   TakenCompensationPensionAndGratuity="NA"

    // }
    let ApplicationDetails = {
  // basic details
      businessId: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].businessId", '' ),
      dob:  convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.dob", 0 ),'dob'),
      dateOfRetirement:convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.dateOfRetirement",  0 ),'dob'),
      employee_name:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.name", '' ),
      department:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.assignments[0].department", '' ),
      designation:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.assignments[0].designation", '' ),
      dateOfDeath :convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.dateOfDeath",  0 ),'dob'),
      employee_type:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.employeeType", '' ),
      employee_status:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.employeeStatus", '' ),    
      permanentAddress:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.permanentAddress", '' ),
      permanentCity:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.permanentCity", '' ),
      permanentPinCode:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.user.permanentPinCode", '' ),
      serviceStatus:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.serviceHistory[0].serviceStatus", '' ),
      serviceFrom:convertEpochToDate(get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employee.serviceHistory[0].serviceFrom", 0 ),'dob'),
      serviceTo:serviceTo,
      // other details
  
      reasonForRetirement:reasonForRetirement,
      employeeGroup:Group,
      lpd:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.lpd", 0 ),
      ltc:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.ltc", 0 ),
      fma:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.fma", 0 ),
      miscellaneous:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.miscellaneous", 0 ),
      incomeTax:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.incomeTax", 0 ),
      cess:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.cess", 0 ),
      overPayment:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.overPayment", 0),
      isDuesPresent:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDuesPresent", false ) === true? "YES" : "NO",
      isDuesAmountDecided:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided", false)=== true? "YES" : "NO",
      dues:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.dues", 0),
      totalNoPayLeavesDays: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesDays", 0 ),
      totalNoPayLeavesMonths: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesMonths", 0 ),
      totalNoPayLeavesYears: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesYears", 0 ),
      accountNumber:accountNumber,
      bankAddress:bankAddress,
      isEligibleForPension:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isEligibleForPension", false )=== true? "YES" : "NO",
      isCommutationOpted:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isCommutationOpted", false )=== true? "YES" : "NO",
      isCompassionatePensionGranted:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isCompassionatePensionGranted", false )=== true? "YES" : "NO",
      isTakenMonthlyPensionAndGratuity:TakenMonthlyPensionAndGratuity,
      isTakenGratuityCommutationTerminalBenefit: TakenGratuityCommutationTerminalBenefit,
      isTakenCompensationPensionAndGratuity:TakenCompensationPensionAndGratuity,
      isAnyJudicialProceedingIsContinuing:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isAnyJudicialProceedingIsContinuing", false )=== true? "YES" : "NO",  
      isAnyMisconductInsolvencyInefficiency:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isAnyMisconductInsolvencyInefficiency", false )=== true? "YES" : "NO",
      isConvictedSeriousCrimeOrGraveMisconduct:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isConvictedSeriousCrimeOrGraveMisconduct", false)=== true? "YES" : "NO" ,
      isDiesOrInjuredInExtremistsDacoitsSmugglerAntisocialAttack: get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.diesInExtremistsDacoitsSmugglerAntisocialAttack", false) === true? "YES" : "NO",
      isDaMedicalAdmissible:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isDaMedicalAdmissible", false) === true? "YES" : "NO",
      isEmployeeDiesInTerroristAttack:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isEmployeeDiesInTerroristAttack", false) === true? "YES" : "NO",
      isEmployeeDiesInAccidentalDeath:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.isEmployeeDiesInAccidentalDeath", false) === true? "YES" : "NO",
      noDuesForAvailGovtAccomodation:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeOtherDetails.noDuesForAvailGovtAccomodation", false) === true? "YES" : "NO",
      // disability info
      disabilityPercentage:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeDisability.disabilityPercentage", 0 ),
      woundExtraordinaryPension:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeDisability.woundExtraordinaryPension", 0 ),
      attendantAllowanceGranted:get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].employeeDisability.attendantAllowanceGranted", false ) === true? "YES" : "NO",
      
    }
  
  
    return ApplicationDetails
  }
   moveToSuccess = async(Action, dispatch,pagename) => {
  
    const applicationNo = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const purpose = Action;
    const status = "success";
    if(pagename === "doeDetails")
    {
      dispatch(
        setRoute(
          `/pms/acknowledgementdoe?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
        )
      );
    }
    else if(pagename === "dopDetails")
    {
      dispatch(
        setRoute(
          `/pms/acknowledgementdop?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
        )
      );
    }
    else{
      dispatch(
        setRoute(
          `/pms/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
        )
      );

    }
    
  };
  wfAction =async(Action,pagename, Accesslable)=>{
   
    const { prepareFinalObject, toggleSnackbar, state,dispatch } = this.props;
    let businessService = get(state.screenConfiguration.preparedFinalObject,"ProcessInstances[0].businessService", '' )
    console.log(Accesslable)
    let isOtherCardValid = validateFields(
      "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children.otherdetails.children",
      state,
      dispatch,
      pagename
    );

    if(isOtherCardValid)
    {
      // check declaration for DDO and Acount Officer for application  and letter download
  const fields = get(
    state.screenConfiguration.screenConfig[pagename],
    "components.div.children.formwizardThirdStep.children.otherDetails.children.cardContent.children",
    {}
  ); 
  let declarationvalid= true;
  if(Accesslable[0].employeeOtherDetailsUpdate === false || Accesslable[5].Isletter === true)
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

    //get set due option in boolean
    let isDuesPresent =
    get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent") 
    let isDuesAmountDecided =
    get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided") 
    isDuesAmountDecided = isDuesAmountDecided==="YES"?true:false
    isDuesPresent = isDuesPresent==="YES"?true:false
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

  let familyPensionIStartDateVerified =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionCalculationUpdateDetails.familyPensionIStartDateVerified",0) 
  familyPensionIStartDateVerified = convertDateToEpoch(familyPensionIStartDateVerified);
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionCalculationUpdateDetails.familyPensionIStartDateVerified", familyPensionIStartDateVerified);
  let familyPensionIEndDateVerified =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionCalculationUpdateDetails.familyPensionIEndDateVerified",0) 
  familyPensionIEndDateVerified = convertDateToEpoch(familyPensionIEndDateVerified);
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionCalculationUpdateDetails.familyPensionIEndDateVerified", familyPensionIEndDateVerified);  
  let familyPensionIIStartDateVerified =
  get(state, "screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionCalculationUpdateDetails.familyPensionIIStartDateVerified",0) 
  familyPensionIIStartDateVerified = convertDateToEpoch(familyPensionIIStartDateVerified);
  set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].pensionCalculationUpdateDetails.familyPensionIIStartDateVerified", familyPensionIIStartDateVerified);

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

    try {

      let payload = get(
        state.screenConfiguration.preparedFinalObject,
        "ProcessInstances",
        []
      );
     
     
          // for application pdf
      if(fields.isDDODeclaration.visible===true)
      {
        let config = ApplicationConfiguration();
        if(!Accesslable[0].employeeOtherDetailsUpdate)
        {
          //set value from local jason set by the system in given json formate start
        let ApplicationDetails_ = this.setvalue(state)
      
        console.log(ApplicationDetails_)
        switch(pagename){
          case "rrpDetails":
            downloadAcknowledgementForm(ApplicationDetails_,config.RRP_APPLICATION,config.RRP_APPLICATION_config); 
            break;
            case "doeDetails":
            downloadAcknowledgementForm(ApplicationDetails_,config.DOE_APPLICATION,config.DOE_APPLICATION_config); 
            break;
            case "dopDetails":
            downloadAcknowledgementForm(ApplicationDetails_,config.DOP_APPLICATION,config.DOP_APPLICATION_config); 
            break;

        }
          
        }
      }
      // set(payload[0], "action", Action);
     
      // let response = await httpRequest(
      //   "post",
      //   "/pension-services/v1/_processWorkflow",
      //   "",
      //   [],
      //   { ProcessInstances: payload }
      // );
      
     // console.log(state)

     let step = getQueryArg(window.location.href, "step");
    if(step === `WF_${businessService}_${WFConfig().PENDING_FOR_CALCULATION}` && Action === ActionButton().BACKWORD)
    {
      let CALCULATIONsendBackWarnning = {   
        labelName: "Calculated data will revert back!",
        labelKey: "PENSION_WF_PENDING_FOR_CALCULATION_WARNING"
      };
      // toggleSnackbar(
      //   true,
      //   { labelName: CALCULATIONsendBackWarnning.labelName, labelKey: CALCULATIONsendBackWarnning.labelKey },
      //   "error"
      // )
    }
    
      let response = await createUpdateNPApplication(
        state,
        dispatch,
        Action
      );
      if(response !== undefined)
      {  
        if(response.status !=='failure')
        { 
          this.moveToSuccess(Action, dispatch,pagename);
        }
      }
      
    }
     catch (error) {
       console.log(error)
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: error.message
        },
        "error"
      );
    }
  }
  else{
    let errorMessage = {   
      labelName: "Declaration checkbox must be checked before proceeding",
      labelKey: "PENSION_WORKFLOW_DECLARATION_MSG"
    };
    toggleSnackbar(true, errorMessage, "warning")

  }
  }
  else{
    let errorMessage = {   
      labelName: "Please fill all mandatory fields for Other  Details, then do next !",
      labelKey: "PENSION_ERR_FILL_OTHER_REQUIRED_DOCUMENTS"
    };
    toggleSnackbar(true, errorMessage, "warning")

  }
  }

  wfSwitchAction = async (Action,moduleName, pagename,Accesslable) => {  
    const { prepareFinalObject, toggleSnackbar, state } = this.props;
   
    switch(moduleName)
    {
        case "INITIATE_RRP":
        this.RRP_INITIATE(moduleName)
        break;
        case "INITIATE_DOE":
          this.DOE_INITIATE(moduleName)
        break;
        case "INITIATE_DOP":
        this.DOE_INITIATE(moduleName)
        break;
        case "INITIATE_MANNUAL":
        this.PushToMannualRegister()
        break;
        case "DISABILITY_REGISTRATION":
        this.disabiltyRegister(pagename)
        break;
        case "INITIATE_RRP_CLOSE":
        this.wfActionINITIATE(WFConfig().businessServiceRRP,pagename)
        break;case "INITIATE_DOE_CLOSE":
        this.wfActionINITIATE(WFConfig().businessServiceDOE,pagename)
        break;case "INITIATE_DOP_CLOSE":
        this.wfActionINITIATE(WFConfig().businessServiceDOP,pagename)
        break;
        case"WF_CLAIM":
        this.ClaimRelease(Action)
        break
        default:
        this.wfAction(Action,pagename,Accesslable)
        break;
       
    }
   
    
   
  };
    // render() {
    //   const {  dataPath} = this.props;
    //   const downloadMenu = dataPath.map((obj, index) => {
    //     return {
    //       labelName: obj.action,
    //       labelKey: `ACTION_TEST_${obj.action.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,
    //      // link: () => setRoute(obj.navigationURL)
    //     }
    //   })
    //   const buttonItems = {
    //     label: { labelName: "workflow Action", labelKey: "PENSION_WF_ACTION" },
    //     rightIcon: "arrow_drop_down",
    //     props: { variant: "outlined", style: { marginLeft: 5, marginRight: 15, backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "60px", width: "200px" } },
    //     menu: downloadMenu
    //   }
    //   alert('2')
    //   console.log(this.props)
    //   return <MenuButton data={buttonItems} />;
    // }

    render() {
        const {  ProcessInstances,
          state,
          ActionItem,
          Accesslable,
          Visible,
          pageName,
          moduleName } = this.props;
           const stepsData = [
            { action: "PENSION_SEQUENCE_EMPLOYEE_DETAILS", navigationURL: "pms/home" }, ];
            
            const downloadMenu = ActionItem.map((obj, index) => {
        return {
          labelName: obj.action,
          labelKey: `PENSION_${obj.action.toUpperCase().replace(/[._:-\s\/]/g, "_")}`,         
          link: () =>  this.wfSwitchAction(obj.action,moduleName,pageName,Accesslable)
        }
      })
     
      const buttonItems = {
        label: { labelName: "Action", labelKey: "PENSION_TAKE_ACTION" },
        rightIcon: "arrow_drop_down",
        props: { variant: "outlined", visible:false,
        style: { marginLeft: 10, marginRight: 15, 
          backgroundColor: "#FE7A51", color: "#fff", border: "none", height: "48px", width: "220px" } },
        menu: downloadMenu
      }

      // return (
      //   <div className="quick-action-button" state={{display:"flex"}}>
      //     {(
      //       <MenuButton data={buttonItems} />
      //     )
      //     }
          
      //   </div>
      // );
       
// return
// (
//       <div style={{flex:"auto"}}>
//         {
//           <MenuButton data={buttonItems} />
//         }
            
//           </div>
//)
// return <MenuButton data={buttonItems} style={{flex:"auto"}}/>;
        return  Visible&&( <div className="quick-action-button" style={{flex:"auto",display:"flex", placeContent:"flex-end"}}>
           <MenuButton data={buttonItems}/>
           
           </div>);
      }
  }


  const mapStateToProps = state => {
    const { auth, app } = state;
    const { menu } = app;
    const { userInfo } = auth;
    const name = auth && userInfo.name;
    let ActionItem = get(
      state,
      "screenConfiguration.preparedFinalObject.ProcessInstances[0].state.actions",
      []
    );
    return { name, menu,state,ActionItem };
  };


  const mapDispacthToProps = dispatch => {
    return {
     // setRoute: (url) => dispatch(setRoute(url)),
      prepareFinalObject: (path, value) =>
        dispatch(prepareFinalObject(path, value)),
      toggleSnackbar: (open, message, variant) =>
        dispatch(toggleSnackbar(open, message, variant)),dispatch
    };
  };
  export default connect(
    mapStateToProps,
    mapDispacthToProps
    
  )(DropdownButton);