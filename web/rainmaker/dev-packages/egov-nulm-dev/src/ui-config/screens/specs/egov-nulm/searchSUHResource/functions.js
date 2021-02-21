import get from "lodash/get";
import find from "lodash/find";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { getTextToLocalMapping } from "./searchResults";
import { validateFields,convertDateToEpoch } from "../../utils";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
export const searchApiCall = async (state, dispatch) => {
  let { localisationLabels } = state.app || {};
  showHideTable(false, dispatch);
  const tenantId = "ch.chandigarh" // process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

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
    "search-suh"
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
    // for (var key in searchScreenObject) {
      
    //   if(searchScreenObject.hasOwnProperty(key) && typeof searchScreenObject[key] === "boolean"){
    //     queryObject.push({ key: key, value: searchScreenObject[key] });
    //   }
    //   else  if (
    //     searchScreenObject.hasOwnProperty(key) &&
    //     searchScreenObject[key].trim() !== ""
    //   ) {
    //     queryObject.push({ key: key, value: searchScreenObject[key].trim() });
    //   }
    // }
   let NulmSuhRequest = {...searchScreenObject};
   NulmSuhRequest.tenantId = tenantId;

  // if(get(NulmSuhRequest, "toDate")){
  //   let toDate = get(NulmSuhRequest, "toDate").split("-").reverse().join("-");
  //   set( NulmSuhRequest,"toDate",toDate );
  // }
  // if(get(NulmSuhRequest, "fromDate")){
  //   let fromDate = get(NulmSuhRequest, "fromDate").split("-").reverse().join("-");
  //   set( NulmSuhRequest,"fromDate",fromDate );
  // }
  
   const requestBody = {NulmSuhRequest}
    let response = await getSearchResults([],requestBody, dispatch,"suh");
    try {
      let data = response.ResponseBody.map((item) => {
  
        return {
          [getTextToLocalMapping("Application Id")]: get(item, "suhId", "-") || "-",
          [getTextToLocalMapping("Name of Shelter")]: get(item, "nameOfShelter", "-") || "-",
          [getTextToLocalMapping("Application Status")]: get(item, "applicationStatus", "-") || "-",
          [getTextToLocalMapping("Creation Date")]: get(item, "auditDetails.createdTime", "")? new Date(get(item, "auditDetails.createdTime", "-")).toISOString().substr(0,10) : "-",
          ["code"]: get(item, "suhUuid", "-")
        };
      });

      dispatch(
        handleField(
          "search-suh",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-suh",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for SUH")} (${
            response.ResponseBody.length
          })`
        )
      );
      showHideTable(true, dispatch);
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
};

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search-suh",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
