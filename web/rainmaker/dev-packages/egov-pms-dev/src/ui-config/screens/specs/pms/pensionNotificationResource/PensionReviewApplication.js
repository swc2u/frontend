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
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "pensionNotification",
      "components.div.children.PensionReviewApplication.children.cardContent.children.appPRSearchContainer.children.year",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "pensionNotification",
      "components.div.children.PensionReviewApplication.children.cardContent.children.appPRSearchContainer.children.month",
      "props.value",
      ""
    )
  );
  
};

export const PensionReviewApplication = getCommonCard({
  // subHeader: getCommonTitle({
  //   labelName: "Search Pensioner",
  //   labelKey: "PENSION_SEARCH_PENSIONER_SUB_HEADER"
  // }),
  // subParagraph: getCommonParagraph({
  //   labelName: "Provide at least one parameter to search for an application",
  //   labelKey: "PENSION_HOME_SEARCH_RESULTS_DESC"
  // }),
  appPRSearchContainer: getCommonContainer({
    
    year: getSelectField({
      label: { labelName: "year", labelKey: "INTIGRATION_YEAR" },
      placeholder: {
        labelName: "Select year",
        labelKey: "INTIGRATION_YEAR_ERROR_SELECT"
      },
      required: true,
      jsonPath: "searchScreen.Year",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "applyScreenMdmsData.pension.PensionRevisionYear",
      props: {
        // optionLabel: "name",
        // optionValue: "code"
        disabled:false, 
      },
      // localePrefix: {
      //   moduleName: "common-masters",
      //   masterName: "Department"
      // }
    }),
    month: getSelectField({
      label: { labelName: "Month", labelKey: "INTIGRATION_MONTH" },
      placeholder: {
        labelName: "Select Month",
        labelKey: "INTIGRATION_MONTH"
      },
      required: true,
      jsonPath: "searchScreen.Month",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "applyScreenMdmsData.pension.PensionRevisionMonth",
      props: {
        // optionLabel: "name",
        // optionValue: "code"
        disabled:false, 
        // hasLocalization: false
      },
      // localePrefix: {
      //   moduleName: "common-masters",
      //   masterName: "Department"
      // }
    }),
    
  }),
  

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "PENSION_HOME_SEARCH_RESET_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 6
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            margin: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "220px",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "searchdoe",
            labelKey: "PENSION_NOTIFICATION"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall
        }
      }
    })
  })
});
