import React from "react";
import { Link } from "react-router-dom";
import get from "lodash/get";
import set from "lodash/set";
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
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "../../../../../ui-utils";
import { initiateRegularRetirementPensionApiCall } from "./functions";
import {
  createUpdateNPApplication,
  
} from "../../../../../ui-utils/commons";
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
      getTextToLocalMapping("Code"),    
      getTextToLocalMapping("Name"),     
     // getTextToLocalMapping("gender"),
     // getTextToLocalMapping("employee Status"),
     // getTextToLocalMapping("employee Type"),
     getTextToLocalMapping("Designation"),
     getTextToLocalMapping("Department"),
      getTextToLocalMapping("Date Of Birth"),
      getTextToLocalMapping("Retirement Date"), 
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

const InitiateNPWorkflow = async (rowData) => {
 
  let WFBody = {
    ProcessInstances: [
      {
          moduleName: "RRP_SERVICE",
          tenantId: rowData[8],
          businessService: "RRP_SERVICE",
          businessId: null,
          action: "INITIATE",
          comment: null,
          assignee: null,
          sla: null,
          previousStatus: null,
          employee: {
            pensionEmployeeId: rowData[9],
            code: rowData[10]
          },
        //   notificationRegister: {
        //   pensionNotificationRegisterId: rowData[9]
        // }
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
    alert(payload.ResponseInfo.status);
//     set(state,"screenConfiguration.preparedFinalObject.ProcessInstances[0]", WFBody.ProcessInstances);
//      payload = await createUpdateNPApplication(
//    state,
//    dispatch,
//    "INITIATE",   
//  );
    toggleSnackbar(
      true,
      { labelName: "succcess ", labelKey: 'INITIATED' },
      "warning"
    )
   
    //dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    
      toggleSnackbar(
        true,
        { labelName: "succcess", labelKey: 'error.message' },
        "error"
      )
    
  }
};

const onRowClick = rowData => {
 console.log(rowData)
 console.log("rowData")
 console.log(rowData);
 window.location.href = `applydisability?tenantId=${rowData[6]}&employeeID=${rowData[0]}`;
  // InitiateNPWorkflow(rowData).then(response => {
  // });
  // toggleSnackbarAndSetText(true, {
  //   labelName: "API error",
  //   labelKey: "ERR_API_ERROR",
  // });
};

// const onRowClick = rowData => {
//   let appendUrl =
//     process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
//   switch (rowData[get(textToLocalMapping, "Status")]) {
//     case get(textToLocalMapping, "APPLIED"):
//     case get(textToLocalMapping, "PENDINGPAYMENT"):
//     case get(textToLocalMapping, "APPROVED"):
//     case get(textToLocalMapping, "PENDINGAPPROVAL"):
//     case get(textToLocalMapping, "FIELDINSPECTION"):
//     case get(textToLocalMapping, "REJECTED"):
//     case get(textToLocalMapping, "CANCELLED"):
//     case get(textToLocalMapping, "DOCUMENTVERIFY"):
//       return `${appendUrl}/fire-noc/search-preview?applicationNumber=${
//         rowData[get(textToLocalMapping, "Application No")]
//       }&tenantId=${rowData["tenantId"]}`;

//     case get(textToLocalMapping, "INITIATED"):
//       return `${appendUrl}/fire-noc/apply?applicationNumber=${
//         rowData[get(textToLocalMapping, "Application No")]
//       }&tenantId=${rowData.tenantId}`;

//     default:
//       return `${appendUrl}/fire-noc/search`;
//   }
// };
