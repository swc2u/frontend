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
import PensionReviewDataContainer from "../PensionReviewDataContainer";
import PensionDataContainer from "../PensionDataContainer"
import PensionBasicDataContainer from "../PensionBasicDataContainer"
import PensionNotificationDataContainer from "../PensionNotificationDataContainer"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";


class PensionReviewContainer extends React.Component {
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


    if (pageName ==="REGISTER" || pageName ==="REVISION" ) {
    
    return (
      <div>
        
        {ProcessInstances  && (
          <PensionDataContainer ProcessInstances={ProcessInstances} pageName={pageName} />
        )
        }
        
      </div>
    );
      }
      else if (pageName ==="NOTIFICATION") {
    
        return (
          <div>
            
            {ProcessInstances  && (
              <PensionNotificationDataContainer ProcessInstances={ProcessInstances} />
            )
            }
            
          </div>
        );
          }
          if (pageName ==="REGISTER-BOTTOM") {
   
            return (
              <div>
                
                {ProcessInstances  && (
                  <PensionBasicDataContainer ProcessInstances={ProcessInstances} pageName={pageName} />
                )
                }
                
              </div>
            );
              }

      // else if (pageName ==="REVESION")
      // {
      //   return (
      //     <div>
      //       {ProcessInstances  && (
      //         <PensionReviewDataContainer ProcessInstances={ProcessInstances}  handleFieldChange={prepareFinalObject} />
      //       )
      //       }
            
            
      //     </div>
      //   );
      // }
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
)(PensionReviewContainer);
