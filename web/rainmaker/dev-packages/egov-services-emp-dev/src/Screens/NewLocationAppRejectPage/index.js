
import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import CommonSuccessMessage from "../../modules/CommonSuccessMessage";
import { connect } from "react-redux";


class ApplicationRejected extends Component {
  handleComplaintReassigned = () => {
    this.props.history.push(`/egov-services/all-applications`);
  };

  render() {
    let {applicationNumber} = this.props;
    return (
      <div className="success-message-main-screen">
        <CommonSuccessMessage
          headermessage="BK_ES_APPLICATION_HEADER_MESSAGE_REJECT"
          successmessage="BK_ES_COMPLAINT_REJECT_SUCCESS_MESSAGE"
          secondaryLabel="BK_CS_COMMON_SEND_MESSAGE_REJECTED"
          icon={<Icon action="navigation" name="close" />}
          backgroundColor={"#e74c3c"}
          applicationNumber={applicationNumber && applicationNumber}
        />

        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_PACC_EMP_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.handleComplaintReassigned}
          />
        </div>
      </div>
    );
  }
}   
const mapStateToProps = state => {
  const { bookings, common, auth, form } = state;
  const { MccApplicationData } = bookings;
  let bookingDetails = MccApplicationData ? MccApplicationData.osujmNewLocationModelList[0] : '';
 
  let applicationNumber = MccApplicationData ? MccApplicationData.osujmNewLocationModelList[0].applicationNumber : '';

  return {
    bookingDetails,
    applicationNumber
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)( ApplicationRejected);