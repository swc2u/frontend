import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getQueryArg, } from "egov-ui-framework/ui-utils/commons";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
const styles = {
 
  color: "rgba(0, 0, 0, 0.87)",
  fontSize: "24px",
  fontWeight:400,
  lineheight: '1.35417em'
};

function ApplicationHeaderApplyContainer(props) {
  const { number } = props;
  const wnsHeader =  window.localStorage.getItem("wns_workflow");
  const ActionType = getQueryArg(window.location.href, "actionType");
let header ='WS_APPLY_NEW_CONNECTION_HEADER'
if(wnsHeader ||ActionType)
  {
  if(ActionType)
  {
    //let header =''
    if(ActionType ==='UPDATE_CONNECTION_HOLDER_INFO')
    {
      header = 'WS_RENAME_DETAIL_HEADER'

    }
    if(ActionType==='TEMPORARY_DISCONNECTION')
    {
      header = 'WS_TEMP_DISCONNECTION_DETAIL_HEADER'

    }
    if(ActionType==='CONNECTION_CONVERSION')
    {
      header = 'WS_CONVERSION_DETAIL_HEADER'

    }
    if(ActionType==='PERMANENT_DISCONNECTION')
    {
      header = 'WS_DISCONNECTION_DETAIL_HEADER'

    }
    if(ActionType==='UPDATE_METER_INFO')
    {
      header = 'WS_UPDATE_METER_INFO_DETAIL_HEADER'

    }
    if(ActionType==='WS_METER_TESTING' || ActionType==='APPLY_FOR_METER_TESTING' )
    {
      header = 'WS_METER_TESTING_DETAIL_HEADER'

    }
    if(ActionType==='REACTIVATE_CONNECTION')
    {
      header = 'WS_REACTIVATE_DETAIL_HEADER'

    }
    if(ActionType==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION')
    {
      header = 'WS_TEMP_TEMP_DETAIL_HEADER'

    }
    if(ActionType==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION')
    {
      header = 'WS_TEMP_REGULAR_DETAIL_HEADER'
    }
    //return header

  }
  else{
 
    const wnsHeader_ =  window.localStorage.getItem("wns_workflow");
    if(wnsHeader_)
    {
      header = `${wnsHeader_}_DETAIL_HEADER`;
    }
    else
    header = `${wnsHeader}_DETAIL_HEADER`;

  }
}
    
  else if( process.env.REACT_APP_NAME === "Citizen")
  {
    const wnsHeader_ =  window.localStorage.getItem("wns_workflow");
    const applicationNo = getQueryArg(window.location.href, "applicationNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    const ActionType = getQueryArg(window.location.href, "actionType");
    let type_ = getQueryArg(window.location.href, "type");
    if(applicationNo && tenantId)
    {
      if(wnsHeader_ || ActionType)
      {
        if(ActionType ==='UPDATE_CONNECTION_HOLDER_INFO')
        {
          header = 'WS_RENAME_DETAIL_HEADER'
    
        }
        if(ActionType==='TEMPORARY_DISCONNECTION')
        {
          header = 'WS_TEMP_DISCONNECTION_DETAIL_HEADER'
    
        }
        if(ActionType==='CONNECTION_CONVERSION')
        {
          header = 'WS_CONVERSION_DETAIL_HEADER'
    
        }
        if(ActionType==='PERMANENT_DISCONNECTION')
        {
          header = 'WS_DISCONNECTION_DETAIL_HEADER'
    
        }
        if(ActionType==='UPDATE_METER_INFO')
        {
          header = 'WS_UPDATE_METER_INFO_DETAIL_HEADER'
    
        }
        if(ActionType ==='APPLY_FOR_METER_TESTING' || ActionType ==='WS_METER_TESTING')
        {
          header = 'WS_METER_TESTING_DETAIL_HEADER'
        }
        if(ActionType==='REACTIVATE_CONNECTION')
        {
          header = 'WS_REACTIVATE_DETAIL_HEADER'
    
        }
        if(ActionType==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION')
        {
          header = 'WS_TEMP_TEMP_DETAIL_HEADER'
    
        }
        if(ActionType==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION')
        {
          header = 'WS_TEMP_REGULAR_DETAIL_HEADER'
        }
        else
        header= `${wnsHeader_}_DETAIL_HEADER`;
      }
      else 
      {
        if (applicationNo.includes("SW")) {
          header ="SW_SEWERAGE_DETAIL_HEADER_APPLY"
        }
        else
        {
          header=  "WS_APPLY_NEW_CONNECTION_HEADER"
        }
      }  
     // header=  "WS_APPLY_NEW_CONNECTION_HEADER"

    }
    else
    {
      if(type_ ==='SW')
      {
        //return  "SW_SEWERAGE_DETAIL_HEADER_APPLY"
        header=  "SW_SEWERAGE_DETAIL_HEADER_APPLY" 
      }
      else if(type_ ==='TW')
      {
       // return  "WS_TUBEWELL_DETAIL_HEADER_APPLY"
        header=  "WS_TUBEWELL_DETAIL_HEADER_APPLY" 
      }
      else
      {
       // return  "WS_WATER_DETAIL_HEADER_APPLY"
        header=  "WS_WATER_DETAIL_HEADER_APPLY" 
      }
    }
    //header=  "WS_APPLY_NEW_CONNECTION_HEADER" 

  }
    
  else
  {
    const wnsHeaderTepm =  window.localStorage.getItem("wns_workflow");
    const ActionType = getQueryArg(window.location.href, "actionType");
  if(wnsHeaderTepm || ActionType)
  {
    if(ActionType ==='UPDATE_CONNECTION_HOLDER_INFO')
        {
          header = 'WS_RENAME_DETAIL_HEADER'
    
        }
        if(ActionType==='TEMPORARY_DISCONNECTION')
        {
          header = 'WS_TEMP_DISCONNECTION_DETAIL_HEADER'
    
        }
        if(ActionType==='CONNECTION_CONVERSION')
        {
          header = 'WS_CONVERSION_DETAIL_HEADER'
    
        }
        if(ActionType==='PERMANENT_DISCONNECTION')
        {
          header = 'WS_DISCONNECTION_DETAIL_HEADER'
    
        }
        if(ActionType==='UPDATE_METER_INFO')
        {
          header = 'WS_UPDATE_METER_INFO_DETAIL_HEADER'
    
        }
        if(ActionType ==='APPLY_FOR_METER_TESTING' || ActionType ==='WS_METER_TESTING')
        {
          header = 'WS_METER_TESTING_DETAIL_HEADER'
        }
        if(ActionType==='REACTIVATE_CONNECTION')
        {
          header = 'WS_REACTIVATE_DETAIL_HEADER'
    
        }
        if(ActionType==='APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION')
        {
          header = 'WS_TEMP_TEMP_DETAIL_HEADER'
    
        }
        if(ActionType==='APPLY_FOR_TEMPORARY_REGULAR_CONNECTION')
        {
          header = 'WS_TEMP_REGULAR_DETAIL_HEADER'
        }
        else
        {
          header= `${wnsHeaderTepm}_DETAIL_HEADER`; 

        }
  }
   
  else  
  header= "WS_APPLICATION_NEW_CONNECTION_HEADER"
  }
  const localisationLabels = getTransformedLocalStorgaeLabels();
  header = getLocaleLabels(
    header,
    header,
      //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
      localisationLabels
    );

  //if(wnsHeader)
    //return `${wnsHeader}_DETAIL_HEADER`;
    return <div style={styles} ><h1></h1> {header}</div>;
  
  // else
  //  // return "WS_TASK_DETAILS"
  //   return <div style={styles} ><h1>WS_TASK_DETAILS</h1> {number}</div>;
 
  
  
}

export default ApplicationHeaderApplyContainer;
