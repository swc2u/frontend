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
    "search-alf"
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
   let NulmSmidAlfRequest = {...searchScreenObject};
   NulmSmidAlfRequest.tenantId = tenantId;

  // if(get(NULMSEPRequest, "toDate")){
  //   let toDate = get(NULMSEPRequest, "toDate").split("-").reverse().join("-");
  //   set( NULMSEPRequest,"toDate",toDate );
  // }
  // if(get(NULMSEPRequest, "fromDate")){
  //   let fromDate = get(NULMSEPRequest, "fromDate").split("-").reverse().join("-");
  //   set( NULMSEPRequest,"fromDate",fromDate );
  // }
  let IsValidDate = true
  let toDate = get(NulmSmidAlfRequest, "toDate")
  let fromDate = get(NulmSmidAlfRequest, "fromDate")
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
  else if(fromDate === toDate)
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
   const requestBody = {NulmSmidAlfRequest}
    let response = await getSearchResults([],requestBody, dispatch,"alf");

    debugger;
    try {
      let data = response.ResponseBody.map((item) => {
  
        return {
          [getTextToLocalMapping("Application Id")]: get(item, "id", "-") || "-",
          [getTextToLocalMapping("Name of ALF")]: get(item, "name", "-") || "-",
          // [getTextToLocalMapping("Contact Number")]: get(item, "contact_number", "-") || "-",
          // [getTextToLocalMapping("Creation Date")]: get(item, "created_time", "")? new Date(get(item, "created_time", "-")).toISOString().substr(0,10) : "-",
          ["code"]: get(item, "uuid", "-")
        };
      });

      dispatch(
        handleField(
          "search-smid-NGO",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search-smid-NGO",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping("Search Results for ALF")} (${
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
      "search-sep",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
