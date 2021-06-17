import React, { Component } from "react";
import { connect } from "react-redux";
import formHOC from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import PaccCancelledRejectedForm from "./components/PaccCancelledRejectedForm";
import { fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import "./index.css";

const NewLocationRejectHOC = formHOC({
  formKey: "rejectCancelRequest",
  isCoreConfiguration: 'false',
})(PaccCancelledRejectedForm);


class rejectCancelRequest extends Component {
  state = {
    valueSelected: "",
    commentValue: ""
  };
  componentDidMount() {
      let { fetchApplications, match, userInfo,applicationNumber } = this.props;
   
    fetchApplications(
      { 'uuid': userInfo.uuid, "applicationNumber": applicationNumber,
      "applicationStatus":"",
      "mobileNumber":"","bookingType":"","tenantId":userInfo.tenantId }
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
    this.props.handleFieldChange("rejectCancelRequest", "comments", concatvalue);
  };

  onSubmit = e => {
    const { valueSelected, commentValue } = this.state;
    
    const { toggleSnackbarAndSetText } = this.props;
   
  };

  render() {
    let { match, userInfo } = this.props;

    const { handleCommentsChange, handleOptionsChange, onSubmit } = this;
    const { valueSelected, commentValue } = this.state;
    // const { trasformData, businessServiceData,applicationNumber } = this.props;
    const {
      trasformData, businessServiceData,applicationNumber,
    applicationStatus,ApplicantMobileNum,ApplicantName,BookingType,fatherName,bkEmail,bkCompleteAddress,
    bkCategory,bkBookingPurpose,
    bkFromDate,bkNomineeName,bkStatusUpdateRequest,timeslots,bkLocationPictures,cardNumber,
    bkToDate,bkBankAccountNumber,bkBankName,bkIfscCode,bkAccountType,bkBankAccountHolder,bkBookingVenue
    } = this.props
  
    return (
        <NewLocationRejectHOC
        bkFromDate={bkFromDate}
        bkNomineeName={bkNomineeName}
        bkStatusUpdateRequest={bkStatusUpdateRequest}
        timeslots={timeslots}
        bkLocationPictures={bkLocationPictures}
        cardNumber={cardNumber}
        bkToDate={bkToDate}
        bkBankAccountNumber={bkBankAccountNumber}
        bkBankName={bkBankName}
        bkIfscCode={bkIfscCode}
        bkAccountType={bkAccountType}
        bkBankAccountHolder={bkBankAccountHolder}
        bkBookingVenue={bkBookingVenue}
        applicationStatus={applicationStatus}
        ApplicantMobileNum={ApplicantMobileNum}        
        ApplicantName={ApplicantName}
        BookingType={BookingType}
        fatherName={fatherName} 
        bkEmail={bkEmail}
        bkCompleteAddress={bkCompleteAddress}
        bkCategory={bkCategory}
        bkBookingPurpose={bkBookingPurpose}
          ontextAreaChange={handleCommentsChange}
          handleOptionChange={handleOptionsChange}  
          // optionSelected={valueSelected}
          commentValue={commentValue}
          applicationNumber={applicationNumber}   
          createdBy={userInfo.name} 
          tenantId={userInfo.tenantId}
          onSubmit={onSubmit}
          // bookingtype={trasformData.bkBookingType}
          bookingservice={businessServiceData?businessServiceData:''}  
        />
    );
  }
}

const mapStateToProps = state => {
  const { bookings = {} } = state || {};
  const { applicationData } = bookings;
 
  let trasformData = applicationData?applicationData.bookingsModelList[0]:'';
  let businessServiceData = applicationData.businessService;

  let applicationStatus  = trasformData !== undefined && trasformData !== null ?  trasformData.bkApplicationStatus : ""
  

  let ApplicantMobileNum = trasformData !== undefined && trasformData !== null ?  trasformData.bkMobileNumber : ""
  

  let ApplicantName = trasformData !== undefined && trasformData !== null ?  trasformData.bkApplicantName : ""
  

  let BookingType = trasformData !== undefined && trasformData !== null ?  trasformData.bkBookingType : ""
  

  let fatherName = trasformData !== undefined && trasformData !== null ?  trasformData.bkFatherName : ""
  

  let bkEmail = trasformData !== undefined && trasformData !== null ?  trasformData.bkEmail : ""
  

  let bkCompleteAddress = trasformData !== undefined && trasformData !== null ?  trasformData.bkCompleteAddress : ""
  

  let bkCategory = trasformData !== undefined && trasformData !== null ?  trasformData.bkCategory : ""
  
  

  let bkBookingPurpose = trasformData !== undefined && trasformData !== null ?  trasformData.bkBookingPurpose : ""
  

  let bkFromDate = trasformData !== undefined && trasformData !== null ?  trasformData.bkFromDate : ""
 
  // let bkBankAccountHolder = trasformData !== undefined && trasformData !== null ?  trasformData.bkBankAccountHolder : ""
  
  let bkToDate = trasformData !== undefined && trasformData !== null ?  trasformData.bkToDate : ""

let bkBankAccountNumber = trasformData !== undefined && trasformData !== null ?  trasformData.bkBankAccountNumber : ""
  

  let bkBankName = trasformData !== undefined && trasformData !== null ?  trasformData.bkBankName : ""
  


  let bkIfscCode = trasformData !== undefined && trasformData !== null ?  trasformData.bkIfscCode : ""
  

  let bkAccountType = trasformData !== undefined && trasformData !== null ?  trasformData.bkAccountType : ""
  

  let bkBankAccountHolder = trasformData !== undefined && trasformData !== null ?  trasformData.bkBankAccountHolder : ""


  let bkBookingVenue = trasformData !== undefined && trasformData !== null ?  trasformData.bkBookingVenue : ""
 

  let bkNomineeName = trasformData !== undefined && trasformData !== null ?  trasformData.bkNomineeName : ""
  console.log("bkNomineeName",bkNomineeName)

  let bkStatusUpdateRequest = trasformData !== undefined && trasformData !== null ?  trasformData.bkStatusUpdateRequest : ""
  console.log("bkStatusUpdateRequest",bkStatusUpdateRequest)
//applicationDetails.
 
  let timeslots = trasformData !== undefined && trasformData !== null ?  trasformData.timeslots : ""
console.log("timeSlots-for-citizen",timeslots)
  let cardNumber = trasformData !== undefined && trasformData !== null ?  trasformData.cardNumber : ""

  let bkLocationPictures = trasformData !== undefined && trasformData !== null ?  trasformData.bkLocationPictures : ""
  console.log("bkLocationPictures--inAllStep",bkLocationPictures)


  return { trasformData, businessServiceData,
    applicationStatus,ApplicantMobileNum,ApplicantName,BookingType,fatherName,bkEmail,bkCompleteAddress,bkCategory,bkBookingPurpose,
    bkFromDate,bkNomineeName,bkStatusUpdateRequest,timeslots,bkLocationPictures,cardNumber,
    bkToDate,bkBankAccountNumber,bkBankName,bkIfscCode,bkAccountType,bkBankAccountHolder,bkBookingVenue
  };
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
)(rejectCancelRequest);
