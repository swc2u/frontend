import React from "react";
import { LabelContainer } from "egov-ui-framework/ui-containers";
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

function ApplicationHeaderContainer(props) {
  const { number } = props;
  const wnsHeader =  window.localStorage.getItem("wns_workflow");

let code ='WS_TASK_DETAILS'
if(wnsHeader)
{
  code = `${wnsHeader}_DETAIL_HEADER`

}
  const localisationLabels = getTransformedLocalStorgaeLabels();
  code = getLocaleLabels(
    code,
    code,
      //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
      localisationLabels
    );

  //if(wnsHeader)
    //return `${wnsHeader}_DETAIL_HEADER`;
    return <div style={styles} ><h1></h1> {code}</div>;
  
  // else
  //  // return "WS_TASK_DETAILS"
  //   return <div style={styles} ><h1>WS_TASK_DETAILS</h1> {number}</div>;
 
  
  
}

export default ApplicationHeaderContainer;
