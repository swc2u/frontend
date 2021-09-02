import React from "react";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar,toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, findAndReplace, getSearchResultsP, getSearchResultsForSewerage, getWorkFlowData,getBillingEstimation } from "../../../../../ui-utils/commons";
import { validateFields,getTextToLocalMapping,getTextToLocalMappingCode,GetMdmsNameBycode } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, resetFieldsForConnection } from "../../utils/index";
import { httpRequest } from "../../../../../ui-utils";
import { WNSConfigName,WNSWaterBusinessService,WNSBusinessService} from "../../../../../ui-utils/commons";
//import { getTextToLocalMapping } from "./searchApplicationResults";
//import { validateFields, getTextToLocalMapping } from "../../utils";
import { set } from "lodash";
let PERMANENT_DISCONNECTION = {
  label: {
    labelName: "Apply for permanent disconnection",
    labelKey: "WF_REGULARWSCONNECTION_PERMANENT_DISCONNECTION"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "search"
}
let TEMPORARY_DISCONNECTION = {
  label: {
    labelName: "Apply for temporary disconnection/ NDC of Government houses",
    labelKey: "WF_REGULARWSCONNECTION_TEMPORARY_DISCONNECTION"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "sellmeat-search"
}
let UPDATE_CONNECTION_HOLDER_INFO = {
  label: {
    labelName: "Apply for change in Consumer Name in Water Bill",
    labelKey: "WF_REGULARWSCONNECTION_UPDATE_CONNECTION_HOLDER_INFO"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "advertisement-search"
}
let CONNECTION_CONVERSION = {
  label: {
    labelName: "Apply for change in Tariff Type",
    labelKey: "WF_REGULARWSCONNECTION_CONNECTION_CONVERSION"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "roadcut-search"
}
let APPLY_FOR_METER_TESTING = {
  label: {
    labelName: "Apply for Meter testing",
    labelKey: "WF_REGULARWSCONNECTION_APPLY_FOR_METER_TESTING"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "roadcut-search"
}
let REACTIVATE_CONNECTION = {
  label: {
    labelName: "Apply for reconnection",
    labelKey: "WF_REGULARWSCONNECTION_REACTIVATE_CONNECTION"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "roadcut-search"
}
let APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION = {
  label: {
    labelName: "Apply for extension of temporary connection",
    labelKey: "WF_REGULARWSCONNECTION_APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "roadcut-search"
}
let UPDATE_METER_INFO = {
  label: {
    labelName: "Apply for change of Defective Meter",
    labelKey: "WF_REGULARWSCONNECTION_UPDATE_METER_INFO"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "roadcut-search"
}
let APPLY_FOR_TEMPORARY_REGULAR_CONNECTION = {
  label: {
    labelName: "Apply for change of temporary connection to regular connection",
    labelKey: "WF_REGULARWSCONNECTION_APPLY_FOR_TEMPORARY_REGULAR_CONNECTION"
  },
  icon: <i
    viewBox="0 -8 35 42"
    color="primary"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    picture_in_picture
  </i>,
  route: "roadcut-search"
}


export const searchApiCall = async (state, dispatch) => {

 
  let getCurrentTab = get(state.screenConfiguration.preparedFinalObject, "currentTab");
  let currentSearchTab = getCurrentTab === undefined ? "SEARCH_CONNECTION" : getCurrentTab;
  if (currentSearchTab === "SEARCH_CONNECTION") {
    showHideConnectionTable(false, dispatch);
    resetFieldsForApplication(state, dispatch);
    await renderSearchConnectionTable(state, dispatch);
  } else {
    showHideApplicationTable(false, dispatch);
    resetFieldsForConnection(state, dispatch);
    await renderSearchApplicationTable(state, dispatch);
  }
}
const GetBusinessServiceConfig=(ModuleName)=>{
  let BusinessService = WNSBusinessService().BusinessService;  
  if (BusinessService.indexOf(ModuleName) > -1) {
    return true;
  } else return false;
}
const GetWaterBusinessServiceConfig=(ModuleName)=>{
  let BusinessService = WNSWaterBusinessService().BusinessService;  
  if (BusinessService.indexOf(ModuleName) > -1) {
    return true;
  } else return false;
}
const getRedirectUrl = (action, businessId, moduleName,ActionType,tenant) => {

  const isAlreadyEdited = getQueryArg(window.location.href, "edited");
 // const tenant = getQueryArg(window.location.href, "tenantId");
  
  let baseUrl = "";
  let bservice = "";
      if(GetWaterBusinessServiceConfig(moduleName))
      {
    baseUrl = "wns"
    
    if(GetWaterBusinessServiceConfig(moduleName))
    {
      let  WNSConfigName_= WNSConfigName()
      bservice = WNSConfigName_.ONE_TIME_FEE_WS
    } else {
      bservice = WNSConfigName_.ONE_TIME_FEE_SW
    }
  }

  switch (action) {

    case "EDIT": return isAlreadyEdited
      ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=trueservice=WATER&actionType=${ActionType}`
      : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=editservice=WATER&actionType=${ActionType}`;
      case "WATERMODIFY":
        return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true&service=WATER&actionType=${ActionType}`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&service=WATER&actionType=${ActionType}`;
  }
};
const getWNSButtonForCitizen = (preparedFinalObject, status, businessId, moduleName) =>{   
  // const btnName = ["Apply for Regular Connection","Reactivate Connection","Connection Conversion","Temporary Disconnection","Permanent Disconnection"]
   const btnName = [
     "PERMANENT_DISCONNECTION" //R
     ,"TEMPORARY_DISCONNECTION"
     ,"UPDATE_CONNECTION_HOLDER_INFO"
     ,"CONNECTION_CONVERSION"//R
     ,"APPLY_FOR_METER_TESTING"//R
     ,"REACTIVATE_CONNECTION" //tep close
     ,"APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION"//T
     ,"UPDATE_METER_INFO"//T,R
     ,"APPLY_FOR_TEMPORARY_REGULAR_CONNECTION"];
       

     let actions  = btnName.map(btn => {

       if(preparedFinalObject)
       {
         //set module based on subactivity if new subactivity added the required change
         const WaterConnection = preparedFinalObject;
           if(WaterConnection.length>0)
           {
          //  switch(WaterConnection[0].activityType)
          //  {
          //    case'APPLY_FOR_TEMPORARY_CONNECTION':
          //    case 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION':
          //    case 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION':
          //    case 'APPLY_FOR_TEMPORARY_CONNECTION_BILLING':
          //    moduleName ='TEMPORARY_WSCONNECTION'
          //    break;
          //    case "NEW_WS_CONNECTION":
          //    moduleName ="REGULARWSCONNECTION"
          //    break;
          //    default:
          //    
          //    break
          //  }
          moduleName ='REGULARWSCONNECTION'
         }
       }
       // const btnName = ["UPDATE_CONNECTION_HOLDER_INFO",
       // "TEMPORARY_DISCONNECTION",
       // "CONNECTION_CONVERSION",
       // "PERMANENT_DISCONNECTION",
       // "REACTIVATE_CONNECTION",
       // "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION",
       // "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION"];
       // if(btnName.includes(btn))
       //    moduleName = btn;
             const buttonObj = {
               buttonLabel: btn,
               moduleName: moduleName,
               tenantId: "ch.chandigarh",
               isLast: true,
               buttonUrl: getRedirectUrl("WATERMODIFY", businessId, moduleName,btn,'ch.chandigarh')
             }

             return buttonObj;
           });

           //logic based on conditions  preparedFinalObject
           // filer subactivity in tacke acion button in connection details page
           const WaterConnection = preparedFinalObject;
           let inWorkflow = false ;
           inWorkflow = WaterConnection.length>0 && WaterConnection[0].inWorkflow;
           const connectionUsagesType = WaterConnection.length>0 && WaterConnection[0].connectionUsagesType;
           if(inWorkflow){
             actions = [];
           }
          // else if(status === "CONNECTION_ACTIVATED" && WaterConnection[0].waterApplicationType==='REGULAR')
          else if((status == "CONNECTION_ACTIVATED"
          || status == "NA" 
          || status =='CONNECTION_TYPE_CHANGED'
          || status == 'CONNECTION_UPDATED'
          || status ==='CONNECTION_REACTIVATED') && (WaterConnection[0].waterApplicationType==='REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
           {

             if((status ==='NA' ||status ==='CLOSE_CONNECTION' ) && WaterConnection[0].activityType==='REACTIVATE_CONNECTION' )
             {
               actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');

             }
             else{
               actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                                             && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                             &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

             }
             
           }
           //else if(status === "CONNECTION_ACTIVATED" && WaterConnection[0].waterApplicationType ==='TEMPORARY')
           else if((status === "CONNECTION_ACTIVATED" || status == "NA" || status ==='CONNECTION_EXTENDED' ||  status ==='METER_UPDATED')&& WaterConnection[0].waterApplicationType ==='TEMPORARY')
           {
             actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                                               &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                                               && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                               &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
                                              // && item.buttonLabel !=='UPDATE_METER_INFO'
                                              && item.buttonLabel !=='APPLY_FOR_METER_TESTING'
                                               &&  item.buttonLabel !== 'CONNECTION_CONVERSION');
           }
           // else if(status === "PENDING_FOR_REGULAR_CONNECTION"){//remove
           //   actions = actions.filter(item => item.buttonLabel === 'APPLY_FOR_REGULAR_INFO'); 
           // }
           else if(status === "TEMPORARY_DISCONNECTED"){
             //actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION'); 
             actions = actions.filter(item => item.buttonLabel === "TEMPORARY_CONNECTION_CLOSED"); 
           }
           else if(status && status!=='')
           {
             if((WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING') && WaterConnection[0].activityType !=='REACTIVATE_CONNECTION')
             {
               if ((status ==='CONNECTION_CLOSED'
                    || status ==='TEMPORARY_CONNECTION_CLOSED'
                    || status ==='CLOSE_CONNECTION'
                    || WaterConnection[0].status ==='Inactive'
                    )             
                    && (WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
           {
             actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');

           }
           else{
             actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
               && item.buttonLabel !=='REACTIVATE_CONNECTION'
               &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

           }
               

             }
             
             else if(WaterConnection[0].waterApplicationType === 'TEMPORARY')
             {
               actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                                               &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                                               && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                               &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
                                              // && item.buttonLabel !=='UPDATE_METER_INFO'
                                              && item.buttonLabel !=='APPLY_FOR_METER_TESTING'
                                               &&  item.buttonLabel !== 'CONNECTION_CONVERSION');

             }
             else if (WaterConnection[0] && WaterConnection[0].activityType ==='REACTIVATE_CONNECTION' && WaterConnection[0].status ==='Inactive' )
             {
               actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
             }
             else if (WaterConnection[0] && WaterConnection[0].activityType ==='REACTIVATE_CONNECTION' && status ==='REJECTED' && (WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
             {
               actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
             }

           }
           else if(((status === "TEMPORARY_CONNECTION_CLOSED" || status ==='TEMPORARY_DISCONNECTED' ||  status ==='METER_UPDATED'|| status ==='CLOSE_CONNECTION')  || (status ==='REJECTED')) && (WaterConnection[0].waterApplicationType==='REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING') )//TEMPORARY_CONNECTION_CLOSED
           {
             if(WaterConnection[0].activityType==='REACTIVATE_CONNECTION' )
             actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
             else if(status ==="TEMPORARY_CONNECTION_CLOSED" && WaterConnection[0].activityType==='TEMPORARY_DISCONNECTION' )
             {
               actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');

             }
             else if(WaterConnection[0].activityType==='CONNECTION_CONVERSION'
             || WaterConnection[0].activityType ==='UPDATE_CONNECTION_HOLDER_INFO'
             || WaterConnection[0].activityType ==='APPLY_FOR_METER_TESTING'
             || WaterConnection[0].activityType==='UPDATE_METER_INFO'
             || WaterConnection[0].activityType==='TEMPORARY_DISCONNECTION'
             || WaterConnection[0].activityType==='PERMANENT_DISCONNECTION'
             ){
                if(WaterConnection[0].waterApplicationType === 'TEMPORARY' && status ==='REJECTED')
             {
               actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                                               &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                                               && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                               &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
                                              // && item.buttonLabel !=='UPDATE_METER_INFO'
                                              && item.buttonLabel !=='APPLY_FOR_METER_TESTING'
                                               &&  item.buttonLabel !== 'CONNECTION_CONVERSION');

             }
             else if((WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING') && status ==='REJECTED')
             {
               actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                                             && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                            // && item.buttonLabel !=='UPDATE_METER_INFO'
                                             &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

             }
             else 
             {
               if(WaterConnection[0].waterApplicationType === 'TEMPORARY')
               {
                 actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                                               &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                                               && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                               &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
                                              // && item.buttonLabel !=='UPDATE_METER_INFO'
                                              && item.buttonLabel !=='APPLY_FOR_METER_TESTING'
                                               &&  item.buttonLabel !== 'CONNECTION_CONVERSION');

               }
               else if(WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING')
               {
                 actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                 && item.buttonLabel !=='REACTIVATE_CONNECTION'
                // && item.buttonLabel !=='UPDATE_METER_INFO'
                 &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

               }
               
                                             

             }
            
               

             }
             else if(WaterConnection[0].waterApplicationType === 'TEMPORARY' && status ==='REJECTED')
             {
               actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                                               &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                                               && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                               &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'
                                              // && item.buttonLabel !=='UPDATE_METER_INFO'
                                              && item.buttonLabel !=='APPLY_FOR_METER_TESTING'
                                               &&  item.buttonLabel !== 'CONNECTION_CONVERSION');

             }
             else if((WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING') && status ==='REJECTED')
             {
               actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                                             && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                            // && item.buttonLabel !=='UPDATE_METER_INFO'
                                             &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

             }
             

           }
           else if ((status ==='CONNECTION_TARIFF_CHANGED'
                    || status ==='CONNECTION_UPDATED'
                    ||status ==='METER_UPDATED' )             
                    && (WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
           {
             actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                                             && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                            // && item.buttonLabel !=='UPDATE_METER_INFO'
                                             &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

           }
           else if ((status ==='CONNECTION_CLOSED'
                    || status ==='TEMPORARY_CONNECTION_CLOSED'
                    || status ==='CLOSE_CONNECTION'
                    )             
                    && (WaterConnection[0].waterApplicationType === 'REGULAR' || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
           {
             actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');

           }
           else if (WaterConnection[0] && WaterConnection[0].activityType ==='REACTIVATE_CONNECTION' && WaterConnection[0].status ==='Inactive' )
           {
             actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
           }
           else {
             actions = []; 
           }

   return actions;
}
export const getActivityCard = async(state,dispatch)=>{
  
 // const {applicationId,applicationStatus:stat,WaterConnectionObj} = state;screenConfiguration
 dispatch(toggleSpinner());
 const {screenConfiguration} = state;
  const {preparedFinalObject , prepareFinalObject} = screenConfiguration;
  const {myConnectionResults} = preparedFinalObject;
  let WaterConnection = myConnectionResults;
  const {searchScreen} = preparedFinalObject;
  let connectionNo = searchScreen && searchScreen.connectionNo
  let DefaultMessage = searchScreen && searchScreen.DefaultMessage
  if(connectionNo)
  {
  WaterConnection = WaterConnection.filter(x=>x.connectionNo === connectionNo)
    const applicationStatus = myConnectionResults && myConnectionResults[0].applicationStatus;
    const businessId = myConnectionResults[0].applicationNo;
      const userRoles = JSON.parse(getUserInfo()).roles;
      const roleIndex = userRoles.some(item => item.code ==="CITIZEN" || item.code=== "WS_CEMP" );
      const isButtonPresent =  window.localStorage.getItem("WNS_STATUS") || false;
      const serviceType = myConnectionResults[0].service;
      let actions =[];
      let mdmsCardList = []
      if(roleIndex && !isButtonPresent && serviceType !== "SEWERAGE"){
        let inWorkflow = false ;
           inWorkflow = myConnectionResults.length>0 && myConnectionResults[0].inWorkflow;
           if(inWorkflow === false)
           {
            const buttonArray = getWNSButtonForCitizen(WaterConnection, applicationStatus, businessId,"REGULARWSCONNECTION");
            actions = actions.concat(buttonArray);
            if(actions.length>1)
            {
              let allCardList = [];
              for (let index = 0; index < actions.length; index++) {
                const element = actions[index];
                mdmsCardList.push(
                  {
                    code:`${element.moduleName}_${element.buttonLabel}`,
                    roles:[
                      {
                        code: "CITIZEN",
                      }
                    ],
                    routeCitizen:`${element.buttonUrl}`,
                  }
                )
                if(element.buttonLabel ==='PERMANENT_DISCONNECTION')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: PERMANENT_DISCONNECTION
                    }
                  )
                }
                else if(element.buttonLabel ==='TEMPORARY_DISCONNECTION')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: TEMPORARY_DISCONNECTION
                    }
                  )
                }
                else if(element.buttonLabel ==='UPDATE_CONNECTION_HOLDER_INFO')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: UPDATE_CONNECTION_HOLDER_INFO
                    }
                  )
                }
                else if(element.buttonLabel ==='CONNECTION_CONVERSION')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: CONNECTION_CONVERSION
                    }
                  )
                }
                else if(element.buttonLabel ==='APPLY_FOR_METER_TESTING')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: APPLY_FOR_METER_TESTING
                    }
                  )
                }
                else if(element.buttonLabel ==='REACTIVATE_CONNECTION')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: REACTIVATE_CONNECTION
                    }
                  )
                }
                else if(element.buttonLabel ==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION
                    }
                  )
                }
                else if(element.buttonLabel ==='UPDATE_METER_INFO')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: UPDATE_METER_INFO
                    }
                  )
                }
                else if(element.buttonLabel ==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION')
                {
                  allCardList.push(
                    {
                      code: element.buttonLabel, 
                      value: APPLY_FOR_TEMPORARY_REGULAR_CONNECTION
                    }
                  )
                }
                
              }
              
              let employeeCardList = []
  let roles = JSON.parse(getUserInfo()).roles
  mdmsCardList.map((item, index) => {
    roles.some(r => {
      if (item.roles[0].code.includes(r.code)) {
        if (employeeCardList.length > 0) {
          if (!employeeCardList.find((x) => x.code == item.code)) {
            if (JSON.parse(getUserInfo()).type === "CITIZEN") {
              allCardList[index].value.route = item.routeCitizen;
              employeeCardList.push(allCardList[index])
            } else {
              employeeCardList.push(allCardList[index])
            }
          }
        } else {
          if (JSON.parse(getUserInfo()).type === "CITIZEN") {
            allCardList[index].value.route = item.routeCitizen;
            employeeCardList.push(allCardList[index])
          } else {
            employeeCardList.push(allCardList[index])
          }
        }
      }
    })
  });

  const cards = employeeCardList.map((item, index) => {
    return item.value
  });

  // dispatch(
  //   handleField(
  //     "home1",
  //     "components.div.children.applyActivityCard",
  //     "props.items",
  //     cards
  //   )
  // );
  dispatch(toggleSpinner());
            }
            else{
              const errorMessageN = {
                labelName: "Already one activity is in process",
                labelKey:   `WS_SUBACTIVITY_VALIDATION_MESSAGE`
                //labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
              };
              dispatch(toggleSpinner());
              dispatch(toggleSnackbar(true, errorMessageN, "warning"));

            }
           }
           else
           {
            const errorMessageN = {
              labelName: "Already one activity is in process",
              labelKey:   `WS_SUBACTIVITY_VALIDATION_MESSAGE`
              //labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
            };
            dispatch(toggleSpinner());
            dispatch(toggleSnackbar(true, errorMessageN, "warning"));
           }
  
      }
    }
    else
    {
      if(DefaultMessage === true)
      {
      const errorMessageN = {
        labelName: "Please select Consumer No",
        labelKey:   `WS_SELECT_CONNECTION_VALIDATION_MESSAGE`
        //labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
      };
      dispatch(toggleSpinner());
      dispatch(toggleSnackbar(true, errorMessageN, "warning"));
    }
    }

};
// export const findAndReplace = (obj, oldValue, newValue) => {
//   Object.keys(obj).forEach(key => {
//       if ((obj[key] instanceof Object) || (obj[key] instanceof Array)) findAndReplace(obj[key], oldValue, newValue)
//       obj[key] = obj[key] === oldValue ? newValue : obj[key]
//   })
//   return obj
// }
export const deactivateConnection = async (state, dispatch) => {

  try
  {
    
    let queryObjectForUpdate = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0]");
    queryObjectForUpdate = findAndReplace(queryObjectForUpdate, "NA", null);
   if(!Number(queryObjectForUpdate.connectionExecutionDate) ||  queryObjectForUpdate.connectionExecutionDate !=='')
   {
     if(queryObjectForUpdate.connectionExecutionDate ==='1970-01-01')
     {
      set(queryObjectForUpdate, "connectionExecutionDate", 0);
     }
     else
     {
      set(queryObjectForUpdate, "connectionExecutionDate", convertDateToEpoch(queryObjectForUpdate.connectionExecutionDate));
     }
    
   }
   
   set(queryObjectForUpdate, "applicationStatus", "TEMPORARY_CONNECTION_CLOSED");
   //set(queryObjectForUpdate, "activityType", "REACTIVATE_CONNECTION");
   let inWorkflow = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].inWorkflow",false);
   //inWorkflow = true;
   if(inWorkflow === true)
   {
    const errorMessageN = {
      labelName: "Duplicate name Added",
      labelKey:   `WS_DEACTIVATION_VALIDATIONM_MESSAGE`
      //labelKey:   LocalizationCodeValueN+' '+DuplicatItem[0].duplicates
    };
    dispatch(toggleSnackbar(true, errorMessageN, "warning"));
   }
   else{
     //INDIVIDUAL.SINGLEOWNER
   set(queryObjectForUpdate, "connectionHolders[0].ownerType", "INDIVIDUAL.SINGLEOWNER");
   set(queryObjectForUpdate, "status", "Inactive");
   // set other propert as workflow service did in backend
    const payloadbillingPeriod = await httpRequest("post", "/ws-services/wc/_deactivateConnection", "", [], { WaterConnection: queryObjectForUpdate });
    let errorMessage = {
     labelName: "Connection deactivate successfully!",
     labelKey: "WS_DEACTIVATE_SUCCESS"
   };
    dispatch(toggleSnackbar(true, errorMessage, "success"));
       dispatch(
         handleField(
           "connection-details",
           "components.div.children.connectionDetails.children.cardContent.children.button.children.buttonContainer.children.Deactivate",
           {visible:false}
         )
       );
   set(
     state.screenConfiguration.screenConfig,
     "components.div.children.connectionDetails.children.cardContent.children.button.children.buttonContainer.children.Deactivate.visible",
     false
   );
 let connectionNumber =getQueryArg(window.location.href, "connectionNumber")
 let tenantId =getQueryArg(window.location.href, "tenantId")
 let service =getQueryArg(window.location.href, "service")
 let connectionType =getQueryArg(window.location.href, "connectionType")
   window.location.href = `connection-details?connectionNumber=${connectionNumber}&tenantId=${tenantId}&service=${service}&connectionType=${connectionType}&Active=${false}`

   }
   
  }
  catch(error)
        {
          dispatch(
            toggleSnackbar(
              true,
              { labelName: error.message, labelKey: error.message },
              "error"
            )
          );
          
        }
}
const renderSearchConnectionTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchConnection", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let waterMeteredDemandExipryDate = 0;
      let waterNonMeteredDemandExipryDate = 0;
      let sewerageNonMeteredDemandExpiryDate = 0;
      let payloadbillingPeriod = "";
      try {
        // Get the MDMS data for billingPeriod
        let mdmsBody = {
          MdmsCriteria: {
            tenantId: getTenantIdCommon(),
            moduleDetails: [
              { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }] },
              { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }] }
            ]
          }
        }
        //Read metered & non-metered demand expiry date and assign value.
        payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
        console.log(payloadbillingPeriod);
      } catch (err) { console.log(err) }
      let getSearchResult = getSearchResultsP(queryObject)
      let getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []
      //start loader
      //dispatch(toggleSpinner());
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = combinedSearchResults[i];
        if (element.connectionNo !== "NA" && element.connectionNo !== null) {
          let queryObjectForWaterFetchBill;
          if (element.service === "WATER") {
            // queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() },
            //  { key: "consumerCode", value: element.connectionNo },
            //  {ket:'paymentMode',value:'cash'},
            //  {ket:'isGenerateDemand',value:false}
            //  // { key: "businessService", value: "WS" }
            // ];
            queryObjectForWaterFetchBill = {billGeneration:
              {            
                consumerCode:element.connectionNo,
                tenantId:getTenantIdCommon(),
                paymentMode:'cash',
                isGenerateDemand:false,            
              }
            }
            
          } else {
            // queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() },
            //  { key: "consumerCode", value: element.connectionNo },
            //  {ket:'paymentMode',value:'cash'},
            //  {ket:'isGenerateDemand',value:false}
            //  // { key: "businessService", value: "SW" }
            // ];
            queryObjectForWaterFetchBill = {billGeneration:
              {            
                consumerCode:element.connectionNo,
                tenantId:getTenantIdCommon(),
                paymentMode:'cash',
                isGenerateDemand:false,            
              }
            }
          }

          if (element.service === "WATER" &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'] &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Metered') {
                waterMeteredDemandExipryDate = obj.demandExpiryDate;
              } else if (obj.connectionType === 'Non Metered') {
                waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
              }
            });
          }
          if (element.service === "SEWERAGE" &&
            payloadbillingPeriod &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'] &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined &&
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== null) {
            payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
              if (obj.connectionType === 'Non Metered') {
                sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
              }
            });
          }

         // let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
         try{
          let billResults = await getBillingEstimation(queryObjectForWaterFetchBill, dispatch)
          if(billResults !== undefined)
          {
            if(billResults && billResults.billGeneration.length>0)
            {
              let updatedDueDate = 0;
              // if (element.service === "WATER") {
              //   updatedDueDate = (element.connectionType === 'Metered' ?//
              //     (bill.billDetails[0].toPeriod + waterMeteredDemandExipryDate) :
              //     (bill.billDetails[0].toPeriod + waterNonMeteredDemandExipryDate));
              // } else if (element.service === "SEWERAGE") {
              //   updatedDueDate = bill[0].billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
              // }
              finalArray.push({
                //due: bill.totalAmount ===null?'':bill.totalAmount,
                due: bill.totalNetAmount ===null?'':bill.totalNetAmount,
                dueDate:bill.dueDateCash,// updatedDueDate>0? convertDateToEpoch(updatedDueDate):'',
                service: element.service,
                connectionNo: element.connectionNo,
                billGenerationId:bill.billGenerationId,
               // name: (element.property) ? element.property.owners[0].name : '',
                //status: element.status,
               // status: bill.status, 
                status: element.waterApplication.applicationStatus,               
                address: handleAddress(element),
                connectionType: element.connectionType,
                tenantId: element.tenantId,
                ActionType:element.activityType,
                ConStatus:element.status
              })
            }
            else
            {
              finalArray.push({
                due: 'NA',
                dueDate: 'NA',
                service: element.service,
                connectionNo: element.connectionNo,
                billGenerationId:0,
               // name: (element.property) ? element.property.owners[0].name : '',
               // status: "NA",//element.status,
               status: element.waterApplication.applicationStatus,
                address: handleAddress(element),
                connectionType: element.connectionType,
                tenantId: element.tenantId,
                ActionType:element.activityType,
                ConStatus:element.status
              })

            }
            // billResults && billResults.billGeneration.length>0 ? billResults.billGeneration.map(bill => {

            // }) : 

          }
          else{
            finalArray.push({
            due: 'NA',
              dueDate: 'NA',
              service: element.service,
              connectionNo: element.connectionNo,
              billGenerationId:0,
             // name: (element.property) ? element.property.owners[0].name : '',
              status: "NA",  
              status:element.waterApplication.applicationStatus,            
              address: handleAddress(element),
              connectionType: element.connectionType,
              tenantId: element.tenantId,
              ActionType:element.activityType,
              ConStatus:element.status
            })
          }
          
        }
        catch(err)
        {
          console.log(err)
        }
        }

      }
      showConnectionResults(finalArray, dispatch)
      // end loader
      //dispatch(toggleSpinner());
    } catch (err) { console.log(err) }
  }
}

const renderSearchApplicationTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchScreen", {});
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.wnsApplication.children.cardContent.children.wnsApplicationContainer.children",
    state,
    dispatch,
    "search"
  );
  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(toggleSnackbar(true, { labelKey: "ERR_WS_FILL_ATLEAST_ONE_FIELD" }, "warning"));
  } else if (
    (searchScreenObject["fromDate"] === undefined || searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined && searchScreenObject["toDate"].length !== 0) {
    dispatch(toggleSnackbar(true, { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      if (searchScreenObject.hasOwnProperty(key) && searchScreenObject[key].trim() !== "") {
        if (key === "fromDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "daystart") });
        } else if (key === "toDate") {
          queryObject.push({ key: key, value: convertDateToEpoch(searchScreenObject[key], "dayend") });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      let getSearchResult, getSearchResultForSewerage;
      if (searchScreenObject.applicationType === "New Water connection") {
        getSearchResult = getSearchResultsP(queryObject)
      } else if (searchScreenObject.applicationType === "New Sewerage Connection") {
        getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      } else {
        getSearchResult = getSearchResultsP(queryObject),
          getSearchResultForSewerage = getSearchResultsForSewerage(queryObject, dispatch)
      }
      let finalArray = [];
      let searchWaterConnectionResults, searcSewerageConnectionResults;
      try { searchWaterConnectionResults = await getSearchResult } catch (error) { finalArray = []; console.log(error) }
      try { searcSewerageConnectionResults = await getSearchResultForSewerage } catch (error) { finalArray = []; console.log(error) }
      const waterConnections = searchWaterConnectionResults ? searchWaterConnectionResults.WaterConnection.map(e => { e.service = 'WATER'; return e }) : []
      const sewerageConnections = searcSewerageConnectionResults ? searcSewerageConnectionResults.SewerageConnections.map(e => { e.service = 'SEWERAGE'; return e }) : [];
      let combinedSearchResults = searchWaterConnectionResults || searcSewerageConnectionResults ? sewerageConnections.concat(waterConnections) : []

      let appNo = "";
      // let combinedWFSearchResults = [];
      // for (let i = 0; i < combinedSearchResults.length; i++) {
      //   let element = findAndReplace(combinedSearchResults[i], null, "NA");
      //   if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
      //     appNo = appNo + element.applicationNo + ",";
      //   }
      //   if (i % 50 === 0 || i === (combinedSearchResults.length - 1)) {
      //     //We are trying to fetch 50 WF objects at a time
      //     appNo = appNo.substring(0, appNo.length - 1);
      //     const queryObj = [
      //       { key: "businessIds", value: appNo },
      //       { key: "history", value: true },
      //       { key: "tenantId", value: getTenantIdCommon() }
      //     ];
      //     // let wfResponse = await getWorkFlowData(queryObj);
      //     // if (wfResponse !== null && wfResponse.ProcessInstances !== null) {
      //     //   combinedWFSearchResults = combinedWFSearchResults.concat(wfResponse.ProcessInstances);
      //     // }
      //     appNo = "";
      //   }
      // }
      /*const queryObj = [
        { key: "businessIds", value: appNo },
        { key: "history", value: true },
        { key: "tenantId", value: getTenantIdCommon() }
      ];
      let Response = await getWorkFlowData(queryObj);*/
      //dispatch(toggleSpinner());
      let stime = new Date() 
      for (let i = 0; i < combinedSearchResults.length; i++) {
        let element = findAndReplace(combinedSearchResults[i], null, "NA");
        let appStatus;
        let paidamount_ = 0;
        //let Locality = (element.property && element.property !== "NA" && element.property.address) ? element.property.address.locality.code : ""
        let Locality = ''
        if(element.waterProperty)
        {
          Locality = element.waterProperty.sectorNo
        }
        else if(element.swProperty)
        {
          Locality = element.swProperty.sectorNo
        }
        if (element.applicationNo !== "NA" && element.applicationNo !== undefined) {
          //appStatus = combinedWFSearchResults.filter(item => item.businessId.includes(element.applicationNo))[0]
         // appStatus = combinedWFSearchResults.filter(item => item.businessId === element.applicationNo)
          // appStatus = combinedWFSearchResults.filter(item => item.businessId === element.applicationNo)[0]
          // if (appStatus !== undefined && appStatus.state !== undefined) {
          //   appStatus = appStatus.state.applicationStatus;
          // } else {
          //   appStatus = "NA";
          // }
          if(element.applicationNo.includes("WS"))
          {
            appStatus = element.waterApplicationList[0].applicationStatus
            paidamount_ = (element.waterApplication.totalAmountPaid === null || element.waterApplication.totalAmountPaid ==='NA')?0:element.waterApplication.totalAmountPaid
            Locality =GetMdmsNameBycode(state, dispatch,"applyScreenMdmsData1.ws-services-masters.wssectorList",Locality) 
           // Locality = Locality;
          }
          else
          {
            appStatus = element.applicationStatus
            paidamount_ = (element.totalAmountPaid === null|| element.totalAmountPaid === "NA")?0:element.totalAmountPaid
           // Locality = Locality;
            Locality =GetMdmsNameBycode(state, dispatch,"applyScreenMdmsData1.ws-services-masters.swSectorList",Locality) 
          }
          
          // if (element.property && element.property.owners &&
          //   element.property.owners !== "NA" &&
          //   element.property.owners !== null &&
          //   element.property.owners.length > 1) {
          //   let ownerName = "";
          //   element.property.owners.forEach(ele => { ownerName = ownerName + ", " + ele.name })

          //   finalArray.push({
          //     connectionNo: element.connectionNo,
          //     applicationNo: element.applicationNo,
          //     name: ownerName.slice(2),
          //    //name: (element.connectionHolders) ? element.connectionHolders[0].name : '',
          //     applicationStatus: appStatus,
          //     address: handleAddress(element),
          //     service: element.service,
          //     connectionType: element.connectionType,
          //     tenantId: element.tenantId,
          //     ActionType:element.activityType,
          //     Sector: Locality,
          //     division:element.div,
          //     subdivision:element.subdiv,              
          //     //plotnumber:(element.property && element.property !== "NA" && element.property.address) ? element.property.address.doorNo : "",
          //     plotnumber: (element.waterProperty && element.waterProperty !== "NA")?element.waterProperty.plotNo:'NA',
          //     paidamount:paidamount_,
          //   })
          // } 
          if(element.applicationNo.includes("WS"))
          {
            //for (let i = 0; i < element.waterApplicationList.length; i++) {
              let waterApplicationList = get(element,'waterApplicationList',[])
             // waterApplicationList = waterApplicationList.filter(x=>x.applicationNo !== element.applicationNo)
              for (let j = 0; j < waterApplicationList.length; j++) {
                finalArray.push({
                  connectionNo: element.connectionNo,
                  applicationNo: waterApplicationList[j].applicationNo,
                  //name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : "",
                 // name: (element.connectionHolders) ? element.connectionHolders[0].name : '',
                  applicationStatus: waterApplicationList[j].applicationStatus,
                  address: handleAddress(element),
                  service: element.service,
                  connectionType: element.connectionType,
                  tenantId: element.tenantId,
                  ActionType:waterApplicationList[j].activityType,
                  Sector: Locality,
                  division:element.div,
                  subdivision:element.subdiv,              
                  //plotnumber:(element.property && element.property !== "NA" && element.property.address) ? element.property.address.doorNo : "",
                  plotnumber: (element.waterProperty && element.waterProperty !== "NA")?element.waterProperty.plotNo:'NA',
                  paidamount:paidamount_,
                })

              }

            //}
          }
          
          else {
            finalArray.push({
              connectionNo: element.connectionNo,
              applicationNo: element.applicationNo,
              //name: (element.property && element.property !== "NA" && element.property.owners) ? element.property.owners[0].name : "",
             // name: (element.connectionHolders) ? element.connectionHolders[0].name : '',
              applicationStatus: appStatus,
              address: handleAddress(element),
              service: element.service,
              connectionType: element.connectionType,
              tenantId: element.tenantId,
              ActionType:element.activityType,
              Sector: Locality,
              division:element.div,
              subdivision:element.subdiv,              
             // plotnumber:(element.property && element.property !== "NA" && element.property.address) ? element.property.address.doorNo : "",
             plotnumber: (element.waterProperty && element.waterProperty !== "NA")?element.waterProperty.plotNo:'NA',
              paidamount:paidamount_,
            })
          }
        }
      }
      showApplicationResults(finalArray, dispatch)
     let endtime = new Date()// console.log(new Date())
     console.log(`${endtime}_${stime}`)
      //dispatch(toggleSpinner());
    } catch (err) { console.log(err) }
  }
}

const handleAddress = (element) => {
  let city = (
    element.property &&
    element.property !== "NA" &&
    element.property.address !== undefined &&
    element.property.address.city !== undefined &&
    element.property.address.city !== null
  ) ? element.property.address.city : "";
  let localityName = (
    element.property &&
    element.property !== "NA" &&
    element.property.address.locality !== undefined &&
    element.property.address.locality !== null &&
    element.property.address.locality.name !== null
  ) ? element.property.address.locality.name : "";
return (element.connectionHolders && element.connectionHolders !== null
   && element.connectionHolders[0].correspondenceAddress) 
   ? element.connectionHolders[0].correspondenceAddress 
   : '';
  //return (city === "" && localityName === "") ? "NA" : `${localityName}, ${city}`;
}

const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};

const showHideApplicationTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "visible", booleanHideOrShow));
};

const showConnectionResults = (connections, dispatch) => {
  let data = connections.map(item => {
    return{
      [getTextToLocalMappingCode("service")]: item.service,
      [getTextToLocalMappingCode("Consumer No")]: item.connectionNo,
      //[getTextToLocalMappingCode("Owner Name")]: item.name,
      [getTextToLocalMappingCode("Status")]: item.status.split("_").join(" "),
      [getTextToLocalMappingCode("Due")]: item.due,
      [getTextToLocalMappingCode("Address")]: item.address,
      [getTextToLocalMappingCode("Due Date")]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
      [getTextToLocalMappingCode("tenantId")]: item.tenantId,
      [getTextToLocalMappingCode("connectionType")]: item.connectionType,
      [getTextToLocalMappingCode("billGenerationId")]: item.billGenerationId,
      [getTextToLocalMappingCode("ConStatus")]: item.ConStatus
    }

  });
  dispatch(handleField("search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchResults", "props.rows",
    connections.length
  ));
  showHideConnectionTable(true, dispatch);
}

const showApplicationResults = (connections, dispatch) => {
  let data = connections.map(item => {
    return{
      [getTextToLocalMappingCode("Consumer No")]: item.connectionNo,
    [getTextToLocalMappingCode("Application No")]: item.applicationNo,
   // [getTextToLocalMappingCode("Application Type")]: item.service === "WATER" ? "New Water Connection" : "New Sewerage Connection",
    [getTextToLocalMappingCode("Application Type")]: item.ActionType.split("_").join(" "),
   // [getTextToLocalMappingCode("Owner Name")]: item.name,
    [getTextToLocalMappingCode("plotnumber")]: item.plotnumber,
    [getTextToLocalMappingCode("Application Status")]: item.applicationStatus.split("_").join(" "),
    [getTextToLocalMappingCode("Address")]: item.address,
    [getTextToLocalMappingCode("tenantId")]: item.tenantId,
    [getTextToLocalMappingCode("service")]: item.service,
    [getTextToLocalMappingCode("connectionType")]: item.connectionType,
    [getTextToLocalMappingCode("ActionType")]: item.ActionType,
    [getTextToLocalMappingCode("Sector")]: item.Sector,
    [getTextToLocalMappingCode("division")]: item.division,
    [getTextToLocalMappingCode("subdivision")]: item.subdivision,
    // [getTextToLocalMappingCode("plotnumber")]: item.plotnumber,
    [getTextToLocalMappingCode("paidamount")]: item.paidamount,

    }
    // [getTextToLocalMapping("Consumer No")]: item.connectionNo,
    // [getTextToLocalMapping("Application No")]: item.applicationNo,
    // [getTextToLocalMapping("Application Type")]: item.service === "WATER" ? "New Water Connection" : "New Sewerage Connection",
    // [getTextToLocalMapping("Owner Name")]: item.name,
    // [getTextToLocalMapping("Application Status")]: item.applicationStatus.split("_").join(" "),
    // [getTextToLocalMapping("Address")]: item.address,
    // [getTextToLocalMapping("tenantId")]: item.tenantId,
    // [getTextToLocalMapping("service")]: item.service,
    // [getTextToLocalMapping("connectionType")]: item.connectionType,
    // [getTextToLocalMapping("ActionType")]: item.ActionType,
  });
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.data", data));
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "props.rows",
    connections.length
  ));
  showHideApplicationTable(true, dispatch);
}

