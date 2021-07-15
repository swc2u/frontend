import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getuserSearchResults } from "../../../../../ui-utils/commons";
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
    "user-update"
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
    let response = await getuserSearchResults(queryObject, dispatch,tenantId,searchScreenObject.username);
    if(response)
    {
      try{
      dispatch(prepareFinalObject("UserInfo", get(response, "user", [])));
      if(get(response, "user", []).length ===0)
      {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Please fill at least one field to start search",
              labelKey: `User not found for input username ${searchScreenObject.username}`
            },
            "warning"
          )
        );

      }
      else{
        let accountLocked = get(response, "user[0].accountLocked", [])
        dispatch(
          handleField(
            "user-update",
            "components.div.children.footer.children.nextButton",
            "visible",
            !accountLocked
          )
        );
      }
      }
      catch(error)
      {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: error.description, labelKey: error.description },
            "error"
          )
        );
        store.dispatch(toggleSpinner());

      }
    }
   
  }
 
  }
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "user-update",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
