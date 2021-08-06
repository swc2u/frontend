import {
  getCommonCard,
  getCommonContainer,
  getCommonParagraph,
  getCommonTitle,
  getLabel,
  getPattern,
  getSelectField,
  getTextField,
  getDateField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTextToLocalMapping } from "./searchResults";
import { searchApiCall } from "./functions";

const resetFields = (state, dispatch) => {
  const textFields = ["username",];
  dispatch(
    handleField(
      "transaction-update",
      "components.div.children.searchResults",
      "props.data",
      []
    )
  );
  dispatch(
    handleField(
      "transaction-update",
      "components.div.children.searchResults",
      "props.title",
      `${getTextToLocalMapping("Search Results for Transaction")} (0)`
    )
  );
  for (let i = 0; i < textFields.length; i++) {
    if (
      `state.screenConfiguration.screenConfig.transaction-update.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}.props.value`
    ) {
      dispatch(
        handleField(
          "transaction-update",
          `components.div.children.searchForm.children.cardContent.children.searchFormContainer.children.${textFields[i]}`,
          "props.value",
          ""
        )
      );
    }
  }
  dispatch(prepareFinalObject("searchScreen", {}));
  dispatch(prepareFinalObject("UserInfo", []));
  dispatch(prepareFinalObject("Transaction", []));
  dispatch(
    handleField(
      "transaction-update",
      "components.div.children.footer.children.nextButton",
      "visible",
      false
    )
  );
};

export const searchForm = getCommonCard({
  // subHeader: getCommonTitle({
  //   labelName: "Search Criteria",
  //   labelKey: "STORE_SEARCH_RESULTS_HEADING",
  // }),
  // subParagraph: getCommonParagraph({
  //   labelName: "Provide at least one parameter to search for an application",
  //   labelKey: "STORE_HOME_SEARCH_RESULTS_DESC",
  // }),
  searchFormContainer: getCommonContainer({
 
    username: {
      ...getTextField({
        label: {
          labelName: "Consumer Code",
          labelKey: "CORE_LOGIN_CONSUMER_CODE"
        },
        placeholder: {
          labelName: "Enter Consumer Code",
          labelKey: "CORE_LOGIN_CONSUMER_CODE_PLACEHOLDER"
        },
      //  pattern: getPattern("Amount"),
        gridDefination: {
          xs: 12,
          sm: 4,
        },
        jsonPath: "searchScreen.username"
      })
    },

  
  }),

 
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            //   borderRadius: "2px",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "center",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Reset",
            labelKey: "STORE_COMMON_RESET_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4,
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
            height: "48px",
            float: "center",
            textalign:"center",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "STORE_COMMON_SEARCH_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCall,
        },
      },
    }),
  }),
});
