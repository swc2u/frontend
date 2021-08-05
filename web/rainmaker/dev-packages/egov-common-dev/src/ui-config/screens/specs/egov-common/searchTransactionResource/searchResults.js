import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils"; 
export const getTextToLocalMapping = (label) => {
  const localisationLabels = getTransformedLocalStorgaeLabels();
  switch (label) {
    case "Application Id":
      return getLocaleLabels(
        "Application Id",
        "NULM_SEP_APPLICATION_ID",
        localisationLabels
      );
      case "Search Results for Transaction":
      return getLocaleLabels(
        "Search Results for Transaction",
        "COMMON_SEARCH_RESULT_TRANSACTION",
        localisationLabels
      );
      case "Consumer Transaction ID":
        return getLocaleLabels(
          "Consumer Transaction ID",
          "COMMON_TRANSACTION_ID",
          localisationLabels
        );
      case "Consumer Transaction Amount":
        return getLocaleLabels(
          "Consumer Transaction Amount",
          "COMMON_TRANSACTION_AMOUNT",
          localisationLabels
        );
      case "Consumer Transaction Status":
        return getLocaleLabels(
          "Consumer Transaction Status",
          "COMMON_TRANSACTION_STATUS",
          localisationLabels
        );
      case "Module Name":
        return getLocaleLabels(
          "Module Name",
          "COMMON_MODULE_NAME",
          localisationLabels
        );
      case "Created Date":
        return getLocaleLabels(
          "Created Date",
          "COMMON_TRANSACTION_CREATED_DATE",
          localisationLabels
        );
      case "Last Modifid Date":
        return getLocaleLabels(
          "Last Modifid Date",
          "COMMON_TRANSACTION_LAST_MODIFIES_DATE",
          localisationLabels
        );
    // case "Application Status":
    //   return getLocaleLabels(
    //     "Application Status",
    //     "NULM_SEP_APPLICATION_STATUS",
    //     localisationLabels
    //   );
    // case "Active":
    //   return getLocaleLabels(
    //     "Active",
    //     "STORE_COMMON_TABLE_COL_ACTIVE",
    //     localisationLabels
    //   );
    //   case "Creation Date":
    //   return getLocaleLabels(
    //     "Creation Date",
    //     "NULM_SEP_CREATION_DATE",
    //     localisationLabels
    //   );
    //   case "Code":
    //     return getLocaleLabels(
    //       "Code",
    //       "STORE_MATERIAL_TYPE_CODE",
    //       localisationLabels
    //     );
    // case "Search Results for SEP":
    //   return getLocaleLabels(
    //     "Search Results for SEP",
    //     "NULM_SEP_SEARCH_RESULTS_TABLE_HEADING",
    //     localisationLabels
    //   );
  }
};

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      getTextToLocalMapping("Consumer Transaction ID"),
      getTextToLocalMapping("Consumer Transaction Amount"),
      getTextToLocalMapping("Consumer Transaction Status"),
      getTextToLocalMapping("Module Name"),
      getTextToLocalMapping("Created Date"),
      getTextToLocalMapping("Last Modifid Date"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Transaction"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      // onRowClick: (row, index) => {
      //   onRowClick(row);
      // },
    },
  },
};

const onRowClick = (rowData) => {
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;
  window.location.href = `view-sep?tenantId=${tenantId}&applicationNumber=${rowData[0]}&status=${rowData[2]}`;
};


