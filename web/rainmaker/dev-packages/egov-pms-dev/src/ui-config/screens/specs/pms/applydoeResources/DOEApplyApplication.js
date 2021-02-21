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
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { initiateWFApiCall } from "./functions";



export const DOEApplyApplication = getCommonCard({
  
 
  appApplyContainer: getCommonContainer({
  
    doe: getDateField({
      label: { labelName: "Date Of Death", labelKey: "PENSION_DOD" },
      placeholder: {
        labelName: "Date Of Death",
        labelKey: "PENSION_DOD"
      },
      jsonPath: "searchScreen.doe",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true
    }),
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
     
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
          // align: "center"
        },
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
            labelKey: "PENSION_BUTTON_SUBMIT"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: initiateWFApiCall
        },
        visible:false
      }
    })
  })
});
