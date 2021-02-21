import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import withMobileDialog from '@material-ui/core/withMobileDialog';
import VerticalStepper from "../Stepperdocupload";
import get from "lodash/get";
const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});
export const getCurrentStatus = status => {
  switch (status) {
    case "INITIATED":
      return "Initiated";
    case "APPLIED":
      return "Pending for Document verification";
    case "FIELDINSPECTION":
      return "Pending for Field inspection";
    case "PENDINGPAYMENT":
      return "Pending payment";
    case "PENDINGAPPROVAL":
      return "Pending approval";
    case "APPROVED":
      return "Approved";
      case "PENDING_FOR_DETAILS_VERIFICATION":
        return "Pending for detail verification";
      case "PENDING_FOR_DETAILS_REVIEW":
        return "Pending for detail review";
      case "PENDING_FOR_CALCULATION":
        return "Pending for calculation";
      case "PENDING_FOR_CALCULATION_VERIFICATION ":
        return "Pending for calculation verification";
      case "PENDING_FOR_CALCULATION_APPROVAL":
        return "Pending  approval";
      case "PENDING_FOR_CALCULATION_REVIEW":
        return "Pending for calculation review";
      case "PENDING_FOR_APPROVAL":
        return "Pending approval";
      case "PENDING_FOR_LEVEL_1_AUDIT":
        return "pending for level 1 audit";
      case "PENDING_FOR_CONTINGENT_BILL_PREPARATION":
        return "Pending for contingent bill preparation"
  }
};
const DocumentDialog = props => {
  const { open, onClose, history,documentIndex,documentList } = props;
  let toOpen = false;
if(open){
	if(history == documentList[documentIndex])
		toOpen = true;
}
else{
		toOpen = false;
}
  let historytemp= history;
  //alert(Idx)
  // if(Idx!== undefined)
  // {
  //   //alert(Idx)
  //   historytemp = history[Idx]
  //   console.log(historytemp)
  //   console.log("historytemp")
  // }
 
  let fullscreen = false;
  // Fullscreen covering full mobile screen making it impossible to close dialog. Hence commenting out below line
  if (window.innerWidth <= 768) {
    fullscreen = true;
  }
  return (
    <Dialog
      fullScreen={fullscreen}
      open={toOpen}
      onClose={onClose}
      maxWidth={false}
      style={{zIndex:2000}}
    >
      <DialogContent
        children={
          <Container
            children={
              <Grid container="true" sm="12" spacing={16} marginTop={16}>
                <Grid
                  style={{ alignItems: "center", display: "flex" }}
                  item
                  sm={10}
                >
                  <Typography component="h2" variant="subheading">
                    <LabelContainer
                      labelName="Documet Upload History"
                      labelKey="PENSION_DOCUMENT_UPLOAD_HISTORY"
                    />
                  </Typography>
                  <Grid
                    item
                    sm={2}
                    style={{
                      textAlign: "right",
                      cursor: "pointer",
                      position: "absolute",
                      right: "20px"
                    }}
                    onClick={onClose}
                  >
                    <CloseIcon />
                  </Grid>
                 
                 
                </Grid>
                {/* <div style={{ width: "100%" }}>
                <Grid
      container={true}
      spacing={12}
      style={{ paddingLeft: 10, paddingBottom: 20 }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      ><Typography variant="caption">
      <LabelContainer
        labelName="Status"
        labelKey="PENSION_COMMON_TABLE_COL_STATUS"
      />
    </Typography></Grid>
      <Grid item xs={12} sm={6} md={4}  lg={2} style={{ marginTop: 15, paddingRight: 20 }} >
                <Typography variant="caption">
          <LabelContainer
            labelName="Updated By"
            labelKey="PENSION_UPDATED_BY_LABEL"
          />
        </Typography>
        </Grid>
        
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Comments"
            labelKey="PENSION_APPROVAL_CHECKLIST_COMMENTS_LABEL"
          />
        </Typography>
      </Grid>

                {history &&(
          history.map(item => {
            <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginTop: 15 }}>
            <Typography variant="body2">
            <LabelContainer  labelName={get(item, "state")} /> 
          </Typography>
          </Grid>
          
          }))}
          </Grid>
                  </div>*/}
                <VerticalStepper content={historytemp} />  
              </Grid>
            }
          />
        }
      />
    </Dialog>
  );
};

export default withStyles(styles)(withMobileDialog({breakpoint: 'xs'})(DocumentDialog));
