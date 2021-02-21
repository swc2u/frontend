import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getDateField,
  getLabel,
  getPattern,
  getSelectField,
  getTextField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import filter from "lodash/filter";
import { getPMSPattern ,saveEmployeeDisability} from "../../../../../ui-utils/commons";
import { prepareFinalObject as pfo, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {  
  
  WFConfig  
  } from "../../../../../ui-utils/sampleResponses";
  import {  
    Actiongetlocalization,
    
    } from "../../../../../ui-utils/LocalizationCode";
import { validateFields,convertDateToEpoch , convertEpochToDate,epochToYmd} from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
let localizationkey = Actiongetlocalization();
const ActionSubmit = async (state, dispatch) => {
  
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

          dispatch(toggleSnackbar(true, { labelName: "DISABILITY_SUCCESS", labelKey:localizationkey.localization[0].PENSION_DISABILITY_SUCCESS.key}, "success"));
          // else
          // dispatch(toggleSnackbar(true, { labelName: "DISABILITY_SUCCESS", labelKey:localizationkey.localization[0].PENSION_DATE_DIFFERENCE_VALIDATION.key}, "warning"));
        }
      }

    }
   
  
      
    
  }

}

export const DisabilityApplyApplication = getCommonCard({
  
 
  DisabilityDetailsConatiner: getCommonContainer({

    severityOfDisability: {
      ...getSelectField({
        label: {
          labelName: "Select severityOfDisability",
          //labelKey: "PENSION_EMPLOYEE_DISABILITY_SEVERITY"
          labelKey:localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_SEVERITY.key
        },
        placeholder: {
          labelName: "Select severityOfDisability",
          labelKey:localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_SEVERITY.key
        },
        required: true,
        props: {
          disabled: false,      
        },
        jsonPath: "Employees[0].severityOfDisability",
        localePrefix: {
          moduleName: "PENSION",
         masterName: "SEVERITY"
        },
        props: {
          className:"applicant-details-error",
          
        },
       
        sourceJsonPath:
       "applyScreenMdmsData.pension.Disability",
        //"applyScreenMdmsData.tenant",
       
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let disability = get(
          state.screenConfiguration.preparedFinalObject,
          `applyScreenMdmsData.pension.Disability`,
          []
        );
        let currentObject = filter(disability, {
          code: action.value
        });
        dispatch(
          pfo(
            "Employees[0].disabilityPercentage",
            currentObject[0].value
          )
        );
        // dispatch(
        //   handleField(
        //     "applydisability",
        //     "Employees[0].disabilityPercentage",
        //     "props.value",
        //     currentObject[0].value
        //   )
        // );
      }

      
    },

    disabilityPercentage: getTextField({
      label: {
        labelName: "disabilityPercentage",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_PERCENTAGE.key
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "disabilityPercentage",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_PERCENTAGE.key
      },
      required: false,
       minValue:0,
      maxLength:3,
      props: {
        disabled: true,      
      },
      pattern: getPMSPattern("Percentage"),
    jsonPath: "Employees[0].disabilityPercentage",
    }),

    dateOfInjury: getDateField({
      label: {
        labelName: "dateOfInjury",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_DOI.key
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "dateOfInjury",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_DOI.key
      },
      required: true,
       minValue:0,
     
      props: {
        disabled: false,      
      },
      pattern: getPMSPattern("Date"),
      jsonPath: "Employees[0].dateOfInjury",
    }),

    injuryApplicationDate: getDateField({
      label: {
        labelName: "injuryApplicationDate",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_IAD.key
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "injuryApplicationDate",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_IAD.key
      },
      required: true,
       minValue:0,
     
      props: {
        disabled: false,      
      },
      pattern: getPMSPattern("Date"),
      jsonPath: "Employees[0].injuryApplicationDate",
    }),

    woundExtraordinaryPension: getTextField({
      label: {
        labelName: "woundExtraordinaryPension",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_WEP.key
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "woundExtraordinaryPension",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_WEP.key
      },
      required: true,
       minValue:0,
      maxLength:18,
      props: {
        disabled: false,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "Employees[0].woundExtraordinaryPension",
    }),
    comments: getTextField({
      label: {
        labelName: "comments",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_PENSION_COMMENT.key
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "comments",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_PENSION_COMMENT.key
      },
      required: true,      
      props: {
        disabled: false,      
      },
      pattern: getPMSPattern("Address"),
      jsonPath: "Employees[0].comments",
    }),
 
    
  }),
  attendantAllowanceGranted: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-pms",
    componentPath: "CheckboxContainer",
    gridDefination: {
      xs: 6
    },
    isFieldValid: true,
    required:false,
    props: {
      //content: "isDaMedicalAdmissible",
      content: localizationkey.localization[0].PENSION_EMPLOYEE_DISABILITY_ATTENDENT_ALLOWANCE_GRANTED.key,
      jsonPath: "Employees[0].attendantAllowanceGranted",
     //disabled: data[0].employeeOtherDetailsUpdate,
    }

  },

  // button: getCommonContainer({
  //   buttonContainer: getCommonContainer({
     
  //     searchButton: {
  //       componentPath: "Button",
  //       gridDefination: {
  //         xs: 12,
  //         sm: 6
  //         // align: "center"
  //       },
  //       props: {
  //         variant: "contained",
  //         color: "primary",
  //         style: {
  //           //minWidth: "200px",
  //           height: "48px",
  //           marginRight: "45px"
  //         }
  //       },
  //       children: {
  //         buttonLabel: getLabel({
  //           labelName: "searchppr",
  //           labelKey: localizationkey.localization[0].PENSION_BUTTON_SUBMIT.key
  //         })
  //       },
  //       onClickDefination: {
  //         action: "condition",
  //         callBack: ActionSubmit
  //       }
  //     }
  //   })
  // })
});
