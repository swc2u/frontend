import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css'
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels,
} from "egov-ui-framework/ui-utils/commons";
const localisationLabels = getTransformedLocalStorgaeLabels();
export const getTextToLocalMapping = (label) => {
  switch (label) {
    case "Consumer No":
      return getLocaleLabels(
        "Consumer No",
        "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL",
        localisationLabels
      );
    case "Application No":
      return getLocaleLabels(
        "Application No",
        "WS_COMMON_TABLE_COL_APP_NO_LABEL",
        localisationLabels
      );
    case "Application Type":
      return getLocaleLabels(
        "Application Type",
        "WS_COMMON_TABLE_COL_APP_TYPE_LABEL",
        localisationLabels
      );
    case "Owner Name":
      return getLocaleLabels(
        "Owner Name",
        "WS_COMMON_TABLE_COL_OWN_NAME_LABEL",
        localisationLabels
      );
    case "Application Status":
      return getLocaleLabels(
        "Application Status",
        "WS_COMMON_TABLE_COL_APPLICATION_STATUS_LABEL",
        localisationLabels
      );
    case "Address":
      return getLocaleLabels(
        "Address",
        "WS_COMMON_TABLE_COL_ADDRESS",
        localisationLabels
      );
    case "tenantId":
      return getLocaleLabels(
        "tenantId",
        "WS_COMMON_TABLE_COL_TENANTID_LABEL",
        localisationLabels
      );
    case "service":
      return getLocaleLabels(
        "service",
        "WS_COMMON_TABLE_COL_SERVICE_LABEL",
        localisationLabels
      );
    case "connectionType":
      return getLocaleLabels(
        "connectionType",
        "WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL",
        localisationLabels
      );
      case "Status":
        return getLocaleLabels(
          "Status",
          "WS_COMMON_TABLE_COL_STATUS_LABEL",
          localisationLabels
        );
      case "Due":
        return getLocaleLabels(
          "Due",
          "WS_COMMON_TABLE_COL_DUE_LABEL",
          localisationLabels
        );
        case "Due Date":
          return getLocaleLabels(
            "Due Date",
            "WS_COMMON_TABLE_COL_DUE_DATE_LABEL",
            localisationLabels
          );
        case "Action":
          return getLocaleLabels(
            "Action",
            "WS_COMMON_TABLE_COL_ACTION_LABEL",
            localisationLabels
          );
    case "Search Results for Water & Sewerage Application":
      return getLocaleLabels(
        "Search Results for Water & Sewerage Application",
        "WS_HOME_SEARCH_APPLICATION_RESULTS_TABLE_HEADING",
        localisationLabels
      );
  }
};

export const searchApplicationResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: getTextToLocalMapping("Consumer No"),
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[0] !== "NA" && data.rowData[0] !== null) {
              return (
                <div className="linkStyle" onClick={() => getConnectionDetails(data)}>
                  <a>{value}</a>
                </div>
              )
            } else {
              return (
                <p>{value}</p>
              )
            }
          }
        }
      },
      {
        name: getTextToLocalMapping("Application No"),
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[1] !== "NA" && data.rowData[1] !== null) {
              return (
                <div className="linkStyle" onClick={() => getApplicationDetails(data)}>
                  <a>{value}</a>
                </div>
              )
            } else {
              return (
                <p>{value}</p>
              )
            }
          }
        }
      },
      {
        name: getTextToLocalMapping("Application Type"),
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      getTextToLocalMapping("Owner Name"),
      getTextToLocalMapping("Application Status"),
      getTextToLocalMapping("Address"),
      {
        name:   getTextToLocalMapping("tenantId"),
        options: {
          display: false
        }
      },
      {
        name:  getTextToLocalMapping("service"), 
        options: {
          display: false
        }
      },
      {
        name:   getTextToLocalMapping("connectionType"),
        options: {
          display: false
        }
      }
    ],
    title: getTextToLocalMapping("Search Results for Water & Sewerage Application"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

const getApplicationDetails = data => {
  window.location.href = `search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[7]}`
}

const getConnectionDetails = data => {
  window.location.href = `connection-details?connectionNumber=${data.rowData[0]}&tenantId=${data.rowData[6]}&service=${data.rowData[7]}&connectionType=${data.rowData[8]}`
}