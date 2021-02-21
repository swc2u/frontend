import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.scss";
import get from "lodash/get";
import {
  epochToYmd,
  getLocaleLabels,
  appendModulePrefix
} from "egov-ui-framework/ui-utils/commons";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

class CheckboxLabels extends React.Component {
  state = {
    checkedG: false
  };

  handleChange = name => event => {
    const { 
      screenKey,
      componentJsonpath,
      jsonPath, 
      approveCheck ,
      onFieldChange,
      localizationLabels,
      onChange
    
    } = this.props;
    onChange?onChange(event):onFieldChange(
      screenKey,
      componentJsonpath,
      "props.value",
      !this.state.checkedG
    );
    this.state.approveCheck = approveCheck
        this.setState({ [name]: event.target.checked }, () =>
      approveCheck(jsonPath, !this.state.checkedG)
    );
  };
  componentDidMount =  () => {

     const { checked, approveCheck } = this.props;
    if(checked)
    this.setState({checkedG : checked})
    else
    this.setState({checkedG : checked}) 

  }

  render() {
    let { classes, content,disabled ,value,fieldValue,label,localizationLabels,approveCheck, checked} = this.props;
    let translatedLabel = getLocaleLabels(
      content,
      content,
      localizationLabels
    );
    // if(checked)
    // {
    //  //this.state.checkedG = checked;
    //  this.setState({checkedG : checked})      
    // }
    // else
    // {
      
    // }
    //this.state.checkedG = checked;
   
    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={this.state.checkedG}
               onChange={this.handleChange("checkedG")}             
              value={this.state.checkedG}
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
            />
          }
          isRequired={false}      
          disabled={disabled}
          label={translatedLabel}
          
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration,app } = state;
  let { jsonPath ,value,approveCheck, checked} = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  const { localizationLabels } = app;

  checked = get(preparedFinalObject, jsonPath) === undefined?false:get(preparedFinalObject, jsonPath);
  return { preparedFinalObject, jsonPath ,localizationLabels ,approveCheck ,checked};
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CheckboxLabels)
);
