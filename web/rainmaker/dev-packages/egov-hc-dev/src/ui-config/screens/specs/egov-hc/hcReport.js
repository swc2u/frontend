import { getBreak, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, setHCRoles } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils";
import { ServiceRequestFilterFormForReport } from "./searchResource/EmployeeServiceRequestsSearchForm";
import { resetFieldsForEmployeeReport } from "./searchResource/citizenSearchFunctions";
import get from "lodash/get";
import "./index.css";
import { getTextToLocalMapping } from "../utils";
  
  const hasButton = getQueryArg(window.location.href, "hasButton");
  let enableButton = true;
  enableButton = hasButton && hasButton === "false" ? false : true;
  
  const header = getCommonHeader(
    {
    labelName: "Service Requests",
    labelKey: "HC_SERVICE_REQUEST_HEADER"
  },

  );
  
  export const serachReportGrid = {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-hc",
    componentPath: "CustomizeTable",
    id:"tableSIManageChallan",
    visible: true,
    props: {
      data: [],
      columns: [
        {
          name: getTextToLocalMapping("Service Request Id"),
          label: getTextToLocalMapping("Service Request Id"),
          options: {
            filter: true,
          }
        },
        {
          name: getTextToLocalMapping("Service Request Date"),
          label: getTextToLocalMapping("Service Request Date"),
          options: {
            filter: true,
          }
        }, {
          name: getTextToLocalMapping("Name Of Owner"),
          label: getTextToLocalMapping("Name Of Owner"),
          options: {
            filter: true,
          }
        }, {
          name: getTextToLocalMapping("Type Of Service Request"),
          label: getTextToLocalMapping("Type Of Service Request"),
          options: {
            filter: true,
          }
        }, {
          name: getTextToLocalMapping("Service Request Locality"),
          label: getTextToLocalMapping("Service Request Locality"),
          options: {
            filter: true,
            display: true,
          }
        }, {
          name: getTextToLocalMapping("Service Request Status"),
          label: getTextToLocalMapping("Service Request Status"),
          options: {
            filter: true,
          }
        }, {
          name: getTextToLocalMapping("Current Owner"),
          label: getTextToLocalMapping("Current Owner"),
          options: {
            filter: true,
            display: true,
          }
        }
      ],
      title: getTextToLocalMapping(
        "Search Results for Service Requests"
      ),
  
      options: {
        filter: true,
        viewColumns: true,
        print: true,
        download: true,
        responsive: 'scroll',
        selectableRows: false,
        disableToolbarSelect: true,
        resizableColumns: false,
        hover: true,
        filterType: 'dropdown',
        fixedHeaderOptions: {
          xAxis: false,
          yAxis: true
        },
        downloadOptions: {
          filename: "hcReport.csv",
          separator: ",",
          filterOptions: {
            useDisplayedColumnsOnly: true,
            useDisplayedRowsOnly: false,
          },
        },
        rowsPerPageOptions: [10, 15, 20],
        // onRowClick: (row, index) => {
        //   onRowClick(row);
        // },
        // onTableChange: (action, tableState) => {
          
        //   console.log(action, tableState);
        
        //   switch (action) {
        //     case 'changePage':
        //       //this.changePage(tableState.page);
        //       break;
        //   }
        // }
      },  
      customSortColumn: {
        column: "Challan No",
        sortingFn: (data, i, challanNo) => {
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

  const getMdmsData = async (dispatch) => {
  
    let tenantId = getTenantId().split(".")[0];
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants"
              }
            ]
          },
          {
            moduleName: "eg-horticulture",
            masterDetails: [
              {
                name: "ServiceType"
              },
              {
                name: "ServiceStatus"
              },
              {
                name: "roles"
              }
            ]
          },
          
          {
            moduleName: "RAINMAKER-PGR",
            masterDetails: [
              {
                name: "Sector"
              }
            ]
          },
        ]
      }
    };
    try{
      let payload = null;
      payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",  
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

      // //setting horticulture roles into mdms
      // var roleList = []
      // roleList = payload &&
      // payload.MdmsRes["eg-horticulture"].roles
      // setHCRoles(JSON.stringify(roleList))
      // const assignedToList = [{ code: "ASSIGNEDTOME", name: "Assigned To Me" },...roleList]
      // dispatch(prepareFinalObject("applyScreenMdmsData.eg-horticulture.assignedToList", assignedToList));
    }
      
      catch(e){
        console.log(e);
      }
    };

    const getEmployeeList = async (state,dispatch) => {
      try {
        let roles = get(
          state.screenConfiguration.preparedFinalObject,
          "applyScreenMdmsData['eg-horticulture'].roles",
          []
        );
        let roleList = "";
        roles.map(role => {
          roleList = roleList+","+role.code;
        })
        let payload = null;
        payload = await httpRequest(
          "post",
          "/egov-hrms/employees/_search",
          "_search",  
          [
            {
              key: "roles", value:roleList
            },
              { key: "tenantId", value: getTenantId() }
          ],
          []
        );
        var userList = []
        payload &&
          payload.Employees.map(employee =>userList.push({ code: employee.user.uuid, name: employee.user.name }));
        setHCRoles(JSON.stringify(roleList))
        const assignedToUserList = [{ code: "ASSIGNEDTOME", name: "Assigned To Me" },...userList]
        dispatch(prepareFinalObject("applyScreenMdmsData.eg-horticulture.assignedToUserList", assignedToUserList));
      }
        
        catch(e){
          console.log(e);
        }
      };
    
  const EmployeeServiceRequestsFilter = {
    uiFramework: "material-ui",
    name: "hcReport",
    beforeInitScreen: (action, state, dispatch) => {
      resetFieldsForEmployeeReport(state, dispatch);
      dispatch(prepareFinalObject("serviceRequests", {}));
      getMdmsData(dispatch).then(response => {  
        getEmployeeList(state, dispatch);
      }) 

      dispatch(
        handleField(
          "employeeServiceRequestsFilter",
          "components.div.children.serachReportGrid",
          "visible",
          false
        )
      );
      
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Form",
        props: {
          className: "common-div-css",
          id: "employeeServiceRequestsFilter"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                ...header
              },
              
            }
          },
          ServiceRequestFilterFormForReport,
          breakAfterSearch: getBreak(),
          serachReportGrid
        }
      },
        }
  };
  
  export default EmployeeServiceRequestsFilter;
  
