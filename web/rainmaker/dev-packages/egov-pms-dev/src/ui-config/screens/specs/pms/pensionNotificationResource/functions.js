import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchPensionerForPensionRevision ,notifyPensionDisbursement} from "../../../../../ui-utils/commons";
import { convertEpochToDate, convertDateToEpoch } from "../../utils/index";
import { toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields, getTextToLocalMapping } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../../ui-utils";
import {  
  ActionEmployee,
  ActionPensionReview
  } from "../../../../../ui-utils/PensionResponce";
  import store from "ui-redux/store";
import { getTranslatedLabel } from "egov-ui-framework/ui-utils/commons";
  export const getDeptName = (state, codes) => {
    let deptMdmsData = get(
      state.screenConfiguration.preparedFinalObject,
      "applyScreenMdmsData.common-masters.Department",
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
      "applyScreenMdmsData.common-masters.Designation",
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
  
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.PensionReviewApplication.children.cardContent.children.appPRSearchContainer.children",
    state,
    dispatch,
    "searchppr"
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
    let IsvalidInput = false 
let Month = get(searchScreenObject,'Month' , Month)
let Year = get(searchScreenObject,'Year' , Year)
    
    if(Month && Year)
    {
      const lastLoginTime = new Date().getTime();
      const dateFromApi = new Date(lastLoginTime);
      let curMonth = dateFromApi.getMonth() + 1;      
      let curYear = dateFromApi.getFullYear();
     if(Month<= curMonth && Year<= curYear)
     {
      IsvalidInput = true
     }
     else{
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please select current or previous year and month",
            labelKey: "PENSION_FILL_CURRENT_MONTH_AND_YEAR"
          },
          "warning"
        )
      );

     }
     
      
    }
    else{
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please fill Required details",
            labelKey: "PENSION_FILL_REQUIRED_FIELDS"
          },
          "warning"
        )
      );

    }
    try {  
      if(IsvalidInput) 
      {   
      let queryObject = {
        tenantId:getTenantId(),
        reportName:'MonthlyPensionDrawn',
        searchParams:[
          {
            name:'Year',
            input:Year
          },
          {
            name:'Month',
            input:Month
          }
        ]
    
      }
      const response = await notifyPensionDisbursement(queryObject,getTenantId());
       
      if(response.Pensioners.length===0)
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
      if(response.Pensioners.length>0)
      {
      dispatch(
              toggleSnackbar(
                true,
                { labelName: "No Records found for Input parameter", labelKey: "PENSION_NOTIFICATION_SUCCESS" },
                "success"
              )
            );
           // break;
      // let data = response.Pensioners.map(item => {
          
      
      //   return {
         
          
      //    [getTextToLocalMapping("Code")]: get(item, "code", "-") || "-", 
      //    [getTextToLocalMapping("Name")]: get(item, "name", "-") || "-",
      //   [getTextToLocalMapping("gender")]: get(item, "gender", "-") || "-", 
      //    [getTextToLocalMapping("Designation")]: getDesigName(state, get(item, "designation", "-")) || "-", 
      //    [getTextToLocalMapping("Department")]:
      //    getDeptName(state, get(item, "department", "-")) || "-",         
      //     [getTextToLocalMapping("Date Of Birth")]: convertEpochToDate(item.dob, "dob", "-") || "-",         
      //     [getTextToLocalMapping("Retirement Date")]: convertEpochToDate(item.dateOfRetirement, "dateOfRetirement", "-") || "-",
         
      //     tenantId: item.tenantId,
         
      //    pensionerNumber:item.pensionerNumber,

         
      //   };
      // });
      // dispatch(
      //   handleField(
      //     "searchppr",
      //     "components.div.children.searchResults",
      //     "props.data",
      //     data
      //   )
      // );
      // dispatch(
      //   handleField(
      //     "searchppr",
      //     "components.div.children.searchResults",
      //     "props.title",
      //     `${getTextToLocalMapping(
      //       "Search Results for Employee"
      //     )} (${response.Pensioners.length})`
      //   )
      // );
      // showHideTable(true, dispatch);
          }
    }
      
     
      
    } catch (error) {
      //showHideProgress(false, dispatch);
      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      store.dispatch(toggleSpinner());
    }
  }
};



const showHideTable = (booleanHideOrShow, dispatch) => {

  dispatch(
    handleField(
      "searchppr",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
