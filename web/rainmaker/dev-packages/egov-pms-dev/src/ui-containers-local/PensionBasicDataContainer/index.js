import React from "react";
import { Card, CardContent, Grid, Typography, Button,} from "@material-ui/core";

import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,  
} from "egov-ui-framework/ui-containers";
import { withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import set from "lodash/set";
import Label from "egov-ui-kit/utils/translationNode";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { WFConfig} from "../../ui-utils/sampleResponses"

//import "./index.css";
const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    color: "#FE7A51"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class PensionBasicDataContainer extends React.Component {

  state = {
    open: false,

  };

  render() {
    
    const { classes, ProcessInstances ,preparedFinalObject,pageName} = this.props;    
    const currentObj =
    ProcessInstances && ProcessInstances[0];    
    let currentObjE = currentObj//[]; 
   let data = false 
  if(currentObjE)
  {
    if(currentObjE.pensionRegister.length === 0)

    data = true

  }
     
      
    return (     
      <div>   

         
              <Card className="">
              <Grid
                            style={{ alignItems: "center", display: "flex", marginTop: 10, paddingLeft: 20 }}
                            item
                            sm={6}
                            xs={6}
                          >
                            <Typography component="h2" variant="subheading">
                              <LabelContainer
                                labelName="Pension Register Monthly data"
                                labelKey="PENSION_REGISTER_MONTHLY_DATA"
                              />
                            </Typography>
                            <br/>
                          
                            {/* <Card textChildren={ } /> */}
                          </Grid>
                          {
                            data &&(
                              <Label labelClassName="" label="COMMON_INBOX_NO_DATA" />
                            )
                          }
             
               {
                currentObjE&& currentObjE.pensionRegister.map((row, i) => {
                  return(
                    <CardContent>
                  {
                      <Container style={{backgroundColor: "rgb(242, 242, 242)",  boxShadow: "none",borderRadius: 0, overflow: "visible"}}
                      children={
                        <div>
                          <Grid container="true" spacing={12} marginTop={16}>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_ESY" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.effectiveYear} />
                              </Typography>
                            </Grid>
                           
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_ESM" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.effectiveMonth} />
                              </Typography>
                            </Grid>
                           
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="dcrgVerified" labelKey="PENSION_EMPLOYEE_PENSION_BP_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.basicPension} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="totalPension" labelKey="PENSION_EMPLOYEE_PENSION_TP_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.totalPension} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="da" labelKey="PENSION_EMPLOYEE_PENSION_DA_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.da} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="overPayment" labelKey="PENSION_EMPLOYEE_PENSION_OVER_PAYMENT_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.overPayment} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="commutedPension" labelKey="PENSION_EMPLOYEE_PENSION_COMMMUTED_PEENSION_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.commutedPension} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="incomeTax" labelKey="PENSION_EMPLOYEE_PENSION_INCOMETAX_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.incomeTax} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="additionalPension" labelKey="PENSION_EMPLOYEE_PENSION_AP_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.additionalPension} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="cess" labelKey="PENSION_EMPLOYEE_PENSION_CESS_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.cess} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="interimRelief" labelKey="PENSION_EMPLOYEE_PENSION_IR_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.interimRelief} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="pensionDeductions" labelKey="PENSION_EMPLOYEE_PENSION_PD_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.pensionDeductions} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="fma" labelKey="PENSION_EMPLOYEE_MR_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.fma} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="netDeductions" labelKey="PENSION_EMPLOYEE_PENSION_NET_DEDUCTION_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.netDeductions} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="miscellaneous" labelKey="PENSION_EMPLOYEE_PENSION_MISCELLENOUS_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.miscellaneous} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="finalCalculatedPension" labelKey="PENSION_EMPLOYEE_PENSION_FINAL_DEDUCTION_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.finalCalculatedPension} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="woundExtraordinaryPension" labelKey="PENSION_EMPLOYEE_PENSION_WOUNDED_PENSION_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.woundExtraordinaryPension} />
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}lg={3} style={{ marginTop: 10, paddingRight: 10 ,paddingLeft: 10 }}>
                              <Typography variant="caption">
                              <LabelContainer labelName="attendantAllowance" labelKey="PENSION_EMPLOYEE_PENSION_FINAL_TEN_ALLOWANCE_R" />
                              </Typography>
                              <Typography variant="body2">
                              <LabelContainer labelName={row.attendantAllowance} />
                              </Typography>
                            </Grid>
                            </Grid>
                            </div>
                            
      
                      }  
                    />
                  } 
                    
                  </CardContent>
                      )
              })
          
            } 
      
             
              </Card>  
               
           

       
      </div>
      
    );
   
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const ProcessInstances = get(
    screenConfiguration.preparedFinalObject,
    "ProcessInstancesTempTemp",
    {})
 

  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)), ProcessInstances
  };
  
  
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),

  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PensionBasicDataContainer)
);

