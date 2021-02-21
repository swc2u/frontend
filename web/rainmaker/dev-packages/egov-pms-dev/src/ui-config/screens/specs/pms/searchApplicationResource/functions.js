import get from "lodash/get";

import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getsearchApplication } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping ,getLocalizationCodeValue} from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import store from "ui-redux/store";
import {  
  ActionEmployee,
  ActionPensionReview
  } from "../../../../../ui-utils/PensionResponce";
export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    }
    // { key: "limit", value: "10" },
    // { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.SearchApplication.children.cardContent.children.ApplicationSearchContainer.children",
    state,
    dispatch,
    "Applicationsearch"
  );
  const fields = get(
    state.screenConfiguration.screenConfig["rrpDetails"],
    "components.div.children.formwizardFirstStep.children.employeeOtherDetails.children.cardContent.children.employeeOtherDetailsConatiner.children",
    {}
  );



  if (!(isSearchBoxFirstRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PENSION_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "PENSION_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
        },
        "warning"
      )
    );
  }  else {
    //  showHideProgress(true, dispatch);
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "dob") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "dob")
          });
        } 
        // else if (key === "status") {
        //   queryObject.push({
        //     key: "action",
        //     value: searchScreenObject[key].trim()
        //   });
        // }
        else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      
      const response = await getsearchApplication(queryObject);
      dispatch(prepareFinalObject("queryObject", queryObject, []));
      if(response.Applications.length===0)
      {
        // dispatch(
        //       toggleSnackbar(
        //         true,
        //         { labelName: "No Records found for Input parameter", labelKey: "PENSION_NO_RECORDS_FOUND" },
        //         "warning"
        //       )
        //     );
            //break;
      }
        let data = response.Applications.map(item => {
          
      
          return {
           // [getTextToLocalMapping("Action")]: get(item, "action", "-") || "-",Sl. No.
            
           [getTextToLocalMapping("Application Number")]: get(item, "businessId", "-") || "-", 
           [getTextToLocalMapping("Date of Submission")]: convertEpochToDate(Number(item.applicationDate,"applicationDate" ,"-")) || "-",            
            [getTextToLocalMapping("Status")]: getLocalizationCodeValue(`WF_${get(item, "businessService", "-")+"_"+get(item,"state","-")}`) || "-", 
           

           
          };
        });

      dispatch(
        handleField(
          "Applicationsearch",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "Applicationsearch",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Employee"
          )} (${response.Applications.length})`
        )
      );
      
      showHideTable(true, dispatch);
    } catch (error) {
      //showHideProgress(false, dispatch);
      //alert(error)
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Input should not be shorter than 2 characters", labelKey: error.message },
          "error"
        )
      );
      store.dispatch(toggleSpinner());
    }
  }
};

export const initiateRegularRetirementPensionApiCall = async (state, dispatch) => {  
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    }
  ];
    try {
      const response = await getSearchResults(queryObject);
      // const response = searchSampleResponse();
      console.log(response.Employees)
     

      dispatch(
        handleField(
          "Applicationsearch",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      showHideTable(true, dispatch);
    } catch (error) {
      
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "Applicationsearch",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
