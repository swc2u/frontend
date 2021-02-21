import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField , prepareFinalObject} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchClosedApplication } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import store from "ui-redux/store";
import {  
  ActionCloseApplication,
  ActionPensionReview
  } from "../../../../../ui-utils/PensionResponce";
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
    "components.div.children.RRPApplication.children.cardContent.children.appRRPSearchContainer.children.children",
    state,
    dispatch,
    "searchRecomputation"
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
        if (key === "startDate"|| key === "endDate") {
          Dateselect = true;
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

     // const URL = "/pension-services//v1/_searchClosedApplication"
      const response = await searchClosedApplication(queryObject,URL);
     // const response = ActionCloseApplication();
      console.log(response.ProcessInstances)
      if(response.ProcessInstances.length===0)
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
        let data = response.ProcessInstances.map(item => {       
         // GET ALL CURRENT DESIGNATIONS OF EMPLOYEE
         let currentDesignations = get(item, "assignments", [])
         .filter(assignment => {
           return assignment.isCurrentAssignment;
         })
         .map(assignment => {
           return assignment.designation;
         });

       // GET ALL CURRENT DEPARTMENTS OF EMPLOYEE
       let currentDepartments = get(item, "assignments", [])
         .filter(assignment => {
           return assignment.isCurrentAssignment;
         })
         .map(assignment => {
           return assignment.department;
         });
      
          return {
           // [getTextToLocalMapping("Action")]: get(item, "action", "-") || "-",
            [getTextToLocalMapping("Code")]: get(item, "code", "-") || "-", 
            [getTextToLocalMapping("Name")]: get(item, "name", "-") || "-",           
            [getTextToLocalMapping("Application Number")]: get(item, "businessId", "-") || "-",  
            [getTextToLocalMapping("recomputedBusinessId")]: get(item, "recomputedBusinessId", "") || "",                   
            [getTextToLocalMapping("applicationDate")]: convertEpochToDate(item.applicationDate, "applicationDate", "-") || "-",  
           // [getTextToLocalMapping("lastModifiedDate")]: convertEpochToDate(item.lastModifiedDate, "lastModifiedDate", "-") || "-",         
          //  [getTextToLocalMapping("Designation")]:
          //   getDesigName(state, get(item, "designation", "-")) || "-",
          // [getTextToLocalMapping("Department")]:
          //   getDeptName(state, get(item, "department", "-")) || "-",  
            tenantId: item.tenantId,
            businessService: item.businessService,
           // id: item.recomputedBusinessId,
           
          };
        });

      dispatch(
        handleField(
          "searchRecomputation",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "searchRecomputation",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Close Application"
          )} (${response.ProcessInstances.length})`
        )
      );
     
      // dispatch(prepareFinalObject("ProcessInstances", response.ProcessInstances, []));
      //dispatch(prepareFinalObject("ProcessInstances", queryObject, []));
     // dispatch(prepareFinalObject("ProcessInstances", notification, []));
      showHideTable(true, dispatch);
    } catch (error) {
      //showHideProgress(false, dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Input should not be shorter than 2 characters", labelKey: error },
          "error"
        )
      );
      store.dispatch(toggleSpinner());
    }
  }
  }
};



const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "searchRecomputation",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
