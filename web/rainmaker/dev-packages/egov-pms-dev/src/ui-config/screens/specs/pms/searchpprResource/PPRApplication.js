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
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appNOCAndMobNumContainer.children.department",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appNOCAndMobNumContainer.children.code",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appNOCAndMobNumContainer.children.name",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appNOCAndMobNumContainer.children.ownerMobNo",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.employeeCode",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.dob",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchppr",
      "components.div.children.PPRApplication.children.cardContent.children.appStatusAndToFromDateContainer.children.toDate",
      "props.value",
      ""
    )
  );
};

export const PPRApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search NOC Application",
    labelKey: "PENSION_REGULAR_RETIREMENT_PENSION_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "PENSION_HOME_SEARCH_RESULTS_DESC"
  }),
  appNOCAndMobNumContainer: getCommonContainer({
    code: getTextField({
      label: {
        labelName: "Employee Code.",
        labelKey: "PENSION_EMPLOYEE_CODE"
      },
      placeholder: {
        labelName: "Employee Code.",
        labelKey: "PENSION_EMPLOYEE_CODE"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.code"
    }),
    name: getTextField({
      label: {
        labelName: "Name",
        labelKey: "PENSION_EMPLOYEE_NAME"
      },
      placeholder: {
        labelName: "Name",
        labelKey: "PENSION_EMPLOYEE_NAME"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[^\$\"'<>?\\\\~`!@#$%^()+={}\[\]*,.:;“”‘’]{1,50}$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.name"
    }),
    dob: getDateField({
      label: { labelName: "Date Of Birth", labelKey: "PENSION_DOB" },
      placeholder: {
        labelName: "Date Of Birth",
        labelKey: "PENSION_DOB"
      },
      jsonPath: "searchScreen.dob",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false
    }),
    department: getSelectField({
      label: { labelName: "Department", labelKey: "HR_DEPT_LABEL" },
      placeholder: {
        labelName: "Select Department",
        labelKey: "HR_DEPT_PLACEHOLDER"
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
            labelName: "searchppr",
            labelKey: "PENSION_SEARCH_RESULTS_BUTTON_SEARCH"
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
