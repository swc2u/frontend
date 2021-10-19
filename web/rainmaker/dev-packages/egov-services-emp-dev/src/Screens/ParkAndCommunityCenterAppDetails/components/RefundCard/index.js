import React, { Component } from "react";
import Label from "egov-ui-kit/utils/translationNode";
import isEmpty from "lodash/isEmpty";
import "./index.css";
import { httpRequest } from "egov-ui-kit/utils/api";
import { fetchDataAfterPayment } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { Tabs, Card, TextField, Icon, Button } from "components";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";

class AppDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAmount: "",
      payload: "",
      one: "",
      NewReFund: "",
      lastAmountShow: "",
      ShowRefundAmount: "",
      CommGrndRefundAmount: "",
      refundableSecurityFieldDisabled: false,
      cgrefundAmountDisable: false,
      refundcgAmount: true,
    };
  }

  async componentDidMount() {
    let { selectedComplaint, CommercialSecurityCharges, state,userInfo } = this.props;
    const {
      applicationNo,
      bkFromDate,
      bkToDate,
      tenantId,
      paymentDetails,
      fetchDataAfterPayment,
      fetchPaymentAfterPayment,
      hh,
      bkApplicationStatus,
      refundableSecurityMoney,
      status,
      bookedRoomArray,
    } = this.props;
    

    const foundFirstLavel =
    userInfo &&
    userInfo.roles.some(
      (el) => el.code === "BK_CLERK" || el.code === "BK_DEO"
    );

    /**
     * Code for Commercial ground refund amount
     */

    if (selectedComplaint.businessService == "GFCP") {
      

      let RequestData = [
        { key: "consumerCodes", value: selectedComplaint.bkApplicationNumber },
        { key: "tenantId", value: selectedComplaint.tenantId },
      ];
      let payloadfundAmount = await httpRequest(
        "collection-services/payments/_search?",
        "_search",
        RequestData
      );

      let RefoundCGAmount = 0;

      let getPaymentArray =
        payloadfundAmount.Payments !== null &&
        payloadfundAmount.Payments !== undefined &&
        payloadfundAmount.Payments.length > 0
          ? payloadfundAmount.Payments[0].paymentDetails !== null &&
            payloadfundAmount.Payments[0].paymentDetails !== undefined &&
            payloadfundAmount.Payments[0].paymentDetails.length > 0
            ? payloadfundAmount.Payments[0].paymentDetails[0].bill !== null &&
              payloadfundAmount.Payments[0].paymentDetails[0].bill !== undefined
              ? payloadfundAmount.Payments[0].paymentDetails[0].bill
                  .billDetails !== null &&
                payloadfundAmount.Payments[0].paymentDetails[0].bill
                  .billDetails !== undefined &&
                payloadfundAmount.Payments[0].paymentDetails[0].bill.billDetails
                  .length > 0
                ? payloadfundAmount.Payments[0].paymentDetails[0].bill
                    .billDetails[0].billAccountDetails !== undefined &&
                  payloadfundAmount.Payments[0].paymentDetails[0].bill
                    .billDetails[0].billAccountDetails !== null &&
                  payloadfundAmount.Payments[0].paymentDetails[0].bill
                    .billDetails[0].billAccountDetails.length > 0
                  ? payloadfundAmount.Payments[0].paymentDetails[0].bill
                      .billDetails[0].billAccountDetails
                  : "NotFound"
                : "NotFound"
              : "NotFound"
            : "NotFound"
          : "NotFound";
 
      for (let i = 0; i < getPaymentArray.length; i++) {
        if (
          getPaymentArray[i].taxHeadCode ==
          "SECURITY_COMMERCIAL_GROUND_BOOKING_BRANCH"
        ) {
          RefoundCGAmount = getPaymentArray[i].amount;
        }
      }
    

      if (selectedComplaint.bkApplicationStatus == "REFUND_APPROVED") {
        this.setState({
          refundableSecurityFieldDisabled: true,
          CommGrndRefundAmount: this.props.refundableSecurityMoney,
        });
      } 
      else {
        this.props.prepareFinalObject("editableCommercialGrndRefundAmount", RefoundCGAmount)
        this.setState({
          refundableSecurityFieldDisabled: foundFirstLavel ? false : true,
          CommGrndRefundAmount: RefoundCGAmount,
        });
      }
    } 
    else {
    /**
     * Code for pacc refund Amount
     */
      if (hh != "NotFound") {
        this.setState({
          one: hh,
        });
      }
      let RequestData = [
        { key: "consumerCodes", value: applicationNo },
        { key: "tenantId", value: tenantId },
      ];
      let payloadfundAmount = await httpRequest(
        "collection-services/payments/_search?",
        "_search",
        RequestData
      );

      let AmountFromBackEnd = payloadfundAmount.Payments;
      let SecondFunRefAmt = 0;  
      //first  function
      if (status === "REFUND_APPROVED") {
        SecondFunRefAmt = refundableSecurityMoney;
      } else {
        SecondFunRefAmt = await this.BookingRefundAmount(
          applicationNo,
          tenantId,
          bkFromDate,
          AmountFromBackEnd,
          bookedRoomArray
        );
        // this.props.parentCallback(SecondFunRefAmt);
      }

      this.props.prepareFinalObject("editableRefundAmount", SecondFunRefAmt)
    
      const labelLast = `Refund Amount - Rs.${SecondFunRefAmt}`;
      this.setState({
        lastAmountShow: labelLast,
        ShowRefundAmount: SecondFunRefAmt,
        refundableSecurityFieldDisabled:
          status === "REFUND_APPROVED" ? true : false,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    
    if (nextProps.RefAmount) {
    
      this.setState(
        {
          NewReFund: nextProps.RefAmount,
        }
      );
    }
  }


  ChangeRefundAmount = (e) => {
    this.setState(
      { ...this.state, ShowRefundAmount: e.target.value },
      this.props.prepareFinalObject("editableRefundAmount", e.target.value)
    );
    console.log("thisState",this.state)
  };

  ChangeCGRefundAmount = (e) => {
    this.setState(
      { ...this.state, CommGrndRefundAmount: e.target.value },
      this.props.prepareFinalObject(
        "editableCommercialGrndRefundAmount",
        e.target.value
      )
    );
  };

  BookingRefundAmount = async (
    applicationNumber,
    tenantId,
    bookingDate,
    AmountFromBackEnd,
    bookedRoomArray
  ) => {
    const {
      payloadone,
      payload,
      payloadTwo,
      ConRefAmt,
      fetchPaymentAfterPayment,
    } = this.props;

    var CheckDate = new Date(bookingDate);

    var todayDate = new Date();

    if (applicationNumber && tenantId) {
      if (AmountFromBackEnd && AmountFromBackEnd) {
        if (todayDate > CheckDate) {
          // alert("refundCondition")   [0].paymentDetails
          let billAccountDetails =
            AmountFromBackEnd[0].paymentDetails[0].bill.billDetails[0]
              .billAccountDetails;
          let bookingAmount = 0;
          for (let i = 0; i < billAccountDetails.length; i++) {
            if (
              billAccountDetails[i].taxHeadCode ==
                "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH" ||
              billAccountDetails[i].taxHeadCode ==
                "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
            ) {
              bookingAmount += billAccountDetails[i].amount;
            }
          }

          return bookingAmount;
        }
        if (todayDate < CheckDate) {
          /********************************/
          let bookingNos = [];
          let bookingNosString = "";
          let roomBookingAmount = 0;
          if (bookedRoomArray && bookedRoomArray.length > 0) {
            for (let i = 0; i < bookedRoomArray.length; i++) {
              if (
                !bookingNos.includes(bookedRoomArray[i].roomApplicationNumber)
              ) {
                bookingNos.push(bookedRoomArray[i].roomApplicationNumber);
                bookingNosString +=
                  bookedRoomArray[i].roomApplicationNumber + ",";
              }
            }
            bookingNosString = bookingNosString.slice(0, -1); 

            let RequestData = [
              { key: "consumerCodes", value: bookingNosString },
              { key: "tenantId", value: tenantId },
            ];

            let payload = await httpRequest(
              "collection-services/payments/_search",
              "_search",
              RequestData
            );

            if (payload) {
              let bookedRoomsPaymentDetails = payload.Payments;

              if (
                bookedRoomsPaymentDetails &&
                bookedRoomsPaymentDetails.length > 0
              ) {
                for (let j = 0; j < bookedRoomsPaymentDetails.length; j++) {
                  for (
                    let k = 0;
                    k <
                    bookedRoomsPaymentDetails[j].paymentDetails[0].bill
                      .billDetails[0].billAccountDetails.length;
                    k++
                  ) {
                    if (
                      bookedRoomsPaymentDetails[j].paymentDetails[0].bill
                        .billDetails[0].billAccountDetails[k].taxHeadCode ===
                      "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
                    ) {
                      roomBookingAmount +=
                        bookedRoomsPaymentDetails[j].paymentDetails[0].bill
                          .billDetails[0].billAccountDetails[k].amount;
                    }
                  }
                }
              }
            }
          }

          /********************************/
          // alert("cancelCondition")
          let billAccountDetails =
            AmountFromBackEnd[0].paymentDetails[0].bill.billDetails[0]
              .billAccountDetails;
          let bookingAmount = 0;
          let securityAmount = 0;
          for (let i = 0; i < billAccountDetails.length; i++) {
            if (
              billAccountDetails[i].taxHeadCode ==
                "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH" ||
              billAccountDetails[i].taxHeadCode ==
                "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
            ) {
              securityAmount = billAccountDetails[i].amount;
            }
            if (
              billAccountDetails[i].taxHeadCode ==
                "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH" ||
              billAccountDetails[i].taxHeadCode ===
                "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
            ) {
              bookingAmount = billAccountDetails[i].amount;
            }
          }
         
          if (roomBookingAmount && roomBookingAmount > 0) {
            bookingAmount += roomBookingAmount;
          }

          let mdmsBody = {
            MdmsCriteria: {
              tenantId: tenantId,
              moduleDetails: [
                {
                  moduleName: "Booking",
                  masterDetails: [
                    {
                      name: "bookingCancellationRefundCalc",
                    },
                  ],
                },
              ],
            },
          };

          let refundPercentage = "";

          let payloadRes = null;
          payloadRes = await httpRequest(
            "egov-mdms-service/v1/_search",
            "_search",
            [],
            mdmsBody
          );
         
          refundPercentage =
            payloadRes.MdmsRes.Booking.bookingCancellationRefundCalc[0];

          var date1 = new Date(bookingDate);

          var date2 = new Date();

          var Difference_In_Time = date1.getTime() - date2.getTime();

          // To calculate the no. of days between two dates
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

          let refundAmount = 0;
          if (Difference_In_Days > 29) {
            let refundPercent =
              refundPercentage.MORETHAN30DAYS.refundpercentage;

            refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100;
          } else if (Difference_In_Days > 15 && Difference_In_Days < 30) {
            let refundPercent =
              refundPercentage.LETTHAN30MORETHAN15DAYS.refundpercentage;
            refundAmount = (parseFloat(bookingAmount) * refundPercent) / 100;
          }
          else if(Difference_In_Days <= 15){
            return refundAmount = 0
          }
          return refundAmount + securityAmount;
        }
      }
    }
  };

  render() {
    const { RefAmount } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden",
    };
console.log("StateInRefundCard",this.state)
console.log("PropsInRefundCard",this.props)
    return (
      <div>
        <Card
          textChildren={
            <div>
              {this.props.selectedComplaint.businessService == "GFCP" ? (
                <TextField
                  id="RefundAmount"
                  name="RefundAmount"
                  type="number"
                  value={this.state.CommGrndRefundAmount}
                  disabled={this.state.refundableSecurityFieldDisabled}
                  pattern="[A-Za-z]"
                  // required = {true}
                  style={{ width: "60%", paddingLeft: "2%" }}
                  hintText={
                    <Label
                      label="Refund Amount"
                      color="rgba(0, 0, 0, 0.3799999952316284)"
                      fontSize={16}
                      labelStyle={hintTextStyle}
                    />
                  }
                  floatingLabelText={
                    <Label
                      key={0}
                      label="Refund Amount"
                      color="rgba(0,0,0,0.60)"
                      fontSize="12px"
                    />
                  }
                  onChange={(e) => this.ChangeCGRefundAmount(e)}
                  underlineStyle={{ bottom: 7 }}
                  underlineFocusStyle={{ bottom: 7 }}
                  hintStyle={{ width: "100%" }}
                />
              ) : (
                <TextField
                  id="RefundAmount"
                  name="RefundAmount"
                  type="number"
                  value={this.state.ShowRefundAmount}
                  disabled={this.state.refundableSecurityFieldDisabled}
                  pattern="[A-Za-z]"
                  // required = {true}
                  style={{ width: "60%", paddingLeft: "2%" }}
                  hintText={
                    <Label
                      label="Refund Amount"
                      color="rgba(0, 0, 0, 0.3799999952316284)"
                      fontSize={16}
                      labelStyle={hintTextStyle}
                    />
                  }
                  floatingLabelText={
                    <Label
                      key={0}
                      label="Refund Amount"
                      color="rgba(0,0,0,0.60)"
                      fontSize="12px"
                    />
                  }
                  onChange={(e) => this.ChangeRefundAmount(e)}
                  underlineStyle={{ bottom: 7 }}
                  underlineFocusStyle={{ bottom: 7 }}
                  hintStyle={{ width: "100%" }}
                />
              )}
            </div>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { bookings, common, auth, form } = state;

  const { fetchPaymentAfterPayment } = bookings;
  const { userInfo } = auth;
  let hh = fetchPaymentAfterPayment ? fetchPaymentAfterPayment : "NotFound";
  return {
    fetchPaymentAfterPayment,
    hh,
    state,userInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDataAfterPayment: (jsonPath, value) =>
      dispatch(fetchDataAfterPayment(jsonPath, value)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppDetails);
