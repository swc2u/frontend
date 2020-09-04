import React, { Component } from "react";
import { Card, Image, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";


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

class PayDetails extends Component {
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
   
  };

  diffDates = (fromDate,toDate) => {
    
   
    var date1 = new Date(fromDate);
    var date2 = new Date(toDate);

     
     var Difference_In_Time = date2.getTime() - date1.getTime();

    
     var Difference_In_Days = (Difference_In_Time / (1000 * 3600 * 24)) + 1;

    
    return Difference_In_Days
  }


  render() {
    const { bkPaymentDate,paymentDetails,area, fromDate, toDate,perDayRupees, bkPaymentReceiptNumber, bkPaymentStatus } = this.props;

let str = 'Base Charges' + (area)+ 'sqft X' +(this.diffDates(fromDate,toDate))+ 'days(@Rs.' +  (perDayRupees) +'/sqft)'
let str1 = str .substring(0,11) + "\r\n" + str.substring(12,str.length);
const level2 = str1


let first = 'Base Charges'

const second = +(area)+ 'sqft X' +(this.diffDates(fromDate,toDate))+ 'days(@Rs.' +  (perDayRupees) +'/sqft)'

    return (
      <div>
        <Card
          textChildren={ 
            <div>
              <div className="rainmaker-displayInline">
                <div className="col-md-4">
                  <Label label="BK_MYBK_FEE_ESTIMATE" containerStyle={{ marginLeft: "13px" }} labelClassName="dark-heading" />
                </div>
                <div className="col-md-4">
                </div>
                <div className="col-md-4">
                  <h5>Total Amount</h5>                
          <h3><b>Rs {paymentDetails?paymentDetails.totalAmount:'NA'}</b></h3>
                </div>
              </div>
                <div className="complaint-detail-detail-section-status row">
                  <div>
                    <div className="col-xs-12">
                      <div className="col-sm-4 col-xs-12">
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color"                       
                        label={first }
                        />
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color"    
                        labelStyle={{ fontstyle: "italic" }}                 
                        label={second }
                        />
                        <Label 
                          className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                          id="complaint-details-submission-date"
                          labelStyle={{ color: "inherit" }}
                          
                        />
                      </div>
                      <div className="col-sm-4 col-xs-12">
                        <div >
                      <h5 style={{align : "right"}}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[1].amount}</h5>
                     
                      </div>
                      </div>
                      <div className="col-sm-4 col-xs-12">
                      </div>
                    </div>
                    
                   <div className="col-xs-12">
                      <div className="col-sm-4 col-xs-12">
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TAX_RENT" />
                        <Label
                          className="col-xs-12 col-sm-12 col-md-12  status-result-color"
                          id="complaint-details-submission-date"
                          labelStyle={{ color: "inherit" }}
                          label={bkPaymentStatus}
                        />
                      </div>
                      <div className="col-sm-4 col-xs-12">                      
                      <h5 style={{align : "right"}}>{paymentDetails && paymentDetails.billDetails[0] && paymentDetails.billDetails[0].billAccountDetails[0].amount}</h5>
                      </div>                  
                      <div className="col-sm-4 col-xs-12">
                      </div>
                    </div>
                    <hr class="MuiDivider" style={{marginbottom: "16px"}}></hr>
                    <div className="col-xs-12">
                      <div className="col-sm-4 col-xs-12">
                        <Label className="col-xs-12  col-sm-12 col-md-12 status-color" label="BK_MYBK_TOTAL_AMOUNT" />
                        <Label
                          className="col-xs-12 col-sm-12 col-md-12  status-result-color"

                          id="complaint-details-submission-date"
                          labelStyle={{ color: "inherit" }}
                         
                        />
                      </div>
                      <div className="col-sm-4 col-xs-12">
              <h5>{paymentDetails?paymentDetails.totalAmount:'NA'}</h5>
                      </div>
                      <div className="col-sm-4 col-xs-12">
                      </div>
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

export default PayDetails;
