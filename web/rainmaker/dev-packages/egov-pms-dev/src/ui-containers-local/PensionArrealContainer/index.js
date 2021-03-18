import React from "react";
import { connect } from "react-redux";
import "./index.scss";
import {
  getQueryArg,
  addWflowFileUrl,
  orderWfProcessInstances,
  getMultiUnits
} from "egov-ui-framework/ui-utils/commons";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import Label from "egov-ui-kit/utils/translationNode";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";



class PensionArrealContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );   
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };




  render() {
    const {
      pensionArrears_,
      prepareFinalObject,
      dataPath,
      moduleName
    } = this.props;
    //ProcessInstances =  ProcessInstances.reverse()
   console.log(pensionArrears_)
   console.log("ProcessInstancesptitam")
    return (
      <div>
        
        
        {
          // <div style={{ overscrollBehaviorX:"overlay",overflow:"overlay"}}>  
          <div>
             <table  id="reportTable"
                 style={{
                   width: "100%",
                   marginBottom:"20px"
                 }}
                 className="table table-striped table-bordered">
              <thead>
              <tr className="report-table-header">
              <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="Year"
                  />
                  </th>
              <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="Month"
                  />
                  </th>
                  
              <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_BP_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_DA_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_AP_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_IR_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_FMA"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_CESS_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_PD_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_TP_R"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="netDeductions"
                  />
                  </th>
                  <th   style={{ verticalAlign:"middle", textAlign: "center"}} colSpan="0">
                  <Label
                    className="report-header-row-label"
                    labelStyle={{ wordWrap: "unset", wordBreak: "unset", fontWeight: "bold", }}
                    label="PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R"
                  />
                  </th>
                  </tr>
              </thead>
              {/* <tbody>
                {
                  ProcessInstances&&(
                    ProcessInstances.map((item,i)=>{
                      return (
                        <tr>
                          <th></th>
                        </tr>
                      )
                    }))
                }
              </tbody> */}
              <tbody>
                {
                  pensionArrears_&&pensionArrears_.pensionArrears.map((item,i)=>{
                    return(
                      <tr>
                        
                        <th>{get(pensionArrears_.pensionArrears[i], `effectiveYear`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `effectiveMonth`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `basicPension`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `da`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `commutedPension`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `additionalPension`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `interimRelief`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `fma`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `miscellaneous`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `woundExtraOrdinaryPension`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `attendantAllowance`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `cess`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `pensionDeductions`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `totalPension`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `netDeductions`, "0") || "0"}</th>
                        <th>{get(pensionArrears_.pensionArrears[i], `netPension`, "0") || "0"}</th>
                      </tr>
                    )
                  }

                  )
                }
                 {/* <tr>
                  <th>M</th>
                  <th>Y</th>
                  <th>1</th>
                  <th>2</th>
                  <th>3</th>
                  <th>4</th>
                  <th>5</th>
                  <th>6</th>
                  <th>7</th>
                  <th>8</th>
                  <th>9</th>
                  <th>10</th>
                  <th>11</th>
                  <th>12</th>
                  <th>13</th>
                  <th>14</th>
                </tr> */}
              </tbody>
            </table>
            </div>
        }
       
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { pensionArrears } = preparedFinalObject;
 // const { pensionArrears } = ProcessInstances && ProcessInstances[0];
  //const { ProcessInstances } = TaskHistory || [];
  let pensionArrears_ = pensionArrears;  
  return { pensionArrears_, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(PensionArrealContainer);
