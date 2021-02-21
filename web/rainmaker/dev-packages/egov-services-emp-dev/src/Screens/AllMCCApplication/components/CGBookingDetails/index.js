import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";

const iconStyle = {
  marginRight: "13px",
  height: "24px",
  width: "24px",
};

const imageStyles = {
  maxHeight: "100px",
  minHeight: "100px",
};

const mapIconStyle = {
  marginRight: "7px",
  height: "12px",
  width: "14px",
  borderRadius: "50%",
};

class CGBookingDetails extends Component {
  navigateToComplaintType = () => {
    this.props.history.push("/complaint-type");
  };
  getImageSource = (imageSource, size) => {
    const images = imageSource.split(",");
    if (!images.length) {
      return null;
    }
    switch (size) {
      case "small":
        imageSource = images[2];
        break;
      case "medium":
        imageSource = images[1];
        break;
      case "large":
      default:
        imageSource = images[0];
    }
    return imageSource || images[0];
  };
  onImageClick = (source) => {
    window.open(this.getImageSource(source, "large"), 'Image');
    // this.props.history.push(`/image?source=${source}`);
  };

  convertEpochToDate = (dateEpoch) => {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}-${month}-${year}`;
  };

  render() {

    const { status, bkBookingPurpose, bkFromDate, bkToDate, historyApiData, bkDuration, applicantName, applicationNo, submittedDate, bookingPurpose, dateCreated, address, sector, houseNo, bookingType, mapAction, images, action, role } = this.props;

    return (
      <div>
        <Card
          textChildren={
            <div>
              <div className="rainmaker-displayInline">
                {/* <Icon action="notification" name="sms-failed" color="#767676" />{" "} */}
                <Label label="BK_MYBK_APPLICATION_DETAILS" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
              </div>
              <div key={10} className="complaint-detail-full-width">
              
              <div className="complaint-detail-detail-section-status row">
                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_COMMON_APPLICATION_NO" />
                  <Label
                    labelStyle={{ color: "inherit" }}
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    id="complaint-details-complaint-number"
                    label={applicationNo}
                  />
                </div>
                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_CURRENT_STATUS" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    id="complaint-details-current-status"
                    labelStyle={{ color: "inherit" }}
                    label={status}
                  />
                </div>
                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_DETAILS_SUBMISSION_DATE" />
                  <b><Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    //label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    // label={dateCreated}
                    label= {this.convertEpochToDate(
                      dateCreated,"dayend"
                    )}
                  /></b>
                </div>
                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_TYPE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    //label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    label={bookingType}
                  />
                </div>
                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_PURPOSE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    //label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    label={bkBookingPurpose}
                  />
                </div>
                {/* <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="MYBK_APPLICATION_BOOKING_DURATION" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    label={bkDuration}
                  />
                </div> */}

              <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_FROM_DATE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    //label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    label= {this.convertEpochToDate(
                      bkFromDate,"dayend"
                    )}
                    // label={bkFromDate}
                  />
                </div>

                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_TO_DATE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    // label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    // label={bkToDate}
                    label= {this.convertEpochToDate(
                      bkToDate,"dayend"
                    )}
                  />
                </div> 

                <div className="col-md-4">
                  <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_APPLICATION_BOOKING_VENUE" />
                  <Label
                    className="col-xs-12  col-sm-12 col-md-12  status-result-color"
                    // label={submittedDate}
                    id="complaint-details-submission-date"
                    labelStyle={{ color: "inherit" }}
                    label={sector}
                  />
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

export default CGBookingDetails;
