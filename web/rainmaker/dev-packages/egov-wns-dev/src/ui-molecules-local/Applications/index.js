import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Label from "../../ui-containers-local/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { connect } from "react-redux";
import get from "lodash/get";
import {
  getLocaleLabels,
  getTransformedLocalStorgaeLabels
} from "egov-ui-framework/ui-utils/commons";
import "./index.css"

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  }
};

class Applications extends React.Component {
  getTaskDetails = data => {
    data.service = data.service.toUpperCase();
    if(data.service ==='WATER'){
      switch(data.activityType){
        case "NEW_WS_CONNECTION":  window.localStorage.setItem("wns_workflow","REGULARWSCONNECTION"); break;
        case "APPLY_FOR_TEMPORARY_CONNECTION":  window.localStorage.setItem("wns_workflow","TEMPORARY_WSCONNECTION"); break;
        case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_TEMP_TEMP"); break;
        case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_TEMP_REGULAR"); break;
        case "PERMANENT_DISCONNECTION":  window.localStorage.setItem("wns_workflow","WS_DISCONNECTION"); break;        
        case "TEMPORARY_DISCONNECTION":  window.localStorage.setItem("wns_workflow","WS_TEMP_DISCONNECTION"); break;
        case "UPDATE_CONNECTION_HOLDER_INFO":  window.localStorage.setItem("wns_workflow","WS_RENAME"); break;
        case "UPDATE_METER_INFO":  window.localStorage.setItem("wns_workflow","WS_METER_UPDATE"); break;
        case "CONNECTION_CONVERSION":  window.localStorage.setItem("wns_workflow","WS_CONVERSION"); break;
        case "REACTIVATE_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_REACTIVATE"); break;
        case "NEW_TUBEWELL_CONNECTION":  window.localStorage.setItem("wns_workflow","WS_TUBEWELL"); break;
        case "APPLY_FOR_TEMPORARY_CONNECTION_BILLING":  window.localStorage.setItem("wns_workflow","TEMPORARY_WSCONNECTION_BILLING"); break;
        //case "CONNECTION_CONVERSION":  window.localStorage.setItem("wns_workflow","WS_TUBEWELL"); break;
      }
}
else if(data.service ==='SEWERAGE'){
  window.localStorage.setItem("wns_workflow","SW_SEWERAGE");

}
if (process.env.NODE_ENV === "production") {
    window.location.href = `/citizen/wns/search-preview?applicationNumber=${data.applicationNo}&history=${true}&tenantId=${data.property.tenantId}&service=${data.service}`
}
else{
  window.location.href = `/wns/search-preview?applicationNumber=${data.applicationNo}&history=${true}&tenantId=${data.property.tenantId}&service=${data.service}`

}
  }

  titleCasingStatus = (status,activityType,applicationNo) => {
switch(activityType)
{
  case'NEW_WATER_CONNECTION':
  status = `WF_REGULARWSCONNECTION_${status}`
  break;
  case "APPLY_FOR_TEMPORARY_CONNECTION":
  status = `WF_TEMPORARY_WSCONNECTION_${status}`
  break;   
  case "WS_TUBEWELL":
  case "NEW_TUBEWELL_CONNECTION":
  status = `WF_WS_TUBEWELL_${status}`
  break;
  case "WF_SW_SEWERAGE":
  //case "NEW_TUBEWELL_CONNECTION":
  status = `WF_SW_SEWERAGE_${status}`
  break;
  case "TEMPORARY_WSCONNECTION":
    case "TEMPORARY_WSCONNECTION_BILLING":
  case "APPLY_FOR_TEMPORARY_CONNECTION":
  status = `WF_TEMPORARY_WSCONNECTION_${status}`
  break;
  case "WS_TEMP_TEMP":
  case "APPLY_FOR_TEMPORARY_TEMPORARY_CONNECTION":
  status = `WF_WS_TEMP_TEMP_${status}`
  break;
  case "WS_TEMP_REGULAR":
  case "APPLY_FOR_TEMPORARY_REGULAR_CONNECTION":
  status = `WF_WS_TEMP_REGULAR_${status}`
  break;
  case "WS_DISCONNECTION":
  case "PERMANENT_DISCONNECTION":
  status = `WF_WS_DISCONNECTION_${status}`
  break;
  case "WS_TEMP_DISCONNECTION":
  case "TEMPORARY_DISCONNECTION":
  status = `WF_WS_TEMP_DISCONNECTION_${status}`
  break;
  case "WS_RENAME":
  case "UPDATE_CONNECTION_HOLDER_INFO":
  status = `WF_WS_RENAME_${status}`
  break;
  case "WS_METER_UPDATE":
  case "UPDATE_METER_INFO":
  status = `WF_WS_METER_UPDATE_${status}`
  break;
  case "WS_CONVERSION":
  case "CONNECTION_CONVERSION":
  status = `WF_WS_CONVERSION_${status}`
  break;
  case "WS_REACTIVATE":
  case "REACTIVATE_CONNECTION":
  status = `WF_WS_REACTIVATE_${status}`
  break;
  case "NA":
    if(applicationNo.includes("SW"))
  {
    status = `WF_SW_SEWERAGE_${status}`
  }
  else
  status = status
  break;
  default:
  let splitStr = status.toLowerCase().split('_');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    status= splitStr.join(' ');
    break;

}
    const localisationLabels = getTransformedLocalStorgaeLabels();
    return getLocaleLabels(
      status,
      status,
      //"PENSION_COMMON_TABLE_COL_EMMPLOYEE_NAME",
      localisationLabels
    );
    
  }

  render() {
    const { myApplicationResults, classes } = this.props;
    return (
      <div className="application-card">
        {myApplicationResults && myApplicationResults.length > 0 ? (
          myApplicationResults.map(item => {
            return (
              <div>
                <Card className={classes.card}>
                  <CardContent>
                    <div>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_SERVICE"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <LabelContainer
                            labelName={item.service}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_APPLICATION_NO"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <LabelContainer
                            labelName={item.applicationNo}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_OWNER_NAME"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          {item.property && item.property.owners&&
                          <LabelContainer
                          labelName={item.property.owners.map(owner =>owner.name).join(", ")}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />

                          }
                          
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_DUE"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <Label
                            labelName={item.due}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey="WS_MYCONNECTIONS_STATUS"
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={8} xs={6}>
                          <Label
                            labelName={this.titleCasingStatus(item.applicationStatus,item.activityType,item.applicationNo)}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                          />
                        </Grid>
                      </Grid>
                      <div className="linkStyle" onClick={() => this.getTaskDetails(item)}>
                        <LabelContainer
                          labelKey="WS_VIEW_DETAILS"
                          style={{
                            color: "#fe7a51",
                            fontSize: 14,
                          }}
                        />

                        {/* {item.due === "-" ?
                          (<div></div>)
                          : item.due === 0 ?
                            (<div> <LabelContainer
                              labelKey="WS_COMMON_PAID_LABEL"
                              style={{ color: '#008000', textTransform: 'uppercase', fontWeight: 400 }}
                            /></div>) :
                            (<div className="linkStyle" onClick={() => this.getViewBillDetails(item)}>
                              <LabelContainer
                              labelName="VIEW DETAILS"
                                // labelKey="CS_COMMON_PAY"
                                style={{
                                  color: "#fe7a51",
                                  fontSize: 14,
                                }}
                              />
                            </div>)
                        } */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        ) : (
            <div style={{
              display: "flex",
              width: "100%",
              height: "50vh",
              alignItems: 'center',
              justifyContent: "center",
              textAlign: "center"
            }}>
              <LabelContainer
                labelKey={"No results Found!"}
                style={{ marginBottom: 10 }}
              />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const myApplicationResults = get(
    state.screenConfiguration.preparedFinalObject,
    "myApplicationResults",
    []
  );
  // const myConnectionDue = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "myConnectionDue",
  //   []
  // );
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, myApplicationResults };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path))
    // handleField: (screenKey, jsonPath, fieldKey, value) =>
    //   dispatch(handleField(screenKey, jsonPath, fieldKey, value))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Applications)
); 