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
      case "Name of Applicant":
        return getLocaleLabels(
          "Name of Applicant",
          "NULM_SEP_NAME_OF_APPLICANT",
          localisationLabels
        );
    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "NULM_SEP_APPLICATION_STATUS",
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
    case "Search Results for SEP":
      return getLocaleLabels(
        "Search Results for SEP",
        "NULM_SEP_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
    case "Contact Number":
      return getLocaleLabels(
        "Contact Number",
        "NULM_ALF_CONTACT_NUMBER",
        localisationLabels
      );
    case "Search Results for ALF":
      return getLocaleLabels(
        "Search Results for ALF",
        "NULM_ALF_SEARCH_RESULTS_TABLE_HEADING",
        localisationLabels
      );
    case "Name of ALF":
      return getLocaleLabels(
        "Name of ALF",
        "NULM_NULM_NAME_OF_ALF",
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
      getTextToLocalMapping("Application Id"),
      getTextToLocalMapping("Name of ALF"),
      // getTextToLocalMapping("Contact Number"),
      // getTextToLocalMapping("Creation Date"),
      {
        name: "code",
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for ALF"),
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
  window.location.href = `view-alf?tenantId=${tenantId}&applicationNumber=${rowData[0]}&status=${rowData[2]}`;
};


