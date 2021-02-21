import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import Divider from "@material-ui/core/Divider";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
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

class EmployeeServiceDataContainer extends React.Component {
  state = {
    open: false
  };


  render() {
    const { classes, ProcessInstances } = this.props;
    const currentObj =
    ProcessInstances && ProcessInstances[0];
      console.log(currentObj)
      console.log("ProcessInstances")
     
    return (
      <div>
        <Card className="">
          <CardContent>
            <Container
              children={
                <div style={{ width: "100%" }}>
                  <Grid container="true" spacing={12} marginTop={16}>
                    <Grid
                      style={{ alignItems: "center", display: "flex" }}
                      item
                      sm={6}
                      xs={6}
                    >
                      <Typography component="h2" variant="subheading">
                        <LabelContainer
                          labelName="EMPLOYEE SERVICE DATA"
                          labelKey="PENSION_EMPLOYEE_SERVICE_DATA"
                        />
                      </Typography>
                    </Grid>
                   
                    
                  </Grid>

                  <Grid
      container={true}
      spacing={12}
      style={{ paddingLeft: 10, paddingBottom: 2 }}
    >
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer labelName="serviceStatus" labelKey="PENSION_EMPLOYEE_STATUS" />
        </Typography>
        <Typography variant="body2">
         
        </Typography>
      </Grid>
      {/* <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="Department By"
            labelKey="PENSION_EMPLOYEE_DEPARTMENT"
          />
        </Typography>
        <Typography variant="body2">
          
        </Typography>
      </Grid> */}
      <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="From Date"
            labelKey="PENSION_DATE_FROM"
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
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer
            labelName="To Date"
            labelKey="PENSION_DATE_TO"
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
      {/* <Grid item xs={12} sm={6} md={4} lg={2} style={{ marginTop: 10 }}>
        <Typography variant="caption">
          <LabelContainer
            labelName="isCurrentAssignment"
            labelKey="PENSION_EMPLOYEE_CURRENT_ASSIGNMENT"
          />
        </Typography>
        <Typography
          variant="body2"
          classes={{
            body2: "body2-word-wrap"
          }}
        >
         
        </Typography>
      </Grid> */}
     
    </Grid>

                  <div>
                    {
currentObj.employee && currentObj.employee.serviceHistory.map((item,index)=>
{
  return(
                          <div>
                    <Grid
                          container={true}
                          spacing={12}
                          style={{ paddingLeft: 10, paddingBottom: 2 }}
                        >
                          <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.serviceStatus} />
                            </Typography>
                          </Grid> 
                          {/* <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.department} />
                            </Typography>
                          </Grid> */}
                          <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.serviceFrom === null?"":convertEpochToDate(item.serviceFrom)
            } />
                            </Typography>
                          </Grid>
                          <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.serviceTo=== null?"":convertEpochToDate(
             item.serviceTo
            )} />
                            </Typography>
                          </Grid>
                          {/* <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.isCurrentPosition} />
                            </Typography>
                          </Grid> */}
                          <Divider className={classes.root} />    
                        </Grid>
                          </div>
                          
                         
                      )
                    })
                    }
                  

                  </div>
               

                </div>
              }
             
              
             
            />
          </CardContent>
        </Card>
       
      </div>
    );
  }
}

export default withStyles(styles)(EmployeeServiceDataContainer);
