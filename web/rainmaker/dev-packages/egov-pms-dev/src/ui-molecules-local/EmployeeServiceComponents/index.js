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



const EmployeeServiceComponents = ({ currentObj, index }) => {
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
          <LabelContainer labelName="Date" labelKey="PENSION_DATE_LABEL" />
        </Typography>
        <Typography variant="body2">
         
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
            labelName="Updated By"
            labelKey="PENSION_UPDATED_BY_LABEL"
          />
        </Typography>
        <Typography variant="body2">
          
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
            labelName="Current Owner"
            labelKey="PENSION_CURRENT_OWNER_LABEL"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
          
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
          
        </Typography>
      </Grid>
     
    </Grid>
  );
};

export default EmployeeServiceComponents;
