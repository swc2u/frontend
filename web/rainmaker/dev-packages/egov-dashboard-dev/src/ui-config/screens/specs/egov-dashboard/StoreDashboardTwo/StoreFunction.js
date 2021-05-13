import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
// import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import { getStoreIndentData, getStoreMaterialReceiptData, getStorePurchaseOrderData } from "../../../../../ui-utils/commons";

export const SearchDashboardData = async (state, dispatch) =>{

  let dashboardFilterDAta = get(
    state.screenConfiguration.preparedFinalObject,
    "dahsboardHome",
    {}
  );
  
  var reportSortBy = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.dropDownData2",{});
  var storeName = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.storeNameDefault",{});
  var selectedYear = get(state.screenConfiguration.preparedFinalObject,"dahsboardHome.selectedFinancialYearData",{});
  
  // Validation For api call
  if(reportSortBy.value === undefined ){
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "ERROR", labelKey: "DASHBOARD_FILTER_FORM_ERROR_MSG" },
        "warning"
      )
    );
  }
  else{ 

  var data = {
    "tenantId" : getTenantId(),
    "reportSortBy": reportSortBy,
    "storeName" : storeName,
    "selectedYear" : selectedYear
  }
    try {
      // API call for Description Report
      if(reportSortBy.value === "Material Issued from Store"){
        const response = await getStoreIndentData( dispatch, data );
      }else if(reportSortBy.value === "Material Received at Store"){
        const response = await getStoreMaterialReceiptData( dispatch, data );
      }else if(reportSortBy.value === "Storewise Department Requisition"){
        const response = await getStorePurchaseOrderData( dispatch, data );
      }
      

    } catch (error) {

      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};