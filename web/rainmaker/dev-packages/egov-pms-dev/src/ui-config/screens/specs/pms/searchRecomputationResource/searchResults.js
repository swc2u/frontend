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
import { WFConfig} from "../../../../../ui-utils/sampleResponses";
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
      getTextToLocalMapping("Code"),    
      getTextToLocalMapping("Name"),     
      getTextToLocalMapping("Application Number"),
      getTextToLocalMapping("recomputedBusinessId"),
      getTextToLocalMapping("applicationDate"),
      // getTextToLocalMapping("Designation"),
      // getTextToLocalMapping("Department"),
    //  getTextToLocalMapping("lastModifiedDate"),     
      {
        name: "tenantId",
        options: {
          display: false
        }
      },   
      {
        name: "businessService",
        options: {
          display: false
        }
      }, 
      // {
      //   name: "id",
      //   options: {
      //     display: false
      //   }
      // }, 
    
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
let step = `WF_${rowData[8]}_CLOSE`
let pmsModule = 'RRP_SERVICE'
let  id= rowData[3];

//  identify workflow and redirect to workfloe detail page of existing application
//   move to workflow detail page
const reviewUrl =
process.env.REACT_APP_SELF_RUNNING === "true"
  ? `/egov-ui-framework/pms`
  : `/pms`;
  switch (rowData[6].toUpperCase()) {
 
    case WFConfig().businessServiceRRP:
      if(id === null)
      window.location.href = `rrpDetails?applicationNumber=${rowData[2]}&tenantId=${rowData[5]}&step=${step}`
      else
      window.location.href = `rrpDetails?applicationNumber=${rowData[2]}&tenantId=${rowData[5]}&step=${step}&id=${id}`
         break
    case WFConfig().businessServiceDOE:
      if(id === null)
      window.location.href = `doeDetails?applicationNumber=${rowData[2]}&tenantId=${rowData[5]}&step=${step}`
      else
      window.location.href = `doeDetails?applicationNumber=${rowData[2]}&tenantId=${rowData[5]}&step=${step}&id=${id}`
         break
    case WFConfig().businessServiceDOP:
      if(id === null)
      window.location.href = `dopDetails?applicationNumber=${rowData[2]}&tenantId=${rowData[5]}&step=${step}`
      else
      window.location.href = `dopDetails?applicationNumber=${rowData[2]}&tenantId=${rowData[5]}&step=${step}&id=${id}`
         break
      break;
   } 
};
