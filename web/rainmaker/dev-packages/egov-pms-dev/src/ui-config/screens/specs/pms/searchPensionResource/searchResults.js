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

const getLocalTextFromCode = localCode => {
  return JSON.parse(getLocalization("localization_en_IN")).find(
    item => item.code === localCode
  );
};

export const textToLocalMapping = {
  "Application No": getLocaleLabels(
    "Application No",
    "NOC_COMMON_TABLE_COL_APP_NO_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "NOC No": getLocaleLabels(
    "NOC No",
    "NOC_COMMON_TABLE_COL_NOC_NO_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "NOC Type": getLocaleLabels(
    "NOC Type",
    "NOC_TYPE_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "Owner Name": getLocaleLabels(
    "Owner Name",
    "NOC_COMMON_TABLE_COL_OWN_NAME_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  "Application Date": getLocaleLabels(
    "Application Date",
    "NOC_COMMON_TABLE_COL_APP_DATE_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  Status: getLocaleLabels(
    "Status",
    "NOC_COMMON_TABLE_COL_STATUS_LABEL",
    getTransformedLocalStorgaeLabels()
  ),
  INITIATED: getLocaleLabels(
    "Initiated,",
    "NOC_INITIATED",
    getTransformedLocalStorgaeLabels()
  ),
  APPLIED: getLocaleLabels(
    "Applied",
    "NOC_APPLIED",
    getTransformedLocalStorgaeLabels()
  ),
  DOCUMENTVERIFY: getLocaleLabels(
    "Pending for Document Verification",
    "WF_FIRENOC_DOCUMENTVERIFY",
    getTransformedLocalStorgaeLabels()
  ),
  APPROVED: getLocaleLabels(
    "Approved",
    "NOC_APPROVED",
    getTransformedLocalStorgaeLabels()
  ),
  REJECTED: getLocaleLabels(
    "Rejected",
    "NOC_REJECTED",
    getTransformedLocalStorgaeLabels()
  ),
  CANCELLED: getLocaleLabels(
    "Cancelled",
    "NOC_CANCELLED",
    getTransformedLocalStorgaeLabels()
  ),
  PENDINGAPPROVAL: getLocaleLabels(
    "Pending for Approval",
    "WF_FIRENOC_PENDINGAPPROVAL",
    getTransformedLocalStorgaeLabels()
  ),
  PENDINGPAYMENT: getLocaleLabels(
    "Pending payment",
    "WF_FIRENOC_PENDINGPAYMENT",
    getTransformedLocalStorgaeLabels()
  ),
  FIELDINSPECTION: getLocaleLabels(
    "Pending for Field Inspection",
    "WF_FIRENOC_FIELDINSPECTION",
    getTransformedLocalStorgaeLabels()
  ),
  "Search Results for Fire-NOC Applications": getLocaleLabels(
    "Search Results for Fire-NOC Applications",
    "NOC_HOME_SEARCH_RESULTS_TABLE_HEADING",
    getTransformedLocalStorgaeLabels()
  )
};

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [], 
    columns: [
      getTextToLocalMapping("pensionerNumber"),
      getTextToLocalMapping("Name"),
      getTextToLocalMapping("gender"),
      getTextToLocalMapping("Designation"),
      getTextToLocalMapping("Department"),
      getTextToLocalMapping("Date Of Birth"),
      getTextToLocalMapping("Retirement Date"),
     // getTextToLocalMapping("Designation"),
      {
        name: "tenantId",
        options: {
          display: false
        }
      },
      // {
      //   name: "pensionerNumber",
      //   options: {
      //     display: false
      //   }
      // },
      
    ],
    title: getTextToLocalMapping("Search Results for Pensioner"),
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

const InitiateNPWorkflow = async (rowData) => {
 
  let WFBody = {
    ProcessInstances: [
      {
          moduleName: "RRP_SERVICE",
          tenantId: rowData[4],
          businessService: "RRP_SERVICE",
          businessId: null,
          action: "INITIATE",
          comment: null,
          assignee: null,
          sla: null,
          previousStatus: null,
          applicantDetails: {
            pensionEmployeeId: rowData[6]
          },
          notificationRegister: {
          pensionNotificationRegisterId: rowData[5]
        }
      }       
  ]
  };
 
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/pension-services/v1/_processWorkflow",
      "",
      [],
      WFBody
    );
    console.log(payload.ResponseInfo.status);
    //alert(payload.ResponseInfo.status)
    
    toggleSnackbar(true, payload.ResponseInfo.status, "warning")
   
    //dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    
      toggleSnackbar(
        true,
        { labelName: "succcess", labelKey: 'error.message' },
        "error"
      )
    
    console.log(e);
  }
};

const onRowClick = rowData => { 
  // InitiateNPWorkflow(rowData).then(response => {
  // });//
  console.log(rowData);
  window.location.href = `review?pensionerNumber=${rowData[0]}`;
};