import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,  
  getSelectField,
  getCheckBoxwithLabel,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getPMSPattern } from "../../../../../ui-utils/commons";
import { getMapLocator } from "../../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { showHideMapPopup, getDetailsFromProperty } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
export const employeeOtherDetails = (data) => {
  
return getCommonCard({
//export const employeeOtherDetails = getCommonCard(
  
    header: getCommonTitle(
      {
        labelName: "Employee Oyher Details",
        labelKey: "PENSION_EMPLOYEE_OTHER_DETAILS_HEAFER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    
    employeeOtherDetailsConatiner: getCommonContainer({ 

      isDuesPresent: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 6
        },
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isDuesPresent",
        type: "array",
        props: {
          required: false,
          disabled: data[0].employeeOtherDetailsUpdate,
          label: { name: "Is dues present", key: "PENSION_IS_DUES_PRESENT" },
          buttons: [
            {
              labelName: "Yes",
              labelKey: "PENSION_IS_DUES_PRESENT_YES",
              value:"YES",
              disabled: data[0].employeeOtherDetailsUpdate,
            },
            {
              label: "NO",
              labelKey: "PENSION_IS_DUES_PRESENT_NO",
              value:"NO",
              disabled: data[0].employeeOtherDetailsUpdate,
            }
          ],
        
          defaultValue: "NO"
        },
        type: "array",
        beforeFieldChange: (action, state, dispatch) => {
          if (action.value === "NO") {

            set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent", true);
            set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.dues", 0);
           
            dispatch(
              handleField(
                "doeDetails",
                "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.DuesAmountDecided",
                "props.style",
                { display: "none" }
              )
            );  
            dispatch(
              handleField(
                "doeDetails",
                "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.dues",
                "props.style",
                { display: "none" }
              )
            ); 
                     
          } 
          else {
            set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesPresent", false);
            dispatch(
              handleField(
                "doeDetails",
                "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.DuesAmountDecided",
                "props.style",
                { display: "inline-block" }
              )
            );
           
          }
        }
      },

    DuesAmountDecided:getCommonContainer(
      {
        isDuesAmountDecided: {
          uiFramework: "custom-containers",
          componentPath: "RadioGroupContainer",
          gridDefination: {
            xs: 6
          },
          jsonPath: "ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided",
          type: "array",
          props: {
            required: false,
            disabled: data[0].employeeOtherDetailsUpdate,
            
            label: { name: "Is dues amount decided", key: "PENSION_IS_DUES_AMOUNT_DECIDED" },
            buttons: [
              {
                labelName: "Yes",
                labelKey: "PENSION_IS_DUES_AMOUNT_DECIDED_YES",
                value:"YES",
                disabled: data[0].employeeOtherDetailsUpdate,

              },
              {
                label: "Np",
                labelKey: "PENSION_IS_DUES_AMOUNT_DECIDED_NO",
                value:"NO",
                disabled: data[0].employeeOtherDetailsUpdate,
              }
            ],
          
            defaultValue: "NO"
          },
          type: "array",
          beforeFieldChange: (action, state, dispatch) => {
            if (action.value === "YES") {
              set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided", true);
              dispatch(
                handleField(
                  "doeDetails",
                  "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.dues",
                  "props.style",
                  { display: "inline-block" }
                )
              );  
                     
            } 
            else {
              set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.isDuesAmountDecided", false);
              dispatch(
                handleField(
                  "doeDetails",
                  "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children.dues",
                  "props.style",
                  { display: "none" }
                )
              ); 
              set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0].employeeOtherDetails.dues", 0); 
             
            }
          }
        },
      }
    ),
    dues: getTextField({
      label: {
        labelName: "Dues Amount",
        labelKey: "PENSION_EMPLOYEE_PENSION_DUES_AMOUNT"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Dues Amount",
        labelKey: "PENSION_EMPLOYEE_PENSION_DUES_AMOUNT"
      },
      required: false,
      minValue:0,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.dues"
    }),
    employeeGroup: {
      ...getSelectField({
        label: {
          labelName: "Select employee Group",
          labelKey: "PENSION_EMPLOYEE_EMPLOYEE_GROUP"
        },
        placeholder: {
          labelName: "Select employee Group",
          labelKey: "PENSION_EMPLOYEE_EMPLOYEE_GROUP"
        },
        required: true,
       
        jsonPath: "ProcessInstances[0].employeeOtherDetails.employeeGroup",
        localePrefix: {
          moduleName: "egov-PENSION",
         masterName: "employeeGroup"
        },
        props: {
          className:"applicant-details-error",
          disabled: data[0].employeeOtherDetailsUpdate,
        },
       
        sourceJsonPath:
       "applyScreenMdmsData.pension.employeeGroup",
        //"applyScreenMdmsData.tenant",
       
      }),
     
      
    },
    totalNoPayLeavesYears: getTextField({
      label: {
        labelName: "leaveCount YEAR ",
        labelKey: "PENSION_EMPLOYEE_LEAVECOUNT_YEAR"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "leaveCount Year",
        labelKey: "PENSION_EMPLOYEE_LEAVECOUNT_YEAR"
      },
      required: false,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesYears"
    }), 
    totalNoPayLeavesMonths: getTextField({
      label: {
        labelName: "leaveCount MONTH",
        labelKey: "PENSION_EMPLOYEE_LEAVECOUNT_MONTH"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "leaveCount",
        labelKey: "PENSION_EMPLOYEE_LEAVECOUNT_MONTH"
      },
      required: false,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesMonths"
    }), 
    totalNoPayLeaves: getTextField({
      label: {
        labelName: "leaveCount",
        labelKey: "PENSION_EMPLOYEE_LEAVECOUNT"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "leaveCount",
        labelKey: "PENSION_EMPLOYEE_LEAVECOUNT"
      },
      required: false,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.totalNoPayLeavesDays"
    }), 
    lpd: getTextField({
      label: {
        labelName: "LPD",
        labelKey: "PENSION_EMPLOYEE_PENSION_LPD"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "LPD",
        labelKey: "PENSION_EMPLOYEE_PENSION_LPD"
      },
      required: true,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.lpd"
    }), 
    isEligibleForPension: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      visible:true,
      props: {
        //content: "Commutation Opted",
        content: "PENSION_EMPLOYEE_ELIGBLEFOR_PENSION_OPTED",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isEligibleForPension",
       disabled: data[0].employeeOtherDetailsUpdate,
       visible:false
      }
  
    }, 
    fma: getTextField({
      label: {
        labelName: "FMA",
        labelKey: "PENSION_EMPLOYEE_PENSION_FMA"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "FMA",
        labelKey: "PENSION_EMPLOYEE_PENSION_FMA"
      },
      required: false,
      visible: true,
      minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.fma"
    }),
    isEmployeeDiesInTerroristAttack: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      props: {
        //content: "Employee Dies in Terrorist Attack",
        content: "PENSION_EMPLOYEE_DIES_TERRORIST_ATTACK",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isEmployeeDiesInTerroristAttack",
       disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    miscellaneous: getTextField({
      label: {
        labelName: "Miscellaneous",
        labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLANEOUS"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Miscellaneous",
        labelKey: "PENSION_EMPLOYEE_PENSION_MISCELLANEOUS"
      },
      required: false,
      minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.miscellaneous"
    }),
    isEmployeeDiesInAccidentalDeath: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      props: {
        //content: "Employee Dies in Accidental Death",
        content: "PENSION_EMPLOYEE_DIES_ACCIDENTAL_DEATH",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isEmployeeDiesInAccidentalDeath",
       disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    incomeTax: getTextField({
      label: {
        labelName: "Income Tax",
        labelKey: "PENSION_EMPLOYEE_PENSION_INCOME_TAX"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Income Tax",
        labelKey: "PENSION_EMPLOYEE_PENSION_INCOME_TAX"
      },
      required: false,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.incomeTax"
    }),
    noDuesForAvailGovtAccomodation: {
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
        content: "PENSION_EMPLOYEE_DUES_GOVT_ACCOMODATION",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.noDuesForAvailGovtAccomodation",
       disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    cess: getTextField({
      label: {
        labelName: "Cess",
        labelKey: "PENSION_EMPLOYEE_PENSION_CESS"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Cess",
        labelKey: "PENSION_EMPLOYEE_PENSION_CESS"
      },
      required: false,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.cess"
    }),
    diesInExtremistsDacoitsSmugglerAntisocialAttack: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      visible:true,
      props: {
        //content: "any Misconduct, Insolvency or Inefficiency",
        content: "PENSION_EMPLOYEE_EXTRMISTS_DIES_SMUGLER",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.diesInExtremistsDacoitsSmugglerAntisocialAttack",
       disabled: data[0].employeeOtherDetailsUpdate,
       
      }
  
    },
    overPayment: getTextField({
      label: {
        labelName: "Over Payment",
        labelKey: "PENSION_EMPLOYEE_PENSION_OVERPAYMENT"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Over Payment",
        labelKey: "PENSION_EMPLOYEE_PENSION_OVERPAYMENT"
      },
      required: false,
       minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.overPayment"
    }),
    ltc: getTextField({
        label: {
          labelName: "LTC",
          labelKey: "PENSION_EMPLOYEE_PENSION_LTC"
        },
        props:{
          className:"applicant-details-error"
        }, 
        placeholder: {
          labelName: "LTC",
          labelKey: "PENSION_EMPLOYEE_PENSION_LTC"
        },
        required: false,
        visible: false,
         minValue:0,
        maxLength:18,
        props: {
          disabled: data[0].employeeOtherDetailsUpdate,      
        },
        pattern: getPMSPattern("Amount"),
        jsonPath: "ProcessInstances[0].employeeOtherDetails.ltc"
    }),

    bankAddress: getTextField({
      label: {
        labelName: "Bank address",
        labelKey: "PENSION_EMPLOYEE_PENSION_BA"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Bank address",
        labelKey: "PENSION_EMPLOYEE_PENSION_BA"
      },
      required:false,
      visible:false,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Address"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.bankAddress"
    }),
    accountNumber: getTextField({
      label: {
        labelName: "A/C No.",
        labelKey: "PENSION_EMPLOYEE_PENSION_AN"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "A/C No.",
        labelKey: "PENSION_EMPLOYEE_PENSION_AN"
      },
      required: false,
      visible:false,
      minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.accountNumber"
    }),
    wef: getDateField({
      label: {
        labelName: "wef",
        labelKey: "PENSION_EMPLOYEE_PENSION_WEF"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "wef",
        labelKey: "PENSION_EMPLOYEE_PENSION_WEF"
      },
      required: false,
      visible: true,
      minValue:0,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPattern("Date"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.wef"
    }),
    // hide input
    pensionArrear: getTextField({
      label: {
        labelName: "Pension Arrear",
        labelKey: "PENSION_EMPLOYEE_PENSION_ARREAR"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Pension Arrear",
        labelKey: "PENSION_EMPLOYEE_PENSION_ARREAR"
      },
      required: false,
      visible: false,
        minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.pensionArrear"
    }),
    medicalRelief: getTextField({
      label: {
        labelName: "Medical Relief",
        labelKey: "PENSION_EMPLOYEE_PENSION_MR"
      },
      props:{
        className:"applicant-details-error"
      }, 
      placeholder: {
        labelName: "Medical Relief",
        labelKey: "PENSION_EMPLOYEE_PENSION_MR"
      },
      required: false,
      visible: false,
      minValue:0,
      maxLength:18,
      props: {
        disabled: data[0].employeeOtherDetailsUpdate,      
      },
      pattern: getPMSPattern("Amount"),
      jsonPath: "ProcessInstances[0].employeeOtherDetails.fma"
    }),      
    isCommutationOpted: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      visible:false,
      props: {
        //content: "Commutation Opted",
        content: "PENSION_EMPLOYEE_COMMUNICATION_OPTED",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isCommutationOpted",
        disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    dateOfContingent: {
      ...getDateField({
        label: {
          labelName: "Date of Contingent",
          labelKey: "PENSION_EMPLOYEE_PENSION_DOC"
        },
        placeholder: {
          labelName: "Trade License From Date",
          labelName: "PENSION_EMPLOYEE_PENSION_DOC"
        },
        required: false,
        props: {
          disabled: data[0].employeeOtherDetailsUpdate,      
        },
        pattern: getPattern("Date"),
        jsonPath: "ProcessInstances[0].employeeOtherDetails.dateOfContingent",
        props: {
          className:"applicant-details-error",
          
        }
      }),
      visible: false
    },      
    isConvictedSeriousCrimeOrGraveMisconduct: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
      xs: 6
    },
      isFieldValid: true,
      required:false,
      visible:false,
      props: { 
                
        content: "PENSION_EMPLOYEE_CONVICTED_SERVICE",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isConvictedSeriousCrimeOrGraveMisconduct",
        disabled: data[0].employeeOtherDetailsUpdate,
      }

  
    },
    isAnyJudicialProceedingIsContinuing: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      visible:false,
      props: {
        // content: "any Judicial Proceeding is Continuing",
      
        content: "PENSION_EMPLOYEE_JUDICIAL_PRECEEDING",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isAnyJudicialProceedingIsContinuing",
        disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    isEmploymentActive: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: false,
      visible:false,
      required:false,
      props: {
        //content: "Current Assignment",
        content: "PENSION_EMPLOYEE_CURRENT_ASSIGNMENT",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isEmploymentActive",
        disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    isDaMedicalAdmissible: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      visible: false,
      required:false,
      props: {
        //content: "isDaMedicalAdmissible",
        content: "PENSION_EMPLOYEE_DA_MEDICALADMISSIBLE",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isDaMedicalAdmissible",
        disabled: data[0].employeeOtherDetailsUpdate,
      }
  
    },
    isAnyMisconductInsolvencyInefficiency: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pms",
      componentPath: "CheckboxContainer",
      gridDefination: {
        xs: 6
      },
      isFieldValid: true,
      required:false,
      visible:false,
      props: {
        //content: "any Misconduct, Insolvency or Inefficiency",
        content: "PENSION_EMPLOYEE_MISCUNDUCT_INSOLVENCY",
        jsonPath: "ProcessInstances[0].employeeOtherDetails.isAnyMisconductInsolvencyInefficiency",
        disabled: data[0].employeeOtherDetailsUpdate,
        
      }
  
    },
    //
  }),
  
   
  },
  {
    style: { overflow: "visible" }
  }
);
}
/// new code
