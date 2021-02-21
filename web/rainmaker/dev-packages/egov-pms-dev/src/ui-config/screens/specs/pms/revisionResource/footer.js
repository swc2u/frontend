
import { getCommonApplyFooter, } from "../../utils";
import { getLabel} from "egov-ui-framework/ui-config/screens/specs/utils";

import { createRevisedPension,calculateRevisedPension,updateRevisedPension } from "./function";


export const footer = (IsAdd,IsEdit,IsRevisionEdit) => {
 // IsEdit = IsEdit === true ? IsEdit:IsRevisionEdit
  //IsAdd = IsRevisionEdit
  return getCommonApplyFooter({
  
    AddButton: {
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
        callBack: createRevisedPension
      },
      visible: IsAdd
    },
    EditButton: {
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
        callBack: updateRevisedPension
      },
      visible: IsEdit
    },
    CalculateButton: {
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
          labelKey: "PENSION_REVISION_CALCULATE"
        }),
        
        
      },
      onClickDefination: {
        action: "condition",
        callBack: calculateRevisedPension
      },
      visible: IsRevisionEdit
    },
  
  
});
}
