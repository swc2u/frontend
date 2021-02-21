import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
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
      compJPath ,    
      multiItems,
      componentJsonpath,
      jsonPath, 
      componentname,
      approveCheck ,
      //onFieldChange,
      localizationLabels,
            //onChange
    } = this.props;

    if (compJPath) {
      if (multiItems.length > 0) {
        for (var i = 0; i < multiItems.length; i++) {
          handleField(
            screenKey,
            `${compJPath}[${i}].item${i}.children.cardContent.children.dependentUnitcardContainer.children.${componentname}`,
            "props.value",
            false
          );
        }
      }
    }
    this.state.approveCheck = approveCheck
        this.setState({ [name]: event.target.checked }, () =>
      approveCheck(jsonPath, this.state.checkedG)
    );
    // this.state.approveCheck = approveCheck
    // onChange?onChange(event):onFieldChange(
    //   screenKey,
    //   componentJsonpath,
    //   "props.value",
    //   event.target.value
    // );
  };

  render() {
    let { classes, content,disabled ,value,fieldValue,label,localizationLabels,checked} = this.props;
    let translatedLabel = getLocaleLabels(
      content,
      content,
      localizationLabels
    );
    if(this.state.approveCheck===undefined)
    {
      this.state.checkedG = checked;
    }
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
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  let { jsonPath ,value,approveCheck,compJPath,componentname, checked, screenKey} = ownprops;
 // const { preparedFinalObject } = screenConfiguration;
  const multiItems = get(screenConfig[screenKey], compJPath, []);
  const { localizationLabels } = app;

  checked = get(preparedFinalObject, jsonPath) === undefined?false:get(preparedFinalObject, jsonPath);
  return {multiItems,screenConfig, preparedFinalObject, jsonPath,componentname ,localizationLabels ,approveCheck ,checked};
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
  },
    // prepareFinalObject: (path, value) =>
    //   dispatch(prepareFinalObject(path, value)),
    handleField: (screenKey, componentJSONPath, property, value) =>
      dispatch(handleField(screenKey, componentJSONPath, property, value))
    
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
