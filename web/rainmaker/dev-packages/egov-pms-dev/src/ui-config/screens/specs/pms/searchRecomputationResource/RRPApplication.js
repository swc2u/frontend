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
      "searchRecomputation",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.department",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.businessId",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.name",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.businessService",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.endDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.startDate",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.searchResults",
      "visible",
      false
    )
  );
  
};

export const RRPApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Recomputation",
    labelKey: "PENSION_RECOMPUTATION_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "PENSION_HOME_SEARCH_RESULTS_DESC"
  }),
  appRRPSearchContainer: getCommonContainer({
    businessService: {
      ...getSelectField({
        label: {
          labelName: " Business service",
          labelKey: "PENSION_BUSINESS_SERVICE"
        },
        placeholder: {
          labelName: "Business service",
          labelKey: "PENSION_BUSINESS_SERVICE_SELECT"
        },
        required: true,
       
        jsonPath: "searchScreen.businessService",
        localePrefix: {
          moduleName: "PENSION",
         masterName: "MODULE"
        },
        props: {
          className:"applicant-details-error",
          disabled: false,
        },
       
        sourceJsonPath:
       "applyScreenMdmsData.pension.BusinessService",
        //"applyScreenMdmsData.tenant",
       
      }),
     
      
    }, 
    businessId: getTextField({
      label: {
        labelName: "Application Mumber",
        labelKey: "PENSION_APPLICATION_NUMBER"
      },
      placeholder: {
        labelName: "Application Mumber",
        labelKey: "PENSION_APPLICATION_NUMBER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: false,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.businessId"
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
    department: getSelectField({
      label: { labelName: "Department", labelKey: "HR_DEPT_LABEL" },
      placeholder: {
        labelName: "Select Department",
        labelKey: "HR_DEPT_PLACEHOLDER"
      },
      required: false,
      visible:false,
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
    startDate: getDateField({
      label: { labelName: "Start Date", labelKey: "PENSION_START_DATE" },
      placeholder: {
        labelName: "Start Date",
        labelKey: "PENSION_START_DATE"
      },
      jsonPath: "searchScreen.startDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false
    }),
    endDate: getDateField({
      label: { labelName: "End Date", labelKey: "PENSION_END_DATE" },
      placeholder: {
        labelName: "End Date",
        labelKey: "PENSION_END_DATE"
      },
      jsonPath: "searchScreen.endDate",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: false
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
            labelName: "Search",
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
