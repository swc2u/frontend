import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { textToLocalMapping } from "./searchResults";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
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
    "components.div.children.PPRApplication.children.cardContent.children.appNOCAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  

  if (!(isSearchBoxFirstRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_FIRENOC_FILL_VALID_FIELDS"
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
      const response = await getSearchResults(queryObject);
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
            [getTextToLocalMapping("Action")]: get(item, "action", "-") || "-",
            [getTextToLocalMapping("Name")]: get(item, "name", "-") || "-",
            [getTextToLocalMapping("Code")]: get(item, "code", "-") || "-",         
            [getTextToLocalMapping("Date Of Birth")]: convertEpochToDate(item.dob, "dob", "-") || "-",         
            [getTextToLocalMapping("Retirement Date")]: convertEpochToDate(item.dateOfRetirement, "dateOfRetirement", "-") || "-",
            [getTextToLocalMapping("Designation")]: getDesigName(state, get(item, "designationName", "-")) || "-", 
            [getTextToLocalMapping("Department")]:
            getDeptName(state, get(item, "department", "-")) || "-",  
            tenantId: item.tenantId,
            pensionNotificationRegisterId:item.pensionNotificationRegisterId,
            pensionEmployeeId:item.pensionEmployeeId,
           
           
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
    } catch (error) {
      //showHideProgress(false, dispatch);
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
