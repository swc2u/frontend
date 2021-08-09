import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getConsumerTransactionSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import store from "ui-redux/store";

export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  let tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  if(tenantId === null)
  {
   tenantId ='ch.chandigarh'
  }
  tenantId ='ch.chandigarh'
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId,
    },
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchFormValid = validateFields(
    "components.div.children.searchForm.children.cardContent.children.searchFormContainer.children",
    state,
    dispatch,
    "transaction-update"
  );

  if (!isSearchFormValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS",
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every((x) => (typeof x === "string") && x.trim() === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS",
        },
        "warning"
      )
    );
  } else {
    // Add selected search fields to queryobject
    for (var key in searchScreenObject) {
      
      if(searchScreenObject.hasOwnProperty(key) && typeof searchScreenObject[key] === "boolean"){
        queryObject.push({ key: key, value: searchScreenObject[key] });
      }
      else  if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        queryObject.push({ key: key, value: searchScreenObject[key].trim() });
      }
    }
  //  let NULMSEPRequest = {...searchScreenObject};
 
  //  NULMSEPRequest.tenantId = tenantId;

  let IsValidDate = true
 

  
if(IsValidDate)
{
  // const requestBody = {NULMSEPRequest}
    let response = await getConsumerTransactionSearchResults(queryObject, dispatch,tenantId,searchScreenObject.username);
    if(response){
      // try{
      // dispatch(prepareFinalObject("Transaction", get(response, "Transaction", [])));
      // if(get(response, "Transaction", []).length ===0)
      // {
      //   dispatch(
      //     toggleSnackbar(
      //       true,
      //       {
      //         labelName: "Please fill at least one field to start search",
      //         labelKey: `Consumer not found for input : ${searchScreenObject.username}`
      //       },
      //       "warning"
      //     )
      //   );

      // }
      // else{
      //   let accountLocked = get(response, "Transaction[0].txnStatusMsg", [])
      //   dispatch(
      //     handleField(
      //       "transaction-update",
      //       "components.div.children.footer.children.nextButton",
      //       "visible",
      //       accountLocked
      //     )
      //   );
      // }
      // }
      // catch(error)
      // {
      //   dispatch(
      //     toggleSnackbar(
      //       true,
      //       { labelName: error.description, labelKey: error.description },
      //       "error"
      //     )
      //   );
      //   store.dispatch(toggleSpinner());

      // }

      // --------------------------------------------

      try {
        dispatch(prepareFinalObject("Transaction", get(response, "Transaction", [])));
        if(get(response, "Transaction", []).length ===0){
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please fill at least one field to start search",
                labelKey: `Consumer not found for input : ${searchScreenObject.username}`
              },
              "warning"
            )
          );
        }else{
          let data = response.Transaction.map((item) => {
            return {
              [getTextToLocalMapping("Consumer Transaction ID")]: get(item, "txnId", "-") || "-",
              [getTextToLocalMapping("Consumer Transaction Amount")]: get(item, "txnAmount", "-") || "-",
              [getTextToLocalMapping("Consumer Transaction Status")]: get(item, "txnStatus", "-") || "-",
              [getTextToLocalMapping("Module Name")]: get(item, "module", "-") || "-",
              // [getTextToLocalMapping("Created Date")]: get(item, "auditDetails.createdTime", "-") || "-",
              [getTextToLocalMapping("Created Date")]: get(item, "auditDetails.createdTime", "")? new Date(get(item, "auditDetails.createdTime", "-")).toISOString().substr(0,10) : "-",
              // [getTextToLocalMapping("Last Modifid Date")]: get(item, "auditDetails.lastModifiedTime", "-") || "-",
              [getTextToLocalMapping("Last Modifid Date")]: get(item, "auditDetails.lastModifiedTime", "")? new Date(get(item, "auditDetails.lastModifiedTime", "-")).toISOString().substr(0,10) : "-",
              // [getTextToLocalMapping("Contact Number")]: get(item, "contact_number", "-") || "-",
              // [getTextToLocalMapping("Creation Date")]: get(item, "created_time", "")? new Date(get(item, "created_time", "-")).toISOString().substr(0,10) : "-",
              ["code"]: get(item, "txnId", "-")
            };
          });
    
          dispatch(
            handleField(
              "transaction-update",
              "components.div.children.searchResults",
              "props.data",
              data
            )
          );
          dispatch(
            handleField(
              "transaction-update",
              "components.div.children.searchResults",
              "props.title",
              `${getTextToLocalMapping("Search Results for Transaction")} (${
                response.Transaction.length
              })`
            )
          );

          // Button display to Update
          // let accountLocked = get(response, "Transaction[0].txnStatusMsg", [])
          let SuccessTransaction = response.Transaction.filter(transaction => transaction.txnStatus === "SUCCESS");
          let PendingTransaction = response.Transaction.filter(transaction => transaction.txnStatus === "PENDING");
          dispatch(prepareFinalObject("PendingTransaction", PendingTransaction));
          if(PendingTransaction.length === 1 && SuccessTransaction.length === 0){
            dispatch(
              handleField(
                "transaction-update",
                "components.div.children.footer.children.nextButton",
                "visible",
                true
              )
            );
          }else{
            dispatch(
              handleField(
                "transaction-update",
                "components.div.children.footer.children.nextButton",
                "visible",
                false
              )
            );
          }

          showHideTable(true, dispatch);
        }
      } catch (error) {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Unable to parse search results!" },
            "error"
          )
        );
      }
    }
  }
 
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "transaction-update",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
