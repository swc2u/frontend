
import {
  sortByEpoch,
  getEpochForDate,
  getTextToLocalMapping
} from "../../utils";
import {
  getLocalization,  
} from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    // data: [],
    columns: [
      getTextToLocalMapping("effectiveStartYear"),
      getTextToLocalMapping("effectiveStartMonth"),
     // getTextToLocalMapping("basicPension"),
      getTextToLocalMapping("totalPension"),
      getTextToLocalMapping("netDeductions"),
      getTextToLocalMapping("finalCalculatedPension"),
     
     
      
    ],
    title: getTextToLocalMapping("Search Results for Pensioner Monthly Data"),
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
  // });//
  const tenantId = getQueryArg(
    window.location.href,
    "tenantId"
  );
  const pensionerNumber = getQueryArg(
    window.location.href,
    "pensionerNumber"
  );
  console.log(rowData);
  window.location.href = `revisionDetails?pensionerNumber=${pensionerNumber}&tenantId=${tenantId}&Year=${rowData[0]}&Month=${rowData[1]}`;//&pensionerNumber=${rowData[6]}`;
//window.location.href = `applydop?employeeID=${rowData[0]}pensionerNumber&pensionerNumber=${rowData[5]}`;
};