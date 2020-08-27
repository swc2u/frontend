import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchPensionerForPensionRevision ,getSearchPensioner} from "../../../../../ui-utils/commons";
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

      // get mdmsconfiguration
      let tenantId = getTenantId();
      let mdmsBody = {
        MdmsCriteria: {
          tenantId: tenantId,
          moduleDetails: [

            { 
              moduleName: "pension", 
              masterDetails: 
              [{ name: "PensionRevisionYear" 
              },
              {
                name:"PensionRevisionMonth"
              },
              {
                name:"PensionConfig"
              },
             
            ] }
          ]
        }
      };
      let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
      
      const response = await getSearchPensioner(queryObject);
       //const response = ActionEmployee();
      
      //const ActionPensionReview_ = ActionPensionReview();      
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
      //const ActionPensionReview_ = ActionPensionReview()
      //dispatch(prepareFinalObject("ProcessInstances", response.ProcessInstances, []));
      // let ProcessInstances = [

      //   {
      //     PensionReview : ActionPensionReview_.Employees,
      //     MDMS : payload.MdmsRes
      //   }
      // ]
      let data = response.Pensioners.map(item => {
          
      
        return {
         // [getTextToLocalMapping("Action")]: get(item, "action", "-") || "-",
          
         [getTextToLocalMapping("Code")]: get(item, "code", "-") || "-", 
         [getTextToLocalMapping("Name")]: get(item, "name", "-") || "-",
          [getTextToLocalMapping("gender")]: get(item, "gender", "-") || "-", 
         // [getTextToLocalMapping("employee Status")]: get(item, "employeeStatus", "-") || "-", 
         // [getTextToLocalMapping("employee Type")]: get(item, "employeeType", "-") || "-",  
         [getTextToLocalMapping("Designation")]: getDesigName(state, get(item, "designation", "-")) || "-", 
         [getTextToLocalMapping("Department")]:
         getDeptName(state, get(item, "department", "-")) || "-",         
          [getTextToLocalMapping("Date Of Birth")]: convertEpochToDate(item.dob, "dob", "-") || "-",         
          [getTextToLocalMapping("Retirement Date")]: convertEpochToDate(item.dateOfRetirement, "dateOfRetirement", "-") || "-",
          //[getTextToLocalMapping("Appointment Date")]: convertEpochToDate(item.dateOfAppointment, "dateOfAppointment", "-") || "-",
          tenantId: item.tenantId,
          //pensionNotificationRegisterId:item.pensionNotificationRegisterId,
         // pensionEmployeeId:item.pensionEmployeeId,
         pensionerNumber:item.pensionerNumber,

         
        };
      });
      // response.ProcessInstances.push({configuration:payload.MdmsRes})
      // dispatch(prepareFinalObject("ProcessInstances", response.ProcessInstances, []));
    
      //showHideProgress(false, dispatch);
     
      dispatch(
        handleField(
          "searchppr",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "searchppr",
          "components.div.children.searchResults",
          "props.title",
          `${getTextToLocalMapping(
            "Search Results for Employee"
          )} (${response.Pensioners.length})`
        )
      );
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
