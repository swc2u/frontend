import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getOSBMData } from "../../../../../ui-utils/commons";

export const SearchDashboardData = async (state, dispatch) =>{

  //
  var flag_for_api_call = true
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "offset", value: "0" }
  ];
  let dashboardFilterDAta = get(
    state.screenConfiguration.preparedFinalObject,
    "dahsboardHome",
    {}
  );
  
  var def_fromDate = dashboardFilterDAta["defaultFromDate"];
  var def_toDate = dashboardFilterDAta["defaulttoDate"];
  var dateFromObject = new Date(dashboardFilterDAta["defaultFromDate"]);
  var dateToObject = new Date(dashboardFilterDAta["defaulttoDate"]);
  var fromDateNumeric = dateFromObject.getTime()  ? dateFromObject.getTime() : null;
  var toDateNumeric = dateToObject.getTime() ? dateToObject.getTime() : null;
  var reportSortBy = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
  // var reportName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.reportdefaultDropDownData",{});

  // Validation For api call
  if(fromDateNumeric === null || toDateNumeric === null || reportSortBy.value === undefined ){
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "ERROR", labelKey: "DASHBOARD_FILTER_FORM_ERROR_MSG" },
        "warning"
      )
    );
  }
  else{ 

    
    var userUUID = JSON.parse(getUserInfo()).uuid;
  var data = {
    "payload" : {
      "tenantId": getTenantId(),
      "reportName": "DescriptionReport",
      "searchParams": [
        {
          "name": "fromDate",
          "input": fromDateNumeric
        },
        {
          "name": "toDate",
          "input": toDateNumeric
        }
      ],
    },
    "reportSortBy": reportSortBy
  }
    
    try {
      // API call for Description Report
      const response = await getOSBMData( dispatch, data );

    } catch (error) {

      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};