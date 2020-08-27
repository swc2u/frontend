import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import store from "ui-redux/store";
export const getDeptName = (state, codes) => {
  let deptMdmsData = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.common-masters.Department",
    []
  );
  let codeNames = deptMdmsData.filter(x=>x.code ===codes)
  if(codeNames && codeNames[0])
    codeNames = codeNames[0].name;
    else
    codeNames ='-';
    return codeNames;
};

export const getDesigName = (state, codes) => {
  let desigMdmsData = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreenMdmsData.common-masters.Designation",
    []
  );
  let codeNames = desigMdmsData.filter(x=>x.code ===codes)
  if(codeNames && codeNames[0])
  codeNames = codeNames[0].name;
  else
  codeNames ='-';
  return codeNames;
};
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
    "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children",
    state,
    dispatch,
    "search"
  );

  let Dateselect = false;
let ValidAPICall = true;
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
  } 
  else if (
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
        if (key === "dob" || key ==="endDate") {
          Dateselect = true
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
    if(Dateselect)
    {
      let dob = get(
        state,
        "screenConfiguration.preparedFinalObject.searchScreen.dob"
      );
      const  GivenDate = new Date(dob)
      const CurrentDate = new Date();
      if(GivenDate > CurrentDate){
        ValidAPICall = false
        dispatch( toggleSnackbar(
          true,
          { labelName: "Given date can not be greater than the current date", labelKey: 'PENSION_CURRENT_DATE_VALIDATION' },
          "warning"
        ));

        }
        else{
         
          ValidAPICall = true
        }

    }
    else{
      ValidAPICall = true;

    
  }
  if(ValidAPICall)
  {
    try {
      const URL = "/pension-services/v1/_searchPensionNotificationRegister"
      const response = await getSearchResults(queryObject,URL);
      // const response = searchSampleResponse();
      console.log(response.Employees)
      if(response.Employees.length===0)
      {
        // dispatch(
        //       toggleSnackbar(
        //         true,
        //         { labelName: "No Records found for Input parameter", labelKey: "PENSION_NO_RECORDS_FOUND" },
        //         "warning"
        //       )
        //     );
           // break;
      }
        let data = response.Employees.map(item => {
        
      
          return {
            [getTextToLocalMapping("Code")]: get(item, "code", "-") || "-",
            [getTextToLocalMapping("Name")]: get(item, "name", "-") || "-",            
            //[getTextToLocalMapping("gender")]: get(item, "gender", "-") || "-", 
            //[getTextToLocalMapping("employee Status")]: get(item, "employeeStatus", "-") || "-", 
            //[getTextToLocalMapping("employee Type")]: get(item, "employeeType", "-") || "-", 
              [getTextToLocalMapping("Designation")]:
            getDesigName(state, get(item, "designation", "-")) || "-",
          [getTextToLocalMapping("Department")]:
            getDeptName(state, get(item, "department", "-")) || "-",          
            [getTextToLocalMapping("Date Of Birth")]: convertEpochToDate(item.dob, "dob", "-") || "-",         
            [getTextToLocalMapping("Retirement Date")]: convertEpochToDate(item.dateOfRetirement, "dateOfRetirement", "-") || "-",
           // [getTextToLocalMapping("Appointment Date")]: convertEpochToDate(item.dateOfAppointment, "dateOfAppointment", "-") || "-",
            tenantId: item.tenantId,
          };
        });

      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Employee"
          )} (${response.Employees.length})`
        )
      );
      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch);
    } 
    catch (error) {
      //showHideProgress(false, dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Input should not be shorter than 2 characters", labelKey: "ERR_PENSION_FILL_VALID_FIELDS_EXCEPTION" },
          "error"
        )
      );
      store.dispatch(toggleSpinner());
    }
  }
  }
};

export const initiateRegularRetirementPensionApiCall = async (state, dispatch,empInfo) => {  
  showHideTable(false, dispatch);
  //alert('2')
  let queryObject = [
    {
      key: "tenantId",
      value: "ch"//getTenantId()
    }
  ];
    try {
      //const response = await getSearchResults(queryObject);
      // const response = searchSampleResponse();
     
        toggleSnackbar(
          true,
          { labelName: "INITIATED", labelKey: "INITIATED" },
          "warning"
        )
     
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
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
