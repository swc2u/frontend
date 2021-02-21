import React from "react";
import { connect } from "react-redux";
import PensionBasicDataContainer from "../PensionBasicDataContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


class PensionBasicContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    
   
  };
  render() {
    const {
      ProcessInstances,
      prepareFinalObject,
      dataPath,
      moduleName,
      pageName
    } = this.props;
    console.log(ProcessInstances)    
    console.log("ProcessInstances")
    return (
      <div>        
        {ProcessInstances  && (
          <PensionBasicDataContainer ProcessInstances={ProcessInstances}  />
        )
        }        
      </div>
    );
      
      
      
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { ProcessInstances } = preparedFinalObject;
  
  return { ProcessInstances, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant))
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(PensionBasicContainer);
