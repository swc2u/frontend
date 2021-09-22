import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getPensionData,
    getEmpToRetirePensionData,
    getNormalPensionData,
    getDeathOfEmpPensionData, 
    getDeathPensionerPensionData } from "../../../../../ui-utils/commons";

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

  var dt = new Date();
  // var dt = new Date("06-01-2021")
  var customMonth = [];
  var customYear = dt.getFullYear();
  for(var i=0; i<=dt.getMonth(); i++){
    customMonth.push(i)
  }

  var data = {
    "tenantId" : getTenantId(),
    "reportSortBy": reportSortBy 
  }
    // 
    try {
      //
      var response = [];
      var requestBody;
      if(reportSortBy.value === "amountDisbursed"){
        // 
      var response = [];
      var requestBody;
      dispatch(prepareFinalObject("allDashboardSearchData", {"sortBy" : data.reportSortBy }));
      for(var i=0; i<customMonth.length; i++){
        requestBody = {
          "tenantId": data.tenantId,
          "reportName": "MonthlyPensionDrawn",
          "searchParams": [
          {
            "name": "Year",
            "input": customYear
          },
          {
            "name": "Month",
            "input": customMonth[i]
          }
          ],
          "reportSortBy": data.reportSortBy
        }
        response = await getPensionData( state, dispatch, requestBody );
      }

      var data = [response, requestBody.reportSortBy ]
      dispatch(
        handleField(
        "PensionDashboard",
        "components.div.children.DashboardResults",
        "props.data",
        data
        )
        );
      
      }else if(reportSortBy.value === "retireStatus"){

        // 
        var requestBody = {};
        requestBody["fromDt"] = dateFromObject.getTime();
        requestBody["toDt"] = dateToObject.getTime();
        requestBody["reportSortBy"] = reportSortBy;
        requestBody["tenantId"] = getTenantId();

        var payloadEmpToBeRetired = {
          "tenantId": requestBody.tenantId,
          "reportName": "EmployeeToBeRetired",
          "searchParams": [
            {
              "name": "fromDate",
              "input": requestBody.fromDt
            },
            {
              "name": "toDate",
              "input": requestBody.toDt
            }
          ],
        }
        var payloadNormal = {
          "tenantId": requestBody.tenantId,
          "reportName": "RegularNormalPension",
          "searchParams": [
            {
              "name": "fromDate",
              "input": requestBody.fromDt
            },
            {
              "name": "toDate",
              "input": requestBody.toDt
            }
          ],
        };
        var payloadDeathOfEmp = {
          "tenantId": requestBody.tenantId,
          "reportName": "DeathOfAnEmployee",
          "searchParams": [
            {
              "name": "fromDate",
              "input": requestBody.fromDt
            },
            {
              "name": "toDate",
              "input": requestBody.toDt
            }
          ],
        };
        var payloadDeathOfPensioner = {
          "tenantId": requestBody.tenantId,
          "reportName": "DeathOfPensioner",
          "searchParams": [
            {
              "name": "fromDate",
              "input": requestBody.fromDt
            },
            {
              "name": "toDate",
              "input": requestBody.toDt
            }
          ],
        };

        var empToBeRetiredData = await getEmpToRetirePensionData( state, dispatch, payloadEmpToBeRetired );
        var normalData = await getNormalPensionData( state, dispatch, payloadNormal );
        var deathOfEmpData = await getDeathOfEmpPensionData( state, dispatch, payloadDeathOfEmp );
        var deathOfPensionerData = await getDeathPensionerPensionData( state, dispatch, payloadDeathOfPensioner );        
        
        var response ={
          "reportHeader": empToBeRetiredData.reportResponses[0].reportHeader,
          "employeeTobeRetired": empToBeRetiredData.reportResponses[0].reportData,
          "regularPension": normalData.reportResponses[0].reportData,
          "deathofEmplyee": deathOfEmpData.reportResponses[0].reportData,
          "deathofPensioner": deathOfPensionerData.reportResponses[0].reportData,
          "criteria": requestBody
        }

        var data = [response, requestBody.reportSortBy ]
        
        dispatch(
          handleField(
          "PensionDashboard",
          "components.div.children.DashboardResults",
          "props.data",
          data
          )
        );
      }

    
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};