import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Transaction Type":
      return getLocaleLabels(
        "Transaction Type",
        "NULM_SUSV_TRANSACTION_TYPE",
        localisationLabels
      );
      case "Mode of Payment":
        return getLocaleLabels(
          "Mode of Payment",
          "NULM_SUSV_TRANSACTION_MODE_OF_PAYMENT",
          localisationLabels
        );
    case "Payment Details":
      return getLocaleLabels(
        "Payment Details",
        "NULM_SUSV_TRANSACTION_PAYMENT_DETAILS",
        localisationLabels
      );
    case "Active":
      return getLocaleLabels(
        "Active",
        "STORE_COMMON_TABLE_COL_ACTIVE",
        localisationLabels
      );
      case "Creation Date":
      return getLocaleLabels(
        "Creation Date",
        "NULM_SEP_CREATION_DATE",
        localisationLabels
      );
      case "Code":
        return getLocaleLabels(
          "Code",
          "STORE_MATERIAL_TYPE_CODE",
          localisationLabels
        );
    case "Search Results for SUSV Transaction":
      return getLocaleLabels(
        "Search Results for SUSV Transaction",
        "NULM_SUSV_TRANSACTION_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
  }
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("Transaction Type"),
      getTextToLocalMapping("Mode of Payment"),
      getTextToLocalMapping("Payment Details"),
      getTextToLocalMapping("Creation Date"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for SUSV Transaction"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      },
    },
  },
};

const onRowClick = (rowData) => {
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  window.location.href = `view-susvtransaction?tenantId=${tenantId}&code=${rowData[4]}`;
};


