import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux"; 
import "./index.css";
import EditIcon from '@material-ui/icons/Edit';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from '@material-ui/core/FormGroup';
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    },
    marginBottom: 12
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    display: "inline-block",
    margin: 0
  },
  checked: {},
  radioRoot: {
    marginBottom: 12
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.56
  },
  label:{
    marginLeft: '23px'
  }
};


class CGBookingDetails extends Component {
    
  state = {
    checkedG: true
  };

  handleWater = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  

  render() {
    const { classes, preparedFinalObject } = this.props;
return (
  <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline" style={{display: "flex",justifyContent: "space-between"}}>     
                <Label label="BK_MYBK_PACC_TERMS_AND_CONDITIONS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />  
              </div>
              <div key={10} className="complaint-detail-full-width">           
              <div className="complaint-detail-detail-section-status row">
          <div className={classes.label}>
          <FormGroup row>
            <FormControlLabel
              classes={{ label: "checkbox-label" }}
              control={
                <Checkbox
                  // checked={checkedWater}
                  // disabled={IsEdit}
                  iconStyle={{fill: '#FE7A51'}}
                  onChange={(e)=>this.props.handleCheckBox(e)}
                  // onChange={this.handleWater()}
                  classes={{root: classes.root,
                  checked: classes.checked}}
                    />}
              label={"I understand that I will be liable for prosecution if any incorrect information is shared by me in this application."}
            />                
            </FormGroup>
           
          
                          </div>
</div>
            </div>
          </div>
        }
      />
    </div>
  );
}
}
// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CheckboxLabels));
// export default CGBookingDetails;

export default withStyles(styles)(CGBookingDetails);
