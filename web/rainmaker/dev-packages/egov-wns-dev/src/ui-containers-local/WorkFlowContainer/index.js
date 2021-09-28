import React from "react";
import { connect } from "react-redux";
//import TaskStatusContainer from "../TaskStatusContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { Footer } from "../../ui-molecules-local";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import find from "lodash/find";
import {
  localStorageGet,
  getUserInfo
} from "egov-ui-kit/utils/localStorageUtils";
import orderBy from "lodash/orderBy";
import { getSearchResults,WNSConfigName,WNSWaterBusinessService,WNSBusinessService} from "../../ui-utils/commons";
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
const tenantId = getQueryArg(window.location.href, "tenantId");
const serviceType = getQueryArg(window.location.href, "service");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: "",
    applicationId : "",
    applicationStatus : "",
    WaterConnectionObj: [],
  };

  componentDidMount = async () => {
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNumber }];
    let payloadData = await getSearchResults(queryObject);

    const {WaterConnection} =await  payloadData
    if(WaterConnection && WaterConnection.length > 0){
      const {applicationNo,applicationStatus} = WaterConnection[0]
      this.setState({applicationId : applicationNo , applicationStatus,WaterConnectionObj:WaterConnection});
    }
  }
  GetBusinessServiceConfig=(ModuleName)=>{
    let BusinessService = WNSBusinessService().BusinessService;  
    if (BusinessService.indexOf(ModuleName) > -1) {
      return true;
    } else return false;
  }
  GetWaterBusinessServiceConfig=(ModuleName)=>{
    let BusinessService = WNSWaterBusinessService().BusinessService;  
    if (BusinessService.indexOf(ModuleName) > -1) {
      return true;
    } else return false;
  }
  getRedirectUrl = (action, businessId, moduleName,ActionType) => {

    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    
    let baseUrl = "";
    let bservice = "";
    // if (moduleName === "NewWS1" 
    //     || moduleName === "REGULARWSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION"
    //     || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
    //     || moduleName === "WS_TEMP_TEMP" 
    //     ||moduleName === "WS_TEMP_REGULAR"
    //     ||moduleName === "WS_DISCONNECTION" 
    //     ||moduleName === "WS_TEMP_DISCONNECTION"
    //     || moduleName === "WS_RENAME" 
    //     || moduleName === "WS_METER_UPDATE" 
    //     || moduleName === "WS_CONVERSION" 
    //     || moduleName === "WS_REACTIVATE" 
    //     || moduleName === "WS_TUBEWELL") 
        if(this.GetWaterBusinessServiceConfig(moduleName))
        {
      baseUrl = "wns"
      // if (moduleName === "NewWS1" 
      // || moduleName === "REGULARWSCONNECTION" 
      // || moduleName === "TEMPORARY_WSCONNECTION"
      // || moduleName === "TEMPORARY_WSCONNECTION_BILLING"
      //   || moduleName === "WS_TEMP_TEMP" 
      //   ||moduleName === "WS_TEMP_REGULAR"
      //   ||moduleName === "WS_DISCONNECTION" 
      //   ||moduleName === "WS_TEMP_DISCONNECTION"
      //   || moduleName === "WS_RENAME" 
      //   || moduleName === "WS_METER_UPDATE" 
      //   || moduleName === "WS_CONVERSION" 
      //   || moduleName === "WS_REACTIVATE"
      // || moduleName === "WS_TUBEWELL") 
      if(this.GetWaterBusinessServiceConfig(moduleName))
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


  // getHeaderName = action => {
  //   return {
  //     labelName: `${action} Application`,
  //     labelKey: `WF_${action}_APPLICATION`
  //   };
  // };

  // getEmployeeRoles = (nextAction, currentAction, moduleName) => {
  //   const businessServiceData = JSON.parse(
  //     localStorageGet("businessServiceData")
  //   );
  //   const data = find(businessServiceData, { businessService: moduleName });
  //   let roles = [];
  //   if (nextAction === currentAction) {
  //     data.states &&
  //       data.states.forEach(state => {
  //         state.actions &&
  //           state.actions.forEach(action => {
  //             roles = [...roles, ...action.roles];
  //           });
  //       });
  //   } else {
  //     const states = find(data.states, { uuid: nextAction });
  //     states &&
  //       states.actions &&
  //       states.actions.forEach(action => {
  //         roles = [...roles, ...action.roles];
  //       });
  //   }
  //   roles = [...new Set(roles)];
  //   roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
  //   return roles.toString();
  // };




  getActionIfEditable = (status, businessId, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const state = find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT", businessId, moduleName)
      };
    }
    return editAction;
  };
  getWNSButtonForCitizen = (preparedFinalObject, status, businessId, moduleName) =>{   
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
            switch(WaterConnection[0].activityType)
            {
              case'APPLY_FOR_TEMPORARY_CONNECTION':
              case 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION':
              case 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION':
              case 'APPLY_FOR_TEMPORARY_CONNECTION_BILLING':
              moduleName ='TEMPORARY_WSCONNECTION'
              break;
              case "NEW_WS_CONNECTION":
              moduleName ="REGULARWSCONNECTION"
              break;
              default:
              moduleName ='REGULARWSCONNECTION'
              break
            }
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
                buttonUrl: this.getRedirectUrl("WATERMODIFY", businessId, moduleName,btn)
              }

              return buttonObj;
            });

            //logic based on conditions  preparedFinalObject
            // filer subactivity in tacke acion button in connection details page
            const WaterConnection = preparedFinalObject;
            let inWorkflow = false ;
            inWorkflow = WaterConnection.length>0 && WaterConnection[0].inWorkflow;
            const connectionUsagesType = WaterConnection.length>0 && WaterConnection[0].connectionUsagesType;
            if(WaterConnection && WaterConnection[0])
            {             
              let waterApplicationList_ = WaterConnection[0].waterApplicationList
              waterApplicationList_ = waterApplicationList_.sort((a, b) => (a.auditDetails.lastModifiedTime > b.auditDetails.lastModifiedTime ? -1 : 1));
              WaterConnection[0].activityType = waterApplicationList_[0].activityType            
            }
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
                if (((status ==='CONNECTION_CLOSED_'
                     || status ==='TEMPORARY_CONNECTION_CLOSED'
                     || status ==='CLOSE_CONNECTION_')
                     && (WaterConnection[0].status ==='Inactive')
                     )  
                     ||
                      (
                        ((WaterConnection[0].activityType = 'REACTIVATE_CONNECTION') && (status === "REJECTED" ||status === "CANCELLED" ))
                      )            
                     && (WaterConnection[0].waterApplicationType === 'REGULAR'
                      || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
            {
              // if(WaterConnection[0].activityType ==='TEMPORARY_DISCONNECTION')
              //  {
              //   actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
              //  }
              //  else{
              //   actions =[];

              //  }
              if(WaterConnection[0].status ==='Inactive')
              {
                actions = actions.filter(item => item.buttonLabel === 'REACTIVATE_CONNECTION');
              }
              else{
                if((WaterConnection[0].waterApplicationType === 'REGULAR' 
                || WaterConnection[0].waterApplicationType === 'TEMPORARY_BILLING'))
                {
                  actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
                                            && item.buttonLabel !=='REACTIVATE_CONNECTION'
                                            && item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');
                }
                else{
                  actions = actions.filter(item => item.buttonLabel !== 'PERMANENT_DISCONNECTION' 
                            &&  item.buttonLabel !== 'TEMPORARY_DISCONNECTION'
                            && item.buttonLabel !=='REACTIVATE_CONNECTION'
                            &&  item.buttonLabel !== 'UPDATE_CONNECTION_HOLDER_INFO'                                                      
                            && item.buttonLabel !=='APPLY_FOR_METER_TESTING'
                            &&  item.buttonLabel !== 'CONNECTION_CONVERSION');

                }

              }

            }
            else{
              if(status ==='CONNECTION_CLOSED'  && (WaterConnection[0].status ==='Inactive'))
               {
                actions = []
               }
              //  actions = actions.filter(item => item.buttonLabel !== 'APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION' 
              //    && item.buttonLabel !=='REACTIVATE_CONNECTION'
              //    &&  item.buttonLabel !== 'APPLY_FOR_TEMPORARY_REGULAR_CONNECTION');

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
  prepareWorkflowContract = ( moduleName) => {
    const {
      getWNSButtonForCitizen
    } = this;
    const {applicationId,applicationStatus:stat,WaterConnectionObj} = this.state;
    console.log("workflow", applicationId , stat)
    let actions =[];
    const {preparedFinalObject} = this.props;
    const WaterConnection = WaterConnectionObj;
    const applicationStatus = stat;
    const businessId = applicationId;
      const userRoles = JSON.parse(getUserInfo()).roles;
      const roleIndex = userRoles.some(item => item.code ==="CITIZEN" || item.code=== "WS_CEMP" );
      const isButtonPresent =  window.localStorage.getItem("WNS_STATUS") || false;
      if(roleIndex && !isButtonPresent && serviceType !== "SEWERAGE"){
        const buttonArray = getWNSButtonForCitizen(WaterConnection, applicationStatus, businessId,"REGULARWSCONNECTION");
       actions = actions.concat(buttonArray);
      }
        
    return actions;
  };



  render() {
    const {
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;
    const workflowContract =  this.prepareWorkflowContract( moduleName);
     let showFooter;
      // if(moduleName==='NewWS1'
      // || moduleName==='REGULARWSCONNECTION'
      // || moduleName==='SW_SEWERAGE'
      // || moduleName === 'TEMPORARY_WSCONNECTION'
      // || moduleName ==='TEMPORARY_WSCONNECTION_BILLING'
      // || moduleName ==='WS_TEMP_TEMP'
      // || moduleName ==='WS_TEMP_REGULAR'
      // || moduleName === "WS_CONVERSION" 
      // || moduleName === "WS_DISCONNECTION" 
      // || moduleName === "WS_TEMP_DISCONNECTION"
      // || moduleName ==="WS_REACTIVATE"
      // || moduleName === "WS_RENAME" 
      // || moduleName === "WS_METER_UPDATE" 
      // || moduleName === "WS_TUBEWELL")
      if(this.GetBusinessServiceConfig(moduleName))
      {
         showFooter=true;
      }    else{
         showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : true;
      }
    return (
      <div>
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return {  preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
