import {
    getCommonCard,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  
     
      totalValue: {
        ...getTextField({
          label: {
            labelName: "Total Value",
            labelKey: "STORE_MATERIAL_INDENT_NOTE_TOTAL_VALUE"
          },
          props: {
            disabled: true
          },
          jsonPath: "indents[0].totalValue"
        })
      },
    })
  });
  
  