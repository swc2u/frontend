import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  LabelContainer,
  DownloadFileContainer
} from "egov-ui-framework/ui-containers";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { connect } from "react-redux";
import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import EmployeeServiceDataContainer from "../EmployeeServiceDataContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


class EmployeeServiceContainer extends React.Component {
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
      moduleName
    } = this.props;
    
    return (
      <div>
        {ProcessInstances  && (
          <EmployeeServiceDataContainer ProcessInstances={ProcessInstances} />
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
)(EmployeeServiceContainer);
