import React from "react";
import { Card, CardContent, Grid, Typography, Button,} from "@material-ui/core";
import {
  getQueryArg,
  
} from "egov-ui-framework/ui-utils/commons";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {

  getTransformedLocale
} from "egov-ui-framework/ui-utils/commons";
import Divider from "@material-ui/core/Divider";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import get from "lodash/get";
import set from "lodash/set";
import { connect } from "react-redux";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
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

class GridDataContainer extends React.Component {

  // Construcor(props){
  //   super(props)
  //   this.state ={ open:false}
  //   this.onEditClick = this.onEditClick.bind(this)
  // }
  state = {
    open: false,
    EditOpen:false,
   AddOpen:false,
    Index:0,
    currentObjUpdate: 0,
    value:[]
  };




 
 
  
  
  
    onCalculateClick=async()=>{
    const { prepareFinalObject, toggleSnackbar, state,ProcessInstances } = this.props;
    const {open, EditOpen, AddOpen} = this.state; 
    // alert(EditOpen)
    // alert(AddOpen)
    try {  
      const tenantId = getQueryArg(window.location.href, "tenantId");
      let queryObject = [
      {
      key: "tenantId",
      value: tenantId
      }];  
      let pensionRevision = null;
      if(EditOpen)
      {
        pensionRevision = ProcessInstances[0].pensionRevision[0];
      }
      else{
        pensionRevision = ProcessInstances[0].pensionRevisionadd[0];

      }
      let response = await httpRequest(
      "post",
      "/pension-calculator/v1/_calculateRevisedPension",
      "",
      [],
      { 
        ProcessInstances: [
                            {
                            tenantId:ProcessInstances[0].tenantId,
                            pensionRevision:[pensionRevision]
                            }
                          ] 
      }
      );
      
      let payload_= get(
        response,
        "ProcessInstances[0].pensionRevision",
        []
      );
      console.log(payload_);
      prepareFinalObject("ProcessInstances[0]",payload[0])
    }
    catch (e) {
    console.log(e)
    toggleSnackbar(
    true,
    {
    labelName: "Workflow returned empty object !",
    labelKey: "WRR_WORKFLOW_ERROR"
    },
    "error"
    );
    }
  
    }



  render() {
    
    const { classes, ProcessInstances ,preparedFinalObject} = this.props;
    const { currentObjUpdate, onEditClick } = this;
    const currentObj =
    ProcessInstances && ProcessInstances[0];
    let currentObjE = currentObj//[];
    let DOE_INFO_VISIBLE = false;
    if(!this.state.EditOpen)
    {
       currentObjE = 
      ProcessInstances && ProcessInstances[0];

    }
let businessService = get(ProcessInstances[0], 'pensioner.businessService')
//alert(businessService)
if(businessService !=="RRP_SERVICE")
{
    DOE_INFO_VISIBLE = true;
}
    prepareFinalObject("ProcessInstances[0].pensionRevisiontemp[0]",currentObj)
      let showFooter=process.env.REACT_APP_NAME === "Citizen" ? false : false;
      let index = 0;
     // let jsonPath = `ProcessInstances[0].pensionRevision[${index}].dropdown.value`;
    return (
     
      <div>
        
        <Card className="">
          <CardContent>
            <Container
              children={
                <div style={{ width: "100%" }}>
                  

                  
   
            <Grid container="true" spacing={12} marginTop={16}>
            <div>
                   <div style={{ width: "100%" }}>
            <Table>
              <TableRow>
                
              <TableCell component="th" scope="row" className='Grid-th'>
                <LabelContainer
                                labelName="effectiveStartYear"
                                labelKey="PENSION_EMPLOYEE_PENSION_ESY"
                                
                              />
                  </TableCell>
                  
                  <TableCell component="th" scope="row">
                  <LabelContainer
                                labelName="effectiveEndYear"
                                labelKey="PENSION_EMPLOYEE_PENSION_EEY"
                                
                              />
                  </TableCell>
                  <TableCell component="th" scope="row">
                  <LabelContainer
                                labelName="effectiveEndMonth"
                                labelKey="PENSION_EMPLOYEE_PENSION_EEM"
                                
                              />
                  </TableCell>
                  <TableCell component="th" scope="row">
                  <LabelContainer
                                labelName="Total Pension"
                                labelKey="PENSION_PENSION_REVISION_TP"
                                
                              />
                  </TableCell>
                    </TableRow>
              <TableBody>
              {currentObjE&& currentObjE.pensionRevision.map((row, i) => {
                        return (
              <TableRow key={i} className="inbox-data-table-bodyrow">
                  <TableCell component="th" scope="row" >
                <div className="inbox-cell-text">{row.effectiveStartYear}</div>
                </TableCell>
                <TableCell component="th" scope="row">
                <div className="inbox-cell-text">{row.effectiveStartMonth}</div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                  <div className="inbox-cell-text">{row.effectiveEndYear}</div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                  <div className="inbox-cell-text">{row.effectiveEndMonth}</div>
                  </TableCell>
                  
                  <TableCell component="th" scope="row">
                    {
                      (
                        <div onClick={() => onEditClick(row,i)} style={{ cursor: "pointer" }}>
                                      <i class="material-icons icon-image-preview">create</i>
                                    </div>
                    
                      )
                    }
                  
                  </TableCell>
                

              </TableRow>
                        )
              })
            }
              </TableBody>
            </Table>
            </div>
            </div>
                  
            </Grid>


   
    
     </div>}  
            />
          </CardContent>
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
    "ProcessInstances",
    {})
  //const { workflow } = preparedFinalObject;
  //const { ProcessInstances } = workflow || [];

  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)), ProcessInstances
  };
  //return {  state,preparedFinalObject ,ProcessInstances};
  
};
const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(GridDataContainer)
);

//export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PensionReviewDataContainer))
//export default withStyles(styles)(PensionReviewDataContainer);
