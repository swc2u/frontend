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
import {  
  Actiongetlocalization,
  
  } from "../../../../../ui-utils/LocalizationCode";
  let localizationkey = Actiongetlocalization();
const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "searchDisability",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.code",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchDisability",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.name",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchDisability",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.dob",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchDisability",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.department",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchDisability",
      "components.div.children.searchResults",
      "visible",
      false
    )
  );
  
};

export const RRPApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Disability",
    labelKey: localizationkey.localization[0].PENSION_DISABILITY_SUB_HEADER.key
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: localizationkey.localization[0].PENSION_HOME_SEARCH_RESULTS_DESC.key
  }),
  appRRPSearchContainer: getCommonContainer({
    code: getTextField({
      label: {
        labelName: "Employee Code.",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_CODE.key
      },
      placeholder: {
        labelName: "Employee Code.",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_CODE.key
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: localizationkey.localization[0].ERR_DEFAULT_INPUT_FIELD_MSG.key,
      jsonPath: "searchScreen.code"
    }),
    name: getTextField({
      label: {
        labelName: "Name",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_NAME.key
      },
      placeholder: {
        labelName: "Name",
        labelKey: localizationkey.localization[0].PENSION_EMPLOYEE_NAME.key
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,50}$/i,
      errorMessage: localizationkey.localization[0].ERR_DEFAULT_INPUT_FIELD_MSG.key,
      jsonPath: "searchScreen.name"
    }),
    department: getSelectField({
      label: { labelName: "Department", labelKey: "HR_DEPT_LABEL" },
      placeholder: {
        labelName: "Select Department",
        labelKey: "HR_DEPT_LABEL"
      },
      required: false,
      jsonPath: "searchScreen.departments",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      sourceJsonPath: "searchScreenMdmsData.common-masters.Department",
      props: {
        optionLabel: "name",
        optionValue: "code"
        // hasLocalization: false
      },
      // localePrefix: {
      //   moduleName: "common-masters",
      //   masterName: "Department"
      // }
    }),
    dob: getDateField({
      label: { labelName: "Date Of Birth", labelKey: localizationkey.localization[0].PENSION_DOB.key },
      placeholder: {
        labelName: "Date Of Birth",
        labelKey: localizationkey.localization[0].PENSION_DOB.key
      },
      jsonPath: "searchScreen.dob",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: localizationkey.localization[0].ERR_DEFAULT_INPUT_FIELD_MSG.key,
      required: false,
      visible:true
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
            labelKey: localizationkey.localization[0].PENSION_HOME_SEARCH_RESET_BUTTON.key
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
            labelName: "Search",
            labelKey: localizationkey.localization[0].PENSION_SEARCH_RESULTS_BUTTON_SEARCH.key
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
