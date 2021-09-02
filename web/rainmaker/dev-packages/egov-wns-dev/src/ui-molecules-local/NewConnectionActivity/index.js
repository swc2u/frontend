import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import KeyboardRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { WNSConfigName,WNSWaterBusinessService,WNSBusinessService} from "../../ui-utils/commons";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { Link } from "react-router-dom";
import Item from "../../../../../packages/lib/egov-ui-framework/ui-atoms/Layout/Item";



const styles = theme => ({
  root: {
    margin: "2px 8px",
    backgroundColor: theme.palette.background.paper
  }
});

class NewConnectionActivity extends React.Component {

  clickHandler = (item) => {
    const {
      screenConfig,
      toggleSnackbar,
      handleField,
      setRoute,
      moduleName,
      jsonPath,
      value,
      preparedFinalObject,
    } = this.props;

    // let toggle = get(
    //   screenConfig[route.screenKey],
    //   `${route.jsonPath}.props.open`,
    //   false
    // );
   // handleField(route.screenKey, route.jsonPath, "props.open", !toggle);
  // window.location.href = "wns/apply"
  const {searchScreen} = preparedFinalObject
  const{myConnectionsCount}=preparedFinalObject
  if(item.activity ==='ACTIVITY')
  {
    if(searchScreen)
    {
      if(searchScreen.connectionNo)
      {
    //alert('pritam')
    if (process.env.NODE_ENV === "production") {
    //window.location.href = `citizen${route}`//citizen/
    let myurl = item.buttonUrl.replace('/wns/','')
    window.location.href = myurl
    }
    else{
    //window.location.href = `citizen${route}`//citizen/
    window.location.href =item.buttonUrl

    }

      }
      window.scrollTo(0, 0);
      if(myConnectionsCount>0)
      {
      
      toggleSnackbar(
        true,
        {
          labelName: "Please select Consumer No",
          labelKey: "WS_SELECT_CONNECTION_VALIDATION_MESSAGE"
        },
        "warning"
      );
      }
      if(myConnectionsCount ===0)
      {
        toggleSnackbar(
          true,
          {
            labelName: "Link your existing water connection with My Connections for further application processes",
            //labelKey: "WS_LINK_CONNECTION_MESSAGE"
            lableKey:"WS_COMMON_APPL_LINK_CONNECTION"
          },
          "warning"
        );
      }
    }
    else{
      window.scrollTo(0, 0);
      toggleSnackbar(
        true,
        {
          labelName: "Please select Consumer No",
          labelKey: "WS_SELECT_CONNECTION_VALIDATION_MESSAGE"
        },
        "warning"
      ); 

    }
   

  }
  else{
    let applyUrl = `../wns/apply?type=WATER`
    if(item.activity ==='WATER')
    {
      applyUrl = `../wns/apply`
    }
    else if(item.activity ==='SW')
    {
      applyUrl = `../wns/apply?type=SW`
    }
    else if(item.activity ==='TW')
    {
      applyUrl = `../wns/apply?type=TW`
    }
    
    //setRoute(applyUrl)
    window.location.href = applyUrl
    //dispatch(setRoute(applyUrl));
  }
  

  };
   GetWaterBusinessServiceConfig=(ModuleName)=>{
    let BusinessService = WNSWaterBusinessService().BusinessService;  
    if (BusinessService.indexOf(ModuleName) > -1) {
      return true;
    } else return false;
  }
   getRedirectUrl = (action, businessId, moduleName,ActionType,tenant) => {
  
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
   // const tenant = getQueryArg(window.location.href, "tenantId");
    
    let baseUrl = "";
    let bservice = "";
        if(this.GetWaterBusinessServiceConfig(moduleName))
        {
      baseUrl = "wns"
      
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
            
            moduleName ='REGULARWSCONNECTION'
           }
         }
         
               const buttonObj = {
                 buttonLabel: btn,
                 moduleName: moduleName,
                 tenantId: "ch.chandigarh",
                 isLast: true,
                 buttonUrl: this.getRedirectUrl("WATERMODIFY", businessId, moduleName,btn,'ch.chandigarh')
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
  validateActivityList =(preparedFinalObject)=>{
    const {
      screenConfig,
      toggleSnackbar,     
    } = this.props;
    const {myConnectionResults} = preparedFinalObject;
  let WaterConnection = myConnectionResults;
  const {searchScreen} = preparedFinalObject;
  let connectionNo = searchScreen && searchScreen.connectionNo
  let DefaultMessage = searchScreen && searchScreen.DefaultMessage
  let actions =[];
  let Action =[];
  if(connectionNo)
  {
    WaterConnection = WaterConnection.filter(x=>x.connectionNo === connectionNo)
    const applicationStatus = myConnectionResults && myConnectionResults[0].applicationStatus;
    const businessId = myConnectionResults[0].applicationNo;
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.some(item => item.code ==="CITIZEN" || item.code=== "WS_CEMP" );
    const isButtonPresent =  window.localStorage.getItem("WNS_STATUS") || false;
    const serviceType = myConnectionResults[0].service;
    if(serviceType.toUpperCase() ==='WATER')
    {
    if(roleIndex && !isButtonPresent && serviceType !== "SEWERAGE"){
      let inWorkflow = false ;
      inWorkflow = myConnectionResults.length>0 && myConnectionResults[0].inWorkflow;
      if(inWorkflow === false)
      {
        const buttonArray = this.getWNSButtonForCitizen(WaterConnection, applicationStatus, businessId,"REGULARWSCONNECTION");
            actions = actions.concat(buttonArray);
            if(actions.length>1)
            {
              Action.push(
                {
                  actions:actions,
                  data:true
                }
              )
            }
            else{
              toggleSnackbar(true,
                {
                  labelName: "Already one activity is in process",
                  labelKey: "WS_SUBACTIVITY_VALIDATION_MESSAGE"
                }, "warning" );
                Action.push(
                  {
                    actions:actions,
                    data:false
                  }
                )

            }
     
      }
      else{
        toggleSnackbar(true,
          {
            labelName: "Already one activity is in process",
            labelKey: "WS_SUBACTIVITY_VALIDATION_MESSAGE"
          }, "warning" );
          Action.push(
            {
              actions:actions,
              data:false
            }
          )
      }

    }
  }
  else
  {
    toggleSnackbar(true,
      {
        labelName: "Already one activity is in process",
        labelKey: "WS_CONNECTION_VALIDATION_MESSAGE"
      }, "warning" );
      Action.push(
        {
          actions:[],
          data:false
        }
      )

  }
  }
  else
  {
    window.scrollTo(0, 0);
    if(DefaultMessage === true)
      {
    toggleSnackbar(true,
      {
        labelName: "Please select Consumer No",
        labelKey: "WS_SELECT_CONNECTION_VALIDATION_MESSAGE"
      }, "warning" );
      
      }
      Action.push(
        {
          actions:actions,
          data:true
        }
      )

  }
  return Action;
  }
  render() {
    const { classes, items ,preparedFinalObject} = this.props;
    const {searchScreen} = preparedFinalObject
    let actions =[]; 
    actions.push(
      {
        activity:'WATER',
        action:'WS_COMMON_APPL_NEW_CONNECTION_WATER'
      },
      {
        activity:'SW',
        action:'WS_COMMON_APPL_NEW_CONNECTION_SW',
      },
      {
        activity:'TW',
        action:'WS_COMMON_APPL_NEW_CONNECTION_TW',
      }
    )
  if(preparedFinalObject)
  {

    let actions_Type = this.validateActivityList(preparedFinalObject)
    let IsValidWaterConnection = true
    if(IsValidWaterConnection === true)
    {
    if(actions_Type[0].actions.length>0)
    {
      for (let index = 0; index < actions_Type[0].actions.length; index++) {
        const element = actions_Type[0].actions[index];
        actions.push(
          {
            activity:'ACTIVITY',
          action:`WF_REGULARWSCONNECTION_${element.buttonLabel}`,
          buttonUrl:element.buttonUrl
          })
        
      }

    }
    else if(actions_Type[0].data === true)
    {
      actions.push(
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_PERMANENT_DISCONNECTION'
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_TEMPORARY_DISCONNECTION',
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_UPDATE_CONNECTION_HOLDER_INFO',
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_CONNECTION_CONVERSION'
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_APPLY_FOR_METER_TESTING',
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_REACTIVATE_CONNECTION',
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION'
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_UPDATE_METER_INFO',
        },
        {
          activity:'ACTIVITY',
          action:'WF_REGULARWSCONNECTION_APPLY_FOR_TEMPORARY_REGULAR_CONNECTION',
        }
      )

    }
  }
  

  }

    
    if(actions.length>0)
          {
            return  ( <div className={classes.root}>
              {
                actions&&(
                  actions.map((item,i)=>{
                    return(
                      <div>

                <List component="nav" onClick={() => this.clickHandler(item)}>
                <ListItem button>
                <ListItemText
                primary={
                <LabelContainer
                labelKey={item.action}
                style={{
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.8700000047683716)"
                }}
                />
                }
                />
                <ListItemSecondaryAction>
                <IconButton edge="end">
                <KeyboardRightIcon />
                </IconButton>
                </ListItemSecondaryAction>
                </ListItem>
                </List>
                <hr style={{marginTop:0,marginBottom:0}}></hr>
                </div>
                    )
                  }))

               }         
            
               
                 </div>);

          }
  }
}

const mapStateToProps = state => {
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  const moduleName = get(state.screenConfiguration, "moduleName");
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { screenConfig, moduleName ,preparedFinalObject};
};

const mapDispatchToProps = dispatch => {
  return {
    handleField: (screenKey, jsonPath, fieldKey, value) =>
      dispatch(handleField(screenKey, jsonPath, fieldKey, value)),
      toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: path => dispatch(setRoute(path)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value))
      
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewConnectionActivity)
);
