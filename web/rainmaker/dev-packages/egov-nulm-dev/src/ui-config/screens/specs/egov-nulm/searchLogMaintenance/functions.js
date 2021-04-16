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
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

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
    "search-log-maintenance"
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

   let NulmSuhLogRequest = {...searchScreenObject};
   NulmSuhLogRequest.tenantId = tenantId;
   let IsValidDate = true
   let toDate = get(NulmSuhLogRequest, "toDate")
   let fromDate = get(NulmSuhLogRequest, "fromDate")
   if(toDate &&  (fromDate === null  || fromDate === undefined))
   {
     IsValidDate = false
   }
   else if(fromDate && (toDate === null  || toDate === undefined))
 {
   IsValidDate = false
 
 }
 if(toDate && toDate)
 {
   if(fromDate< toDate)
   {
     IsValidDate = true
 
   }
   else
   {
     IsValidDate = false
   }
 }
   if(IsValidDate)
   {
   const requestBody = {NulmSuhLogRequest}
    let response = await getSearchResults([],requestBody, dispatch,"suhLog");
    try {
      let data = response.ResponseBody.map((item) => {
  
        return {
          [getTextToLocalMapping("Name of Shelter")]: get(item, "nameOfShelter", "-") || "-",
          [getTextToLocalMapping("Name")]: get(item, "name", "-") || "-",
          [getTextToLocalMapping("Creation Date")]: get(item, "auditDetails.createdTime", "")? new Date(get(item, "auditDetails.createdTime", "-")).toISOString().substr(0,10) : "-",
          ["code"]: get(item, "logUuid", "-")
        };
      });

      dispatch(
        handleField(
          "search-log-maintenance",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-log-maintenance",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for SUH Log")} (${
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
  else{
    if(toDate &&  (fromDate === null  || fromDate === undefined))
  {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select from date",
          labelKey: "ERR_NULM_FROM_DATE_SELECTION_VALIDATION",
        },
        "warning"
      )
    );
      }
      else if(fromDate && (toDate === null  || toDate === undefined))
      {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "Please select to date",
              labelKey: "ERR_NULM_TO_DATE_SELECTION_VALIDATION",
            },
            "warning"
          )
        );

      }
      if(toDate && toDate)
      {
        if(fromDate > toDate)
        {
          dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "From date shpuld be less then to date",
                labelKey: "ERR_NULM_FROM_DATE_TO_DATE_SELECTION_VALIDATION",
              },
              "warning"
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
      "search-log-maintenance",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
