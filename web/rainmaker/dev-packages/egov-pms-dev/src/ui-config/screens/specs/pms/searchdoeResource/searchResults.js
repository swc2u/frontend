import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {
  getLocalization,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import { initiateRegularRetirementPension} from "../../../../../ui-utils/commons"
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../ui-utils";
import { initiateRegularRetirementPensionApiCall } from "./functions";
const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};



export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: [
     // getTextToLocalMapping("Action"),
      getTextToLocalMapping("Name"),
      getTextToLocalMapping("Code"),
      getTextToLocalMapping("Date Of Birth"),
      getTextToLocalMapping("Retirement Date"),
      getTextToLocalMapping("Designation"),
      getTextToLocalMapping("Department"),
     // getTextToLocalMapping("Code"),
      {
        name: "tenantId",
        options: {
          display: false
        }
      },
      
     
    ],
    title: getTextToLocalMapping("Search Results for Employee"),
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      onRowClick: (row, index) => {
        onRowClick(row);
      }
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



const onRowClick = rowData => {
 
  // InitiateNPWorkflow(rowData).then(response => {
  // });
  window.location.href = `applydoe?employeeID=${rowData[1]}&tenantId=${rowData[6]}`;

};

