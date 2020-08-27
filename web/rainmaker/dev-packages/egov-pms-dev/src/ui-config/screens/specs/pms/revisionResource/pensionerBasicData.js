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



  
  export const pensionerBasicDetails = () => {
 
 
  return getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Pensioner Basic Details",
        labelKey: "PENSION_EMPLOYEE_PENSIONER_DATA"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    break: getBreak(),
    pensionerdetails: getCommonContainer({
        pensionerNumber: getLabelWithValue(
            {
              labelName: "PENSION_PENSIONER_NUMBER",
              labelKey: "PENSION_PENSIONER_NUMBER"
            },
            {
              jsonPath:
                "ProcessInstances[0].pensioner.pensionerNumber"
            }
          ),
          name: getLabelWithValue(
            {
              labelName: "PENSION_PENSIONER_NAME",
              labelKey: "PENSION_PENSIONER_NAME"
            },
            {
              jsonPath:
                "ProcessInstances[0].pensioner.name"
            }
          ),
     
    }),
    break:getBreak(),
   
    
  });
  }
  