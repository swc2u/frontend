import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { ArealDialog } from "../../ui-molecules-local";

import { withStyles } from "@material-ui/core/styles";

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

class PensionArrealPopContainer extends React.Component {
  state = {
    open: false
  };

  handleViewHistory = () => {
    this.setState({
      open: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      open: false
    });
  };

  render() {
    const { classes, ProcessInstances, moduleName} = this.props;
    let currentObj =
      ProcessInstances && ProcessInstances[ProcessInstances.length - 1];    
    return (
      <div>
        <Card className="">
          <CardContent>
            <Container
              children={
                <div style={{ width: "100%" }}>
                  <Grid container="true" spacing={12} marginTop={16}>                    
                    <Grid item sm={6} xs={6} style={{ textAlign: "right" }}>
                      <Button
                        className={classes.button}
                        onClick={this.handleViewHistory}
                      >                        
                        <LabelContainer
                          labelName="VIEW HISTORY"
                          labelKey="TL_VIEW_HISTORY"
                          color="#FE7A51"
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  
                 {
                   <div>
                     pritam
                     </div>
                 }
                </div>
               
              }
            />
          </CardContent>
        </Card>
        <ArealDialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          history={ProcessInstances}
        />
      </div>
    );
  }
}

export default withStyles(styles)(PensionArrealPopContainer);
