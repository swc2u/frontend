import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import RejectComplaintForm from "./components/DeliveredBWTBookingForm";
import { fetchApplications } from "egov-ui-kit/redux/complaints/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const DeliveredBWTBookingHOC = formHOC({
  formKey: "deliveredWBTBooking",
  isCoreConfiguration: true,
  path: "pgr/pgr-employee"
})(RejectComplaintForm);


class DeliveredBWTBooking extends Component {
  state = {
    valueSelected: "",
    commentValue: ""
  };
  componentDidMount() {
    console.log('DeliveredBWTBookingHOC', DeliveredBWTBookingHOC)

    let { fetchApplications, match, userInfo } = this.props;
    console.log('match.params.applicationId', this.props)
    fetchApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": match.params.applicationId,
      "applicationStatus":"",
      "mobileNumber":"","bookingType":""  }
      // { "applicationNumber": match.params.applicationId }
    );
  }

  options = [
    {
      value: "Not a valid application",
      label: <Label label="ES_REASSIGN_OPTION_ONE" />
    },
    {
      value: "Out of operational scope",
      label: <Label label="ES_REJECT_OPTION_TWO" />
    },
    { value: "Operation already underway", label: <Label label="ES_REJECT_OPTION_THREE" /> },
    { value: "Other", label: <Label label="ES_REJECT_OPTION_FOUR" /> }
  ];

  commentsValue = {};

  handleCommentsChange = (e, value) => {
    console.log('e and values',e,'valllllll',value)
    this.commentsValue.textVal = e.target.value;
    this.setState({
      commentValue: e.target.value
    });
    this.concatComments(this.commentsValue);
  };
  handleOptionsChange = (event, value) => {
    this.setState({ valueSelected: value });
    this.commentsValue.radioValue = value;
    this.concatComments(this.commentsValue);
  };
  concatComments = val => {
    let com1 = "";
    let com2 = "";
    if (val.radioValue) {
      com1 = val.radioValue + ";";
    }
    if (val.textVal) {
      com2 = val.textVal;
    }
    let concatvalue = com1 + com2;
    this.props.handleFieldChange("deliveredWBTBooking", "comments", concatvalue);
  };

  onSubmit = e => {

    const { valueSelected, commentValue } = this.state;
    console.log('this.stat in on submite', this.state)
    const { toggleSnackbarAndSetText } = this.props;
    // if (valueSelected === "Other" && !commentValue) {
    //   e.preventDefault();
    //   toggleSnackbarAndSetText(
    //     true,
    //     {
    //       labelName: "Please mention your reason",
    //       labelKey: "ERR_PLEASE_MENSION_YOUR_REASON"
    //     },
    //     "error"
    //   );
    // }
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit } = this;
    const { valueSelected, commentValue } = this.state;
    const { trasformData, businessServiceData } = this.props;
    console.log('this in render', trasformData)
    return (
      <Screen className="background-white">
        <DeliveredBWTBookingHOC
          // options={this.options}
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}
          // optionSelected={valueSelected}
          commentValue={commentValue}
          applicationNumber={match.params.applicationId}
          createdBy={userInfo.name}
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          bookingtype={trasformData.bkBookingType}
          bookingservice={businessServiceData?businessServiceData:''}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { complaints = {} } = state || {};
  const { applicationData } = complaints;
  let trasformData = applicationData.bookingsModelList[0];
  let businessServiceData = applicationData.businessService;
  return { trasformData, businessServiceData };
}


const mapDispatchToProps = dispatch => {
  return {
    fetchApplications: criteria => dispatch(fetchApplications(criteria)),
    handleFieldChange: (formKey, fieldKey, value) =>
      dispatch(handleFieldChange(formKey, fieldKey, value)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveredBWTBooking);
