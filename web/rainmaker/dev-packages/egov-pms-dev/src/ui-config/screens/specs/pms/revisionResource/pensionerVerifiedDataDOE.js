import {
    getBreak,
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getLabel,
    getDateField,
    getSelectField,
    getCommonContainer,
    getLabelWithValue,
    getPattern,
    
  } from "egov-ui-framework/ui-config/screens/specs/utils";



  
  export const pensionerverifiedDataDOE = () => {
 
 
  return getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Pension Calculation Update Details",
        labelKey: "PENSION_PENSION_REVISION_VERIFIED_DATA_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    break: getBreak(),
    pensionerFinalCalculatedBenefitDetails: getCommonContainer({
        basicPension: getLabelWithValue(
          {
            labelName: "basicPension",
            labelKey: "PENSION_EMPLOYEE_PENSION_BP_V"
          }, 
                
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.basicPension" }
          
        ),
        pensionDeductions: getLabelWithValue(
          {
            labelName: "pensionDeductions",
            labelKey: "PENSION_EMPLOYEE_PENSION_PD_V"
          },
         
         
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.pensionDeductions" }
        ),
        additionalPension: getLabelWithValue(
          {
            labelName: "additionalPension",
            labelKey: "PENSION_EMPLOYEE_PENSION_AP_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.additionalPension" }
        ),
        commutedPension: getLabelWithValue(
          {
            labelName: "commutedPension",
            labelKey: "PENSION_EMPLOYEE_PENSION_CP_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.commutedPension" }
        ),
        basicommutedValuecPension: getLabelWithValue(
          {
            labelName: "commutedValue",
            labelKey: "PENSION_EMPLOYEE_PENSION_CV_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.commutedValue" }
        ),
        familyPensionI: getLabelWithValue(
          {
            labelName: "familyPensionI",
            labelKey: "PENSION_EMPLOYEE_PENSION_AFP1_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.familyPensionI" }
        ),
        familyPensionII: getLabelWithValue(
          {
            labelName: "familyPensionII",
            labelKey: "PENSION_EMPLOYEE_PENSION_AFP2_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.familyPensionII" }
        ),
        dcrg: getLabelWithValue(
          {
            labelName: "dcrg",
            labelKey: "PENSION_EMPLOYEE_PENSION_DCRG_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.dcrg" }
        ),
        finalCalculatedPension: getLabelWithValue(
          {
            labelName: "finalCalculatedPension",
            labelKey: "PENSION_EMPLOYEE_PENSION_FINAL_CALCULATION_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.finalCalculatedPension" }
        ),
        interimRelief: getLabelWithValue(
          {
            labelName: "interimRelief",
            labelKey: "PENSION_EMPLOYEE_PENSION_IR_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.interimRelief" }
        ),
        da: getLabelWithValue(
          {
            labelName: "da",
            labelKey: "PENSION_EMPLOYEE_PENSION_DA_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.da" }
        ),
        nqsYear: getLabelWithValue(
          {
            labelName: "nqsYear",
            labelKey: "PENSION_EMPLOYEE_PENSION_NQS_YEAR_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.nqsYear" }
        ),
        nqsMonth: getLabelWithValue(
          {
            labelName: "nqsMonth",
            labelKey: "PENSION_EMPLOYEE_PENSION_NQS_MONTH_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.nqsMonth" }
        ),
        nqsDay: getLabelWithValue(
          {
            labelName: "nqsDay",
            labelKey: "PENSION_EMPLOYEE_PENSION_NQS_DAY_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.nqsDay" }
        ),
        compassionatePension: getLabelWithValue(
          {
            labelName: "compassionatePension",
            labelKey: "PENSION_EMPLOYEE_PENSION_COMP_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.compassionatePension" }
        ),
        compensationPension: getLabelWithValue(
          {
            labelName: "compensationPension",
            labelKey: "PENSION_EMPLOYEE_PENSION_COM_P_S"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.compensationPension" }
        ),
        terminalBenefit: getLabelWithValue(
          {
            labelName: "terminalBenefit",
            labelKey: "PENSION_EMPLOYEE_PENSION_TB_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.terminalBenefit" }
        ),
        finalCalculatedGratuity: getLabelWithValue(
          {
            labelName: "finalCalculatedGratuity",
            labelKey: "PENSION_EMPLOYEE_PENSION_FCG_V"
          },
          { jsonPath: "ProcessInstances[0].pensionerFinalCalculatedBenefitDetails.finalCalculatedGratuity" }
        ),
       
      }),
    break:getBreak(),
   
    
  });
  }
  