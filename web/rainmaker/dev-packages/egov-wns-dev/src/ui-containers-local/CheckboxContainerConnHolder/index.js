import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject,handleScreenConfigurationFieldChange } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import get from "lodash/get";
import { toggleConnHolderDetails } from "../CheckboxContainer/toggleFeilds"

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
    checkedG: null
  };

  componentDidMount = () => {
    /*const { preparedFinalObject, approveCheck, jsonPath, onFieldChange } = this.props;    
    let isChecked = get(preparedFinalObject, jsonPath);
    if (isChecked) this.setState({ checkedG: isChecked });
    else {
      this.setState({ checkedG: true })
      this.updateOwnerFileds();
    } */
    const { classes, content, label, isChecked, approveCheck, onFieldChange, jsonPath } = this.props;
    if(isChecked === false){
      toggleConnHolderDetails(onFieldChange, true);
      approveCheck(jsonPath, isChecked)
      approveCheck('WaterConnection[0].waterApplication.isFerruleApplicable', true)
    }else{
      toggleConnHolderDetails(onFieldChange, false);
      approveCheck(jsonPath, isChecked)
    }
  };

  updateOwnerFileds = () => {
    const {
      sourceJsonPaths,
      destinationJsonPaths,
      disbaleComponentJsonPaths,
      onFieldChange,
      screenKey,
      preparedFinalObject,
      approveCheck,
      jsonPath,
      state
    } = this.props;

    toggleConnHolderDetails(onFieldChange, false);
    approveCheck(jsonPath, this.props.isChecked)

  }
  // validateField = field => {
  //   const {
  //     required,
  //     pattern,
  //     minLength,
  //     maxLength,
  //     minValue,
  //     maxValue,
  //     visible,
  //     isDOB
  //   } = field;
  
  //   if (visible !== undefined && !visible) {
  //     return { isFieldValid: true, errorText: "" };
  //   }
  
  //   const fieldValue = field.value || (field.props && field.props.value);
  //   const value = fieldValue
  //     ? typeof fieldValue === "string"
  //       ? fieldValue.trim()
  //       : fieldValue
  //     : null;
  //   let errorText = "",
  //     isFieldValid = true,
  //     fieldLength = 0;
  
  //   if (required && !value) {
  //     isFieldValid = false;
      
  //     errorText = field.requiredMessage ||getLocaleLabels("REQUIRED_FIELD","REQUIRED_FIELD");
  //   }
  
  //   if (value) {
  //     fieldLength = value.length;
  //   }
  
  //   if (
  //     isFieldValid &&
  //     fieldLength &&
  //     pattern &&
  //     !new RegExp(pattern).test(value)
  //   ) {
  //     isFieldValid = false;
  //   }
  //   if (
  //     isFieldValid &&
  //     minLength &&
  //     maxLength &&
  //     !(fieldLength >= minLength && fieldLength <= maxLength)
  //   ) {
  //     isFieldValid = false;
  //   }
  //   if (
  //     isFieldValid &&
  //     minValue &&
  //     maxValue &&
  //     !(value >= minValue && value <= maxValue)
  //   ) {
  //     isFieldValid = false;
  //   }
  
  //   if (isDOB) {
  //     if (value) {
  //       let currentDate = new Date().getTime();
  //       let ownerDOB = new Date(value).getTime();
  //       if (ownerDOB > currentDate) {
  //         isFieldValid = false;
  //       }
  //     }
  //   }
  
  //   errorText = !isFieldValid
  //     ? errorText.length
  //       ? errorText
  //       : field.errorMessage || "Invalid field"
  //     : "";
  
  //   return { isFieldValid, errorText };
  // };
  // validate = (
  //   screenKey,
  //   componentObject,
  //   approveCheck,
  //   skipPrepareFormData = false
  // ) => {
  //   const validatedObject = this.validateField(componentObject);
  //   let isFormValid = true;
  //   if (!skipPrepareFormData) {
  //     approveCheck(componentObject.jsonPath, componentObject.value);
  //   }
  //   if (componentObject.jsonPath && validatedObject.isFieldValid) {
  //     if (!componentObject.isFieldValid) {
  //       isFormValid = true;
  //       approveCheck(
  //           screenKey,
  //           `${componentObject.componentJsonpath}.props`,
  //           "error",
  //           false
  //         );
        
  //         approveCheck(
  //           screenKey,
  //           `${componentObject.componentJsonpath}.props`,
  //           "helperText",
  //           validatedObject.errorText
  //         );
        
  //         approveCheck(
  //           screenKey,
  //           `${componentObject.componentJsonpath}`,
  //           "isFieldValid",
  //           true
  //         );
        
  //     }
  //   } else {
  //     isFormValid = false;
  //     approveCheck(
  //         screenKey,
  //         `${componentObject.componentJsonpath}.props`,
  //         "error",
  //         true
  //       );      
  //       approveCheck(
  //         screenKey,
  //         `${componentObject.componentJsonpath}.props`,
  //         "helperText",
  //         validatedObject.errorText
  //       );
  //       approveCheck(
  //         screenKey,
  //         `${componentObject.componentJsonpath}`,
  //         "isFieldValid",
  //         false
  //       );
  //   }
  //   return isFormValid;
  // };
  //  validateFields = (
  //   objectJsonPath,
  //   state,
  //   approveCheck,
  //   screen = "apply"
  // ) => {
  //   const fields = get(
  //     state.screenConfiguration.screenConfig[screen],
  //     objectJsonPath,
  //     {}
  //   );
  //   let isFormValid = true;
  //   for (var variable in fields) {
  //     if (fields.hasOwnProperty(variable)) {
  //       if (
  //         fields[variable] &&
  //         fields[variable].props &&
  //         (fields[variable].props.disabled === undefined ||
  //           !fields[variable].props.disabled) &&
  //         !this.validate(
  //           screen,
  //           {
  //             ...fields[variable],
  //             value: get(
  //               state.screenConfiguration.preparedFinalObject,
  //               fields[variable].jsonPath
  //             )
  //           },  
  //           approveCheck,          
  //           true
  //         )
  //       ) {
  //         isFormValid = false;
  //       }
  //     }
  //   }
  //   return isFormValid;
  // };
  handleChange = name => event => {
    const {
      sourceJsonPaths,
      destinationJsonPaths,
      disbaleComponentJsonPaths,
      onFieldChange,
      screenKey,
      preparedFinalObject,
      approveCheck,
      approveCheckcon,
      section,
      jsonPath,
      state
    } = this.props;

    const isChecked = event.target.checked;
    if (isChecked) {
      toggleConnHolderDetails(onFieldChange, false);
      //set Owner Information
      if(preparedFinalObject.applyScreen.property.owners && preparedFinalObject.applyScreen.property.owners[0])
      {
      const mobileNumber =  get(preparedFinalObject.applyScreen.property.owners[0], "mobileNumber");
      const name =  get(preparedFinalObject.applyScreen.property.owners[0], "name");
      const emailId =  get(preparedFinalObject.applyScreen.property.owners[0], "emailId");
      const correspondenceAddress =  get(preparedFinalObject.applyScreen.property.owners[0], "correspondenceAddress");
      //const ownerType =  get(preparedFinalObject.applyScreen.property.owners[0], "correspondenceAddress");
      approveCheck('connectionHolders[0].mobileNumber', mobileNumber)
      approveCheck('connectionHolders[0].name', name)
      approveCheck('connectionHolders[0].emailId', emailId)
      approveCheck('connectionHolders[0].correspondenceAddress', correspondenceAddress)
     approveCheck('connectionHolders[0].ownerType', "INDIVIDUAL.SINGLEOWNER")
     let path ='components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children'
    if(name && mobileNumber &&correspondenceAddress &&name)
    {
     approveCheckcon(`${path}.applicantName`, name)
     approveCheckcon(`${path}.mobileNumber`, mobileNumber)
     approveCheckcon(`${path}.email`, emailId)
     approveCheckcon(`${path}.correspondenceAddress`, correspondenceAddress)
    }
    //  this.validateFields(
    //   "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children",
    //   state,
    //   approveCheck,
    //   "apply"
    // );
    // const fields = get(
    //   state.screenConfiguration.screenConfig["apply"],
    //   "components.div.children.formwizardFirstStep.children.propertyUsageDetails.children.cardContent.children.propertyUsage.children.PropertyUsageDetails.children",
    //   {}
    // );
      }


    } else {
      toggleConnHolderDetails(onFieldChange, true);
      approveCheck('connectionHolders[0].mobileNumber', null)
      approveCheck('connectionHolders[0].name', null)
      approveCheck('connectionHolders[0].emailId', null)
      approveCheck('connectionHolders[0].correspondenceAddress', null)
      let path ='components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children'
      approveCheckcon(`${path}.applicantName`, '')
      approveCheckcon(`${path}.mobileNumber`, '')
      approveCheckcon(`${path}.email`, '')
      approveCheckcon(`${path}.correspondenceAddress`, '')
    }
    if(section !== undefined)
    {
      if(section === 'SECURITY')
        {
          //
          //

        }

    }

    this.setState({ [name]: isChecked }, () =>
      approveCheck(jsonPath, isChecked)
    );
  };

  render() {
    const { classes, content, label,preparedFinalObject,section ,approveCheck} = this.props;
    let isChecked = (this.state.checkedG === null)?true:this.state.checkedG;
    let isdisabled = false
    //isFerruleApplicable should be enable to change the value in step  PENDING_FOR_SECURITY_DEPOSIT
    if(preparedFinalObject.WaterConnection.length>0)
    {
      if(preparedFinalObject.WaterConnection[0].waterApplication)
      {
        const {applicationStatus} = preparedFinalObject.WaterConnection[0];
        if(applicationStatus !== undefined)
        {
          if(applicationStatus ==='PENDING_FOR_JE_APPROVAL_AFTER_SUPERINTEDENT')
          {
            isdisabled = false           
            isChecked = isChecked;
           // approveCheck("waterApplication.isFerruleApplicable", isChecked)
          }
          else
          {
            isdisabled = true
            isChecked = true//preparedFinalObject.WaterConnection[0].waterApplication.isFerruleApplicable
           // approveCheck('WaterConnection[0].waterApplication.isFerruleApplicable', true)
            
          }
        }
        else
        {
          if(section === undefined)
          {
            isdisabled = false
            isChecked = false

          }
          else{
            isdisabled = true

          }
          

        }
  
      }

    }
    
 
    return (
      <FormGroup row>
        <FormControlLabel
          classes={{ label: "checkbox-label" }}
          control={
            <Checkbox
              checked={isChecked}
              disabled={isdisabled}
              onChange={this.handleChange("checkedG")}
              value={isChecked}
              classes={{
                root: classes.root,
                checked: classes.checked
              }}
            />
          }
          label={
            label &&
            label.key && (
              <LabelContainer
                className={classes.formLabel}
                labelName={label.name}
                labelKey={label.key}
              />
            )
          }
        />
      </FormGroup>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPath } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPath ,state};
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheckcon:(jsonPath, value) => {
      dispatch(handleScreenConfigurationFieldChange('apply',jsonPath,'props.value', value));
    },
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




// if(sourceJsonPaths){
//   sourceJsonPaths.forEach((sourceJSonPath, index) => {
//     // approveCheck(
//     //   destinationJsonPaths[index],
//     //   get(preparedFinalObject, sourceJSonPath)
//     // );
//     console.log("===sourcevalue",get(preparedFinalObject, sourceJSonPath))
//     onFieldChange(
//       screenKey,
//       disbaleComponentJsonPaths[index],
//       "props.value",
//       get(preparedFinalObject, sourceJSonPath)
//     );
//   });
// }


// sourceJsonPaths &&
// destinationJsonPaths &&
// destinationJsonPaths.forEach((destinationJsonPath, index) => {
//   approveCheck(destinationJsonPath[index], "");
// });

// disbaleComponentJsonPaths &&
    //   disbaleComponentJsonPaths.map(componentJsonPath => {
    //     onFieldChange(
    //       screenKey,
    //       componentJsonPath,
    //       "props.disabled",
    //       event.target.checked
    //     );
    //   });
    //true

      // disbaleComponentJsonPaths &&
      //   disbaleComponentJsonPaths.forEach((disbaleComponentJsonPath, index) => {
      //     approveCheck(disbaleComponentJsonPath[index], "");
      //   });
      // disbaleComponentJsonPaths &&
      //   disbaleComponentJsonPaths.map(componentJsonPath => {
      //     onFieldChange(screenKey, componentJsonPath, "props.value", "");
      //   });

      

      //  this.updateOwnerFileds();
      // if(destinationJsonPaths){
      //   destinationJsonPaths.forEach((destinationJsonPath, index) => {
      //     approveCheck(
      //       destinationJsonPaths[index],
      //       get(preparedFinalObject, destinationJsonPath)
      //     );
      //     onFieldChange(
      //       screenKey,
      //       disbaleComponentJsonPaths[index],
      //       "props.value",
      //       get(preparedFinalObject, destinationJsonPath)
      //     );
      //   });
      // }