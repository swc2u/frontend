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
      "Applicationsearch",
      "components.div.children.searchResults",
      "visible",
      false
    )
  );
  dispatch(
    handleField(
      "Applicationsearch",
      "components.div.children.SearchApplication.children.cardContent.children.ApplicationSearchContainer.children.businessId",
      "props.value",
      ""
    )
  );
 
};

export const SearchApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search  Application",
    labelKey: "PENSION_SEARCH_APPLICATIPN_HEADER"
  }),
  // subParagraph: getCommonParagraph({
  //   labelName: "Provide at least one parameter to search for an application",
  //   labelKey: "PENSION_HOME_SEARCH_RESULTS_DESC"
  // }),
  ApplicationSearchContainer: getCommonContainer({
    businessId: getTextField({
      label: {
        labelName: "Application Number",
        labelKey: "PENSION_APPLICATION_NUMBER"
      },
      placeholder: {
        labelName: "Application Number.",
        labelKey: "PENSION_APPLICATION_NUMBER"
      },
      gridDefination: {
        xs: 12,
        sm: 4
      },
      required: true,
      pattern: /^[a-zA-Z0-9-]*$/i,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "searchScreen.businessId"
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
            labelName: "Applicationsearch",
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
