import {
  
  getCommonContainer,  
  getLabel,
  
} from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getCommonApplyFooter } from "../../utils";
  import {  
  
    WFConfig  
    } from "../../../../../ui-utils/sampleResponses";
    import {  
      Actiongetlocalization,
      
      } from "../../../../../ui-utils/LocalizationCode";
  import { validateFields,convertDateToEpoch , convertEpochToDate,epochToYmd} from "../../utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import get from "lodash/get";
  import set from "lodash/set";
  import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { saveEmployeeDisability} from "../../../../../ui-utils/commons";
  let localizationkey = Actiongetlocalization();
  const ActionSubmit = async (state, dispatch) => {
    let Applicationstate = get(state.screenConfiguration.preparedFinalObject,"Applicationstate", [] ) 
    if(Applicationstate.length ===0)
    {

   
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const employeeID = getQueryArg(window.location.href, "employeeID");
    let isDisabilityValid = validateFields(
      "components.div.children.DisabilityApplyApplication.children.cardContent.children.DisabilityDetailsConatiner.children",
      state,
      dispatch,
      "applydisability"
    );
    if(!isDisabilityValid)
    {
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields then submit!",
        labelKey: localizationkey.localization[0].PENSION_ERR_DISABILITY_REQUIRED_VALIDATION.key
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
  
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
      
      let woundExtraordinaryPension_ = get(
        state.screenConfiguration.screenConfig["applydisability"],
        "components.div.children.DisabilityApplyApplication.children.cardContent.children.DisabilityDetailsConatiner.children.woundExtraordinaryPension.props.value",
        0
      );
      let IsValiddateOfInjury = false
      let IsValidinjuryApplicationDate = false
      let IsValidDateDifference = false
      
      const  dateOfInjury_ = new Date(dateOfInjury)
      const  injuryApplicationDate_ = new Date(injuryApplicationDate)
      const CurrentDate = new Date();
      if(dateOfInjury_ > CurrentDate  || injuryApplicationDate_ >CurrentDate ){
        
         dispatch( toggleSnackbar(
           true,
           { labelName: "Given date can not be greater than the current date", labelKey: localizationkey.localization[0].PENSION_CURRENT_DATE_VALIDATION.key },
           "warning"
         ));
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
       
      
        if(Number( woundExtraordinaryPension_ )=== 0)
        IsValidDateDifference = true
        else
        {
          IsValidDateDifference = false
          dispatch( toggleSnackbar(
            true,
            { labelName: "Application Submmission date should be less then  5 year ", labelKey: localizationkey.localization[0].PENSION_DATE_DIFFERENCE_VALIDATION.key },
            "warning"
          ));
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
        
        let response = await saveEmployeeDisability(
          state,
          dispatch,
        );
  
        if(response !== undefined)
        {  
          if(response.status !=='failure')
          { 
            // if(IsValidDateDifference)
  
            dispatch(toggleSnackbar(true, { labelName: "DISABILITY_SUCCESS", labelKey:localizationkey.localization[0].PENSION_DISABILITY_SUCCESS.key}, "success"));
            // else
            // dispatch(toggleSnackbar(true, { labelName: "DISABILITY_SUCCESS", labelKey:localizationkey.localization[0].PENSION_DATE_DIFFERENCE_VALIDATION.key}, "warning"));
          }
        }
  
      }
     
    
        
      
    }
  }
  else{
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields then submit!",
      labelKey: localizationkey.localization[0].PENSION_ERR_DISABILITY_WORKFLOW_INPROGRESS_VALIDATION.key
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  
  }
  export const footer = () => {

    return getCommonApplyFooter({
   // export const footer = getCommonApplyFooter({
      //  ActionButton:{
      //   uiFramework: "custom-containers-local",
      //   moduleName: "egov-pms",
      //   componentPath: "DropdownButton",
      //   props: {
      //       dataPath: "ProcessInstances",
      //       moduleName: "DISABILITY_REGISTRATION",
      //       pageName:"applydisability",
      //       Visible:true,
      //       Accesslable:[]
      //     }

      //  },
      searchButton: {
        componentPath: "Button",
        
        props: {
          variant: "contained",
          color: "primary",
          style: {
            //minWidth: "200px",
            height: "48px",
            marginRight: "45px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "searchppr",
            labelKey: localizationkey.localization[0].PENSION_BUTTON_SUBMIT.key
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: ActionSubmit
        }
      }
   
   
  });
  }
  