import React from "react";
import {
  getCommonHeader,
  getLabel,
  getBreak
} from "egov-ui-framework/ui-config/screens/specs/utils";
import store from "ui-redux/store";
import {
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
  toggleSpinner,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";

import {
  getAccessToken,
  getTenantId
} from "egov-ui-kit/utils/localStorageUtils";
import {  
  ActionNotification,
  ActionAPICheck
  } from "../../../../ui-utils/sampleResponses";

  import { getuserevents} from '../../../../ui-utils/commons'
import {searchResults} from './notificationResource/searchResults'
import { validateFields, getTextToLocalMapping } from "../utils"
const header = getCommonHeader({
  labelName: "pension Claim/release",
  labelKey: "PENSION_NOTIFICATION_HEADER"
});
const getNotification = async (action, state, dispatch) => {
  const tenantId = getTenantId();// getQueryArg(window.location.href, "tenantId");
  const recepients = getAccessToken();//"52bb4f29-922a-4ba1-b3f1-33cfff16cd7e";// getQueryArg( window.location.href,"applicationNumber");  
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  // queryObject.push({
  //   key: "recepients",
  //   value: recepients
  // });
  queryObject.push({
    key: "roles",
    value: "PENSION_DDO"
  });
 // quer//
  let checkapicall = ActionAPICheck();
  let response = null
  try {
    if(checkapicall.APILocalHost ===true)
    {
      response = ActionNotification(); 
    }
    else
    {
       response = await getuserevents(queryObject)
    }
   // businessId = payload.ProcessInstances[0].assignee
   dispatch(prepareFinalObject("ProcessInstances[0].events", response.events, []));
   console.log(response)
   if(response.events.length===0)
   {
     dispatch(
           toggleSnackbar(
             true,
             { labelName: "No Records found for Input parameter", labelKey: "PENSION_NO_RECORDS_FOUND" },
             "warning"
           )
         );
        // break;
   }
   let data = response.events.map(item => { 
   

    return {
      [getTextToLocalMapping("eventType")]: get(item, "eventType", "-") || "-",
      [getTextToLocalMapping("eventCategory")]: get(item, "eventCategory", "-") || "-",
      [getTextToLocalMapping("eventname")]: get(item, "name", "-") || "-",  
      [getTextToLocalMapping("description")]: get(item, "description", "-") || "-" ,
     
    };
  });
  dispatch(
    handleField(
      "notification",
      "components.div.children.searchResults",
      "props.data",
      data
    )
  );
  dispatch(
    handleField(
      "notification",
      "components.div.children.searchResults",
      "props.title",
      `${getTextToLocalMapping(
        "Search Results for event"
      )} (${response.events.length})`
    )
  );
  showHideTable(true, dispatch);
    
   
  } catch (e) {
    
    console.log(e);
    store.dispatch(toggleSpinner());
  }
};
const getData = async (action, state, dispatch) => {
  await getNotification(action, state, dispatch);
  //alert(businessId);
};
const NotificationResult = {
  uiFramework: "material-ui",
  name: "notification",
  beforeInitScreen: (action, state, dispatch) => {
    
    getData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "notification"
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
           
          }
        },
       
        breakAfterSearch: getBreak(),
        PensionReview: {
          uiFramework: "custom-containers-local",
         // componentPath: "GridContainer",
          componentPath: "PensionReviewContainer",
          moduleName: "egov-pms",

            // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
            props: {
              dataPath: "ProcessInstances",
              moduleName: "NOTIFICATION_SERVICE",
              pageName:"NOTIFICATION"
             // updateUrl: "/tl-services/v1/_processWorkflow"
            }
        },
        //searchResults
      }
    },
   
  }
};

export default NotificationResult;

const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "notification",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};
