import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
//import {DocUploadComponents} from "../DocUploadComponents ";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getCurrentStatus } from "../TaskStatusComponents";
//import "./index.css";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});
// export const getCurrentStatus = status => {
//   switch (status) {
//     case "INITIATED":
//       return "Initiated";
//     case "APPLIED":
//       return "Pending for Document verification";
//     case "FIELDINSPECTION":
//       return "Pending for Field inspection";
//     case "PENDINGPAYMENT":
//       return "Pending payment";
//     case "PENDINGAPPROVAL":
//       return "Pending approval";
//     case "APPROVED":
//       return "Approved";
//       case "PENDING_FOR_DETAILS_VERIFICATION":
//         return "Pending for detail verification";
//       case "PENDING_FOR_DETAILS_REVIEW":
//         return "Pending for detail review";
//       case "PENDING_FOR_CALCULATION":
//         return "Pending for calculation";
//       case "PENDING_FOR_CALCULATION_VERIFICATION ":
//         return "Pending for calculation verification";
//       case "PENDING_FOR_CALCULATION_APPROVAL":
//         return "Pending  approval";
//       case "PENDING_FOR_CALCULATION_REVIEW":
//         return "Pending for calculation review";
//       case "PENDING_FOR_APPROVAL":
//         return "Pending approval";
//       case "PENDING_FOR_LEVEL_1_AUDIT":
//         return "pending for level 1 audit";
//       case "PENDING_FOR_CONTINGENT_BILL_PREPARATION":
//         return "Pending for contingent bill preparation"
//   }
// };

class VerticalLinearStepper extends React.Component {
  render() {
    const { classes, content } = this.props;

  //const documentsHistory =  Object.values(content)
console.log(content)

    return (
     
      <div className={classes.root} style={{ width: "100%" }}>
        <div >
          {
          content.documentAudit &&
          (
          content.documentAudit.map(
            (item, index) =>
              item && (

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
        lg={4}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Status"
            labelKey="PENSION_COMMON_TABLE_COL_STATUS"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
           <LabelContainer
                      labelName={item.state}
                      labelKey={
                        item.state
                      ? getCurrentStatus(item.state)
                      : ""
                      }
                    />
          
        </Typography>
      </Grid>
    
      <Grid item xs={12} sm={6} md={4} lg={4} style={{ marginTop: 15 }}>
        <Typography variant="caption">
          <LabelContainer
            labelName="Comments"
            labelKey="PENSION_APPROVAL_CHECKLIST_COMMENTS_LABEL"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          <LabelContainer
                      labelName={item.comment}
                      labelKey={
                        item.comment
                      ? item.comment
                      : ""
                      }
                    />
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={4}
        style={{ marginTop: 15, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Updated By"
            labelKey="PENSION_UPDATED_BY_LABEL"
          />
        </Typography>
        <Typography variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}>
        <LabelContainer
                      labelName={item.createdBy}
                      labelKey={
                        item.createdBy
                      ? item.createdBy
                      : ""
                      }
                    />
        </Typography>
      </Grid>
     
    </Grid>
 
              )
          ))}
        </div>
      </div>
  );
  }
}

VerticalLinearStepper.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(VerticalLinearStepper);
