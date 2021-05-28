import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { showSearches } from "./searchResource/searchTabs";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchResults } from "./searchResource/searchResults";
import { searchApplicationResults } from "./searchResource/searchApplicationResults";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { resetFieldsForConnection, resetFieldsForApplication } from '../utils';
import "./index.css";
import { getRequiredDocData, showHideAdhocPopup } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { httpRequest } from "../../../../ui-utils";
const getMDMSData = async (action, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
       // { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }] },
        { moduleName: "tenant", masterDetails: [{ name: "tenants" }] },        
        {
          moduleName: "ws-services-masters", masterDetails: [            
            {name:"sectorList"},
            {name:"swSectorList"},
            
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);

    dispatch(prepareFinalObject("applyScreenMdmsData1", payload.MdmsRes));
    if(payload.MdmsRes['ws-services-masters'].sectorList !== undefined)
    dispatch(prepareFinalObject("applyScreenMdmsData1.ws-services-masters.wssectorList", payload.MdmsRes['ws-services-masters'].sectorList));
    //
  } catch (e) { console.log(e); }
};

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const queryObject = [
  { key: "tenantId", value: getTenantId() },
  { key: "businessServices", value: 'REGULARWSCONNECTION' }
];

const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    getMDMSData(action, dispatch);
    resetFieldsForConnection(state, dispatch);
    resetFieldsForApplication(state, dispatch);
    //setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  //   const businessServiceData = JSON.parse(
  //     localStorageGet("businessServiceData")
  //   );
  //   if(businessServiceData && businessServiceData[0])
  //   {
  //   if (businessServiceData[0].businessService === "REGULARWSCONNECTION" 
  //     || businessServiceData[0].businessService === "TEMPORARY_WSCONNECTION" 
  //     || businessServiceData[0].businessService === "WS_TEMP_TEMP" 
  //     || businessServiceData[0].businessService === "WS_TEMP_REGULAR" 
  //     || businessServiceData[0].businessService === "WS_DISCONNECTION" 
  //     || businessServiceData[0].businessService === "WS_TEMP_DISCONNECTION"
  //     || businessServiceData[0].businessService === "WS_CONVERSION"
  //     || businessServiceData[0].businessService === "WS_REACTIVATE"
  //     || businessServiceData[0].businessService === "WS_TUBEWELL") {
  //     const data = find(businessServiceData, { businessService: businessServiceData[0].businessService });
  //     const { states } = data || [];
  //     if (states && states.length > 0) {
  //       const status = states.map((item) => { return { code: item.state } });
  //       let applicationStatus = status.filter(item => item.code != null);
  //       applicationStatus.push(
  //         {
  //           code:"INITIATED"
  //         }
  //       )  
  //      const applicationdistStatus = applicationStatus.filter((n, i) => applicationStatus.indexOf(n) === i);
  //       dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatus", applicationdistStatus));
  //     }
  //   }
  // }
    const applicationType = [{ code: "NEW_WS_CONNECTION", name: "NEW_WS_CONNECTION" }, //REGULARWSCONNECTION
                              {code:"REACTIVATE_CONNECTION",name:"REACTIVATE_CONNECTION"},//WS_REACTIVATE
                              {code:"CONNECTION_CONVERSION",name:"CONNECTION_CONVERSION"},//WS_CONVERSION
                              {code:"APPLY_FOR_TEMPORARY_REGULAR_CONNECTION",name:"APPLY_FOR_TEMPORARY_REGULAR_CONNECTION"},//WS_TEMP_REGULAR
                              {code:"TEMPORARY_DISCONNECTION",name:"TEMPORARY_DISCONNECTION"},//WS_TEMP_DISCONNECTION
                              {code:"PERMANENT_DISCONNECTION",name:"PERMANENT_DISCONNECTION"},//WS_DISCONNECTION
                              {code:"UPDATE_CONNECTION_HOLDER_INFO",name:"UPDATE_CONNECTION_HOLDER_INFO"},//WS_RENAME
                              {code:"APPLY_FOR_TEMPORARY_CONNECTION",name:"APPLY_FOR_TEMPORARY_CONNECTION"},//TEMPORARY_WSCONNECTION
                              {code:"UPDATE_METER_INFO",name:"UPDATE_METER_INFO"},//WS_METER_UPDATE
                              {code:"NEW_TUBEWELL_CONNECTION",name:"NEW_TUBEWELL_CONNECTION"},//WS_TUBEWELL
                             // {code:"WS_TEMP_TEMP",name:"APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION"},
                              {code:"APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION",name:"APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION"},//WS_TEMP_TEMP
                             { code: "SW_SEWERAGE", name: "New Sewerage Connection" }]//SW_SEWERAGE
    dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationType", applicationType));

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: false,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },
              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px"
                    }
                  }
                },
                buttonLabel: getLabel({
                  labelName: "NEW APPLICATION",
                  labelKey: "WS_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  showHideAdhocPopup(state, dispatch, "search");

                }
              },
              // onClickDefination: {
              //   action: "condition",
              //   callBack: (state, dispatch) => {
              //     pageResetAndChange(state, dispatch);
              //   }
              // }
            }
          }
        },
        showSearches,
        breakAfterSearch: getBreak(),
        searchResults,
        searchApplicationResults
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default employeeSearchResults;