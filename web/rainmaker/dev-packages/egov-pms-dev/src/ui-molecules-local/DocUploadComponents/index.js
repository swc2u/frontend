import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  LabelContainer,
  DownloadFileContainer
} from "egov-ui-framework/ui-containers";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
//import "./index.css";

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

const DocUploadComponents = ({ currentObj, index }) => {
  return (
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
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Updated By"
            labelKey="PENSION_UPDATED_BY_LABEL"
          />
        </Typography>
        <Typography variant="body2">
        {/* <LabelContainer labelName={get(currentObj, "createdBy")} /> */}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={3}
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
          {/* <LabelContainer
            labelName={getCurrentStatus(get(currentObj, "state"))}
            labelKey={
              currentObj.state
              ? getCurrentStatus(get(currentObj, "state"))
              : ""
            }
          /> */}
        </Typography>
      </Grid>
    
      <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginTop: 15 }}>
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
          {/* <LabelContainer labelName={get(currentObj, "comment")} /> */}
        </Typography>
      </Grid>
      
    </Grid>
  );
};

export default DocUploadComponents;
