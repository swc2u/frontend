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

class PensionNotificationDataContainer extends React.Component {
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
                          labelName="PENSION_NOTIFICATION_HEADER"
                          labelKey="PENSION_NOTIFICATION_HEADER"
                        />
                      </Typography>
                    </Grid>
                   
                    
                  </Grid>

                  <Grid
      container={true}
      spacing={12}
      style={{ paddingLeft: 10, paddingBottom: 2 }}
    >
      {/* <Grid
        item
        xs={12}
        sm={6}
        md={4}
        lg={2}
        style={{ marginTop: 10, paddingRight: 20 }}
      >
        <Typography variant="caption">
          <LabelContainer labelName="eventType" labelKey="PENSION_NOTIFICATION_EVENT_TYPE" />
        </Typography>
        <Typography variant="body2">
         
        </Typography>
      </Grid> */}
     
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
            labelName="eventCategory"
            labelKey="PENSION_NOTIFICATION_EVENT_CATEGORY"
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
            labelName="eventname"
            labelKey="PENSION_NOTIFICATION_EVENT_NAME"
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
            labelName="description"
            labelKey="PENSION_NOTIFICATION_DESCRIPTION"
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

                  <div>
                    {
currentObj.events && currentObj.events.map((item,index)=>
{
  return(
                          <div>
                    <Grid
                          container={true}
                          spacing={12}
                          style={{ paddingLeft: 10, paddingBottom: 2 }}
                        >
                          {/* <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.eventType} />
                            </Typography>
                          </Grid> 
                          <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.eventCategory} />
                            </Typography>
                          </Grid> */}
                          <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.name} />
                            </Typography>
                          </Grid>
                          <Grid  item  xs={12} sm={6}  md={4} lg={2}  style={{ marginTop: 10, paddingRight: 20 }} >        
                            <Typography variant="body2">
                            <LabelContainer labelName={item.description} />
                            </Typography>
                          </Grid>                          
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

export default withStyles(styles)(PensionNotificationDataContainer);
