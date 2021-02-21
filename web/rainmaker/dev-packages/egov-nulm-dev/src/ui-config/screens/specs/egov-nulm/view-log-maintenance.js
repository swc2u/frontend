import {
    getCommonHeader,
    getLabel,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import set from "lodash/set";
  import { SUHLogMaintenanceDetails } from "./viewLogMaintenanceResource/suh-log-review";
  import { poViewFooter } from "./viewLogMaintenanceResource/footer";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { getTenantId,getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import { httpRequest } from "../../../../ui-utils";
  import { getSearchResults } from "../../../../ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import {
    handleScreenConfigurationFieldChange as handleField,
    toggleSnackbar,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import get from "lodash/get";
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let status = getQueryArg(window.location.href, "status");
  let logCode = getQueryArg(window.location.href, "code");
   const applicationNumberContainer = () => {

     return {
       uiFramework: "custom-atoms-local",
       moduleName: "egov-nulm",
       componentPath: "ApplicationNoContainer",
       props: {
         number: `${applicationNumber}`,
         visibility: "hidden"
       },
       visible: false
     };
   
 };
 const statusContainer = () => {

     return {
     uiFramework: "custom-atoms-local",
     moduleName: "egov-nulm",
     componentPath: "ApplicationStatusContainer",
     props: {
      status: `${status}`,
       visibility: "hidden"
     },
     visible: false
   };
 
};



  export const header = getCommonContainer({
    header: getCommonHeader({
      labelName: `View log Maintenance`,
      labelKey: "NULM_SUH_LOG_VIEW"
    }),
    applicationNumber: applicationNumberContainer(),
    status: statusContainer()
  });

  
  const tradeView = SUHLogMaintenanceDetails(false);
  
  const getMdmsData = async (dispatch, tenantId) => {
    const tenant = "ch"
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenant,
        moduleDetails: [
          {
            moduleName: "NULM",
            masterDetails: [
              {
                name: "SEPDocuments",
              }
            ]
          },
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      dispatch(prepareFinalObject("viewScreenMdmsData", payload.MdmsRes));
    } catch (e) {
      console.log(e);
    }
  };
 

const roleBasedValidationForFooter = () => {
  if(process.env.REACT_APP_NAME === "Employee"){
      return {};
  }
  else{ 
        return poViewFooter() ;
  }
}
const getLogDetails = async(action,state, dispatch) =>{
    
  const tenantId = process.env.REACT_APP_NAME === "Employee" ?  getTenantId() : JSON.parse(getUserInfo()).permanentCity;

  let NulmSuhLogRequest = {};
  NulmSuhLogRequest.tenantId = tenantId;
  NulmSuhLogRequest.logUuid = logCode;
  const requestBody = {NulmSuhLogRequest}
  let response = await getSearchResults([],requestBody, dispatch,"suhLog");

  if(response){   
    dispatch(prepareFinalObject("NulmSuhLogRequest", response.ResponseBody[0]));
    dispatch(prepareFinalObject("NulmSuhLogRequest.date", response.ResponseBody[0].date.split(" ")[0]));
  }
}
  const screenConfig = {
    uiFramework: "material-ui",
    name: "view-smid-org",
    beforeInitScreen: (action, state, dispatch) => {
     getLogDetails(action,state,dispatch);
    
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.applicationNumber.props.number",
        applicationNumber
      );
      set(
        action.screenConfig,
        "components.div.children.headerDiv.children.header.children.status.props.status",
        status
      );
  
      return action;
    },
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
        children: {
          headerDiv: {
            uiFramework: "custom-atoms",
            componentPath: "Container",
            children: {
              header: {
                gridDefination: {
                  xs: 12,
                  sm: 10
                },
                ...header,
              },
            }
          },
          tradeView,
          footer: roleBasedValidationForFooter(),
        }
      },
    }
  };
  
  export default screenConfig;
  