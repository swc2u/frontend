import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import {
  createPACCApplication,
  updatePACCApplication,
  fetchPayment,
  fetchApplications,
  fetchDataAfterPayment,
} from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import EditIcon from "@material-ui/icons/Edit";
import "./index.css";
import Footer from "../../../modules/footer";
import PaymentReceiptDetail from "../PaymentReceiptDetail";
import PaymentOptionDetails from "../PaymentOptionDetails";
import PaymentDetails from "../PaymentDetails";
// import DateVenueChangePayDetail from "../DateVenueChangePayDetail"
// import SubmitPaymentDetails from "../SubmitPaymentDetails"
import { getFileUrlFromAPI } from "../../../modules/commonFunction";
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api"; //PaymentDetailsTwo
// import PaymentDetailsTwo from "../PaymentDetailsTwo"

class SummaryDetails extends Component {
  state = {
    PayerName: "",
    mobileNo: "",
    PaidBy: "",
    PaymentReceiptNumber: "",
    transactionDate: "",
    ChequeNo: "",
    ChequeDate: "",
    IFSC: "",
    BankName: "",
    BankBranch: "",
    DDno: "",
    ddDate: "",
    ddIFSC: "",
    ddBank: "",
    ddBranch: "",
    last4Digits: "",
    TrxNo: "",
    repeatTrxNo: "",
    SubmitDetails: false,
    justTry: "",
  };

  componentDidMount = async () => {
    let fetchUrl = window.location.pathname;
    console.log(fetchUrl);

    let fetchApplicationNumber = fetchUrl.substring(
      fetchUrl.lastIndexOf("/") + 1
    );
    console.log("fetchApplicationNumber--", fetchApplicationNumber);

    let {
      createPACCApplication,
      userInfo,
      documentMap,
      fetchPayment,
      fetchDataAfterPayment,
      prepareFinalObject,
      fetchApplications,
    } = this.props;
    let {
      firstName,
      venueType,
      bokingType,
      bookingData,
      email,
      mobileNo,
      surcharge,
      fromDate,
      toDate,
      myLocationtwo,
      utGST,
      cGST,
      GSTnumber,
      dimension,
      location,
      facilitationCharges,
      cleaningCharges,
      rent,
      houseNo,
      type,
      purpose,
      locality,
      residenials,
      facilationChargesSuccess,
      discountType,
    } = this.props;

    // await fetchApplications(
    //     {
    //         "applicationNumber": fetchApplicationNumber, 'uuid': userInfo.uuid,
    //         "applicationStatus": "",
    //         "mobileNumber": "", "bookingType": "",
    //         "tenantId":userInfo.tenantId
    //     }
    // );

    fetchPayment([
      { key: "consumerCode", value: fetchApplicationNumber },
      {
        key: "businessService",
        value: "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR",
      },
      { key: "tenantId", value: userInfo.tenantId },
    ]);

    fetchDataAfterPayment([
      { key: "consumerCodes", value: fetchApplicationNumber },
      { key: "tenantId", value: userInfo.tenantId },
    ]);
  };

  handleChange = (input) => (e) => {
    const { prepareFinalObject } = this.props;
    this.setState({ [input]: e.target.value });
    prepareFinalObject(input, e.target.value);
  };

  transactionDateChange = (e) => {
    const { prepareFinalObject } = this.props;
    const trDate = e.target.value;
    this.setState({
      transactionDate: trDate,
    });
    prepareFinalObject("transactionDate", trDate);
  };

  changeChequeDate = (e) => {
    const { prepareFinalObject } = this.props;
    const cqDate = e.target.value;
    this.setState({
      ChequeDate: cqDate,
    });
    prepareFinalObject("ChequeDate", cqDate);
  };

  changeDdDate = (e) => {
    const { prepareFinalObject } = this.props;
    const cDdDate = e.target.value;
    this.setState({
      ddDate: cDdDate,
    });
    prepareFinalObject("ChangeDdDate", cDdDate);
  };

  submit = async (e) => {
    let ApplicantName = this.props.RoomBookingData.bookingsModelList[0]
      .bkApplicantName;
    let ApplicantMobNum = this.props.RoomBookingData.bookingsModelList[0]
      .bkMobileNumber;
    console.log("propsInpayPage--", this.props);

    // alert("hello generate receipt")
    const {
      TotalAmount,
      billId,
      prepareFinalObject,
      paymentMode,
      ppaidBy,
      pChequeNo,
      ChnChqDate,
      newDDno,
      NewTrxNo,
      NewddDate,
      pddIFSC,
      pIFSC,
    } = this.props;
    console.log("this.props---", this.props);

    let {
      acRoomId,
      nonAcRoomId,
      discountForRoom,
      GlobalNonAccRoomToBook,
      GlobalAccRoomToBook,
      RoomId,
      AppNum,
      DataForRoomBooking,
      roomFromDate,
      roomToDate,
      userInfo,
      bothRoom,
      typeOfRoom,
      totalRoom,
      updateNumOfAcRoom,
      updateNumOfNonAcRoom,
    } = this.props;
    console.log("typesforDiscount--", typeof discountForRoom);

    let BothRoomSelect = [];
    if (bothRoom == "Both") {
      console.log("one");
      BothRoomSelect = [
        {
          id: acRoomId,
          roomApplicationNumber: AppNum,
          action: "OFFLINE_APPLY",
          remarks: "string",
          roomBusinessService: "BKROOM",
          discount: discountForRoom,
          totalNoOfRooms: updateNumOfAcRoom,
          typeOfRoom: "AC", //updateNumOfAcRoom,updateNumOfNonAcRoom
          fromDate: roomFromDate,
          toDate: roomToDate,
        },
        {
          id: nonAcRoomId,
          roomApplicationNumber: AppNum,
          action: "OFFLINE_APPLY",
          remarks: "string",
          discount: discountForRoom,
          roomBusinessService: "BKROOM",
          totalNoOfRooms: updateNumOfNonAcRoom,
          typeOfRoom: "NON-AC",
          fromDate: roomFromDate,
          toDate: roomToDate,
        },
      ];
    } else if (bothRoom == "AC") {
      console.log("two");
      BothRoomSelect = [
        {
          id: acRoomId,
          roomApplicationNumber: AppNum,
          action: "OFFLINE_APPLY",
          remarks: "string",
          roomBusinessService: "BKROOM",
          discount: discountForRoom,
          totalNoOfRooms: updateNumOfAcRoom,
          typeOfRoom: typeOfRoom,
          fromDate: roomFromDate,
          toDate: roomToDate,
        },
      ];
    } else if (bothRoom == "NON-AC") {
      console.log("three");
      BothRoomSelect = [
        {
          id: nonAcRoomId,
          roomApplicationNumber: AppNum,
          action: "OFFLINE_APPLY",
          remarks: "string",
          roomBusinessService: "BKROOM",
          discount: discountForRoom,
          totalNoOfRooms: updateNumOfNonAcRoom,
          typeOfRoom: typeOfRoom,
          fromDate: roomFromDate,
          toDate: roomToDate,
        },
      ];
    }
    console.log("BothRoomSelect--success--", BothRoomSelect);

    let ppMode = paymentMode && paymentMode ? paymentMode : " ";
    let PaymentReqBody;
    if (ppMode == "Cash") {
      PaymentReqBody = {
        Payment: {
          paymentDetails: [
            {
              businessService: "BKROOM",
              billId: billId,
              totalDue: TotalAmount,
              totalAmountPaid: TotalAmount,
            },
          ],
          tenantId: userInfo.tenantId,
          totalDue: TotalAmount,
          paymentMode: ppMode,
          paidBy: ppaidBy,
          mobileNumber: ApplicantMobNum,
          payerName: ApplicantName,
          totalAmountPaid: TotalAmount,
        },
      };
    }
    if (ppMode == "Cheque") {
      PaymentReqBody = {
        Payment: {
          paymentDetails: [
            {
              businessService: "BKROOM",
              billId: billId,
              totalDue: TotalAmount,
              totalAmountPaid: TotalAmount,
            },
          ],
          tenantId: userInfo.tenantId,
          totalDue: TotalAmount,
          paymentMode: ppMode,
          paidBy: ppaidBy,
          mobileNumber: ApplicantMobNum,
          payerName: ApplicantName,
          transactionNumber: pChequeNo,
          instrumentNumber: pChequeNo,
          instrumentDate: ChnChqDate,
          totalAmountPaid: TotalAmount,
        },
      };
    }
    if (ppMode == "DD") {
      PaymentReqBody = {
        Payment: {
          paymentDetails: [
            {
              businessService: "BKROOM",
              billId: billId,
              totalDue: TotalAmount,
              totalAmountPaid: TotalAmount,
            },
          ],
          tenantId: userInfo.tenantId,
          totalDue: TotalAmount,
          paymentMode: ppMode,
          paidBy: ppaidBy,
          mobileNumber: ApplicantMobNum,
          payerName: ApplicantName,
          transactionNumber: newDDno,
          instrumentNumber: newDDno,
          instrumentDate: NewddDate,
          totalAmountPaid: TotalAmount,
        },
      };
    }
    if (ppMode == "Card") {
      PaymentReqBody = {
        Payment: {
          paymentDetails: [
            {
              businessService: "BKROOM",
              billId: billId,
              totalDue: TotalAmount,
              totalAmountPaid: TotalAmount,
            },
          ],
          tenantId: userInfo.tenantId,
          totalDue: TotalAmount,
          paymentMode: ppMode,
          paidBy: ppaidBy,
          mobileNumber: ApplicantMobNum,
          payerName: ApplicantName,
          transactionNumber: NewTrxNo,
          instrumentNumber: NewTrxNo,
          totalAmountPaid: TotalAmount,
        },
      };
    }

    console.log("PaymentReqBody--", PaymentReqBody);

    let EmpPayment = await httpRequest(
      "collection-services/payments/_create?",
      "_search",
      [],
      PaymentReqBody
    );

    console.log("EmpPayment--", EmpPayment);


    if(EmpPayment && EmpPayment.Payments !== undefined && EmpPayment.Payments !== null && EmpPayment.Payments.length > 0){
        prepareFinalObject("ResponseOfCashPayment", EmpPayment);

        let ReceiptNum =
          EmpPayment && EmpPayment
            ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber
            : "notFound";
        console.log("ReceiptNum--", ReceiptNum);
    
        prepareFinalObject("CollectionReceiptNum", ReceiptNum);
    
        let Booking = {
            bkRemarks: null,
            reInitiateStatus: false,
            bkApplicationNumber:
            DataForRoomBooking.bookingsModelList[0].bkApplicationNumber,
            bkHouseNo: DataForRoomBooking.bookingsModelList[0].bkHouseNo,
            bkAddress: null,
            bkSector: DataForRoomBooking.bookingsModelList[0].bkSector,
            bkVillCity: null,
            bkAreaRequired: null,
            bkDuration: "FULLDAY",
            bkCategory: null,
            bkEmail: DataForRoomBooking.bookingsModelList[0].bkEmail,
            bkContactNo: null,
            bkDocumentUploadedUrl: null,
            bkDateCreated: DataForRoomBooking.bookingsModelList[0].bkDateCreated,
            bkCreatedBy: null,
            bkWfStatus: null,
            bkAmount: null,
            bkPaymentStatus: "SUCCESS",
            bkBookingType: DataForRoomBooking.bookingsModelList[0].bkBookingType,
            bkFromDate: DataForRoomBooking.bookingsModelList[0].bkFromDate,
            bkToDate: DataForRoomBooking.bookingsModelList[0].bkToDate,
            bkApplicantName: DataForRoomBooking.bookingsModelList[0].bkApplicantName,
            bkBookingPurpose:
              DataForRoomBooking.bookingsModelList[0].bkBookingPurpose,
            bkVillage: null,
            bkDimension: DataForRoomBooking.bookingsModelList[0].bkDimension,
            bkLocation: DataForRoomBooking.bookingsModelList[0].bkLocation,
            bkStartingDate: null,
            bkEndingDate: null,
            bkType: null,
            bkResidenceProof: null,
            bkCleansingCharges:
              DataForRoomBooking.bookingsModelList[0].bkCleansingCharges,
            bkRent: DataForRoomBooking.bookingsModelList[0].bkRent,
            bkSurchargeRent: DataForRoomBooking.bookingsModelList[0].bkSurchargeRent,
            bkFacilitationCharges:
              DataForRoomBooking.bookingsModelList[0].bkFacilitationCharges,
            bkUtgst: DataForRoomBooking.bookingsModelList[0].bkUtgst,
            bkCgst: DataForRoomBooking.bookingsModelList[0].bkCgst,
            bkMobileNumber: DataForRoomBooking.bookingsModelList[0].bkMobileNumber,
            bkCustomerGstNo: DataForRoomBooking.bookingsModelList[0].bkCustomerGstNo,
            bkCurrentCharges: null,
            bkLocationChangeAmount: null,
            bkVenue: null,
            bkDate: null,
            bkFatherName: null,
            bkBookingVenue: DataForRoomBooking.bookingsModelList[0].bkBookingVenue,
            bkBookingDuration: null,
            bkIdProof: null,
            bkApplicantContact: null,
            bkOpenSpaceLocation: null,
            bkLandmark: null,
            bkRequirementArea: null,
            bkLocationPictures: null,
            bkParkOrCommunityCenter: null,
            bkRefundAmount: DataForRoomBooking.bookingsModelList[0].bkRefundAmount,
            bkBankAccountNumber:
              DataForRoomBooking.bookingsModelList[0].bkBankAccountNumber,
            bkBankName: DataForRoomBooking.bookingsModelList[0].bkBankName,
            bkIfscCode: DataForRoomBooking.bookingsModelList[0].bkIfscCode,
            bkAccountType: DataForRoomBooking.bookingsModelList[0].bkAccountType,
            bkBankAccountHolder:
              DataForRoomBooking.bookingsModelList[0].bkBankAccountHolder,
            bkPropertyOwnerName: null,
            bkCompleteAddress: null,
            bkResidentialOrCommercial: null,
            bkMaterialStorageArea: null,
            bkPlotSketch: null,
            bkApplicationStatus:
              DataForRoomBooking.bookingsModelList[0].bkApplicationStatus,
            bkTime: null,
            bkStatusUpdateRequest: null,
            bkStatus: null,
            bkDriverName: null,
            bkVehicleNumber: null,
            bkEstimatedDeliveryTime: null,
            bkActualDeliveryTime: null,
            bkNormalWaterFailureRequest: null,
            bkUpdateStatusOption: null,
            bkAddSpecialRequestDetails: null,
            bkBookingTime: null,
            bkApprovedBy: null,
            bkModuleType: null,
            // "uuid": "5f09ffbe-db9f-41e8-a9b2-dda6515d9cc7",
            tenantId: DataForRoomBooking.bookingsModelList[0].tenantId,
            bkAction: DataForRoomBooking.bookingsModelList[0].bkAction,
            bkConstructionType: null,
            businessService: DataForRoomBooking.bookingsModelList[0].businessService,
            bkApproverName: null,
            assignee: null,
            wfDocuments: null,
            financialYear: "2020-2021",
            financeBusinessService:
              "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR",
            // "roomBusinessService": "BKROOM",
            roomsModel: BothRoomSelect,
          };

          console.log("BookingOfPayPage",Booking)

          let createAppData = {
            applicationType: "PACC",
            applicationStatus: null,
            applicationId:
              DataForRoomBooking.bookingsModelList[0].bkApplicationNumber,
            tenantId: userInfo.tenantId,
            Booking: Booking,
          };
      
          console.log("createAppData--", createAppData);
      
          let payloadfund = await httpRequest(
            "bookings/community/room/_update",
            "_search",
            [],
            createAppData
          );
      
          console.log("payloadfund--", payloadfund); 
      
          this.props.prepareFinalObject("ApplicationCreateForRoom", payloadfund);

if(payloadfund && payloadfund.status == "200"){
    this.props.history.push(`/egov-services/Room-Payment-Success`);
}
else{
    this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Something went wrong.Try Again",
          labelKey: `BK_CC_ROOM_GETTING_WRONG`
        },
        "error"
      );
}
 }
     else{
        this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "Something went wrong.Try Again",
              labelKey: `BK_CC_ROOM_GETTING_WRONG`
            },
            "error"
          );
     }
};

  firstStep = (e) => {
    e.preventDefault();
    this.props.firstStep();
  };
  back = (e) => {
    e.preventDefault();
    this.props.prevStep();
  };
  callApiForDocumentData = async (e) => {
    const { documentMap, userInfo } = this.props;
    var documentsPreview = [];
    if (documentMap && Object.keys(documentMap).length > 0) {
      let keys = Object.keys(documentMap);
      let values = Object.values(documentMap);
      let id = keys[0],
        fileName = values[0];

      documentsPreview.push({
        title: "DOC_DOC_PICTURE",
        fileStoreId: id,
        linkText: "View",
      });
      let changetenantId = userInfo.tenantId
        ? userInfo.tenantId.split(".")[0]
        : "ch";
      let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
      let fileUrls =
        fileStoreIds.length > 0
          ? await getFileUrlFromAPI(fileStoreIds, changetenantId)
          : {};

      documentsPreview = documentsPreview.map(function (doc, index) {
        doc["link"] =
          (fileUrls &&
            fileUrls[doc.fileStoreId] &&
            fileUrls[doc.fileStoreId].split(",")[0]) ||
          "";

        doc["name"] =
          (fileUrls[doc.fileStoreId] &&
            decodeURIComponent(
              fileUrls[doc.fileStoreId]
                .split(",")[0]
                .split("?")[0]
                .split("/")
                .pop()
                .slice(13)
            )) ||
          `Document - ${index + 1}`;
        return doc;
      });
      setTimeout(() => {
        window.open(documentsPreview[0].link);
      }, 100);
      prepareFinalObject("documentsPreview", documentsPreview);
    }
  };

  render() {
    // const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate, facilationChargesSuccess,
    //     onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
    //     dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
    //     BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
    //     PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE
    //     } = this.props;

    // console.log(",one,two,three,four,five,six--",one,two,three,four,five,six)
    // console.log("propsInRendersummary--",this.props)
    // let fc = fCharges?fCharges.facilitationCharge:'100';
    // console.log("stateofBooking--",this.state.createPACCApp)
    const { paymentDetails, TotalAmount, billId, userInfo } = this.props;
    let ApplicantName = this.props.RoomBookingData.bookingsModelList[0]
      .bkApplicantName;
    let ApplicantMobNum = this.props.RoomBookingData.bookingsModelList[0]
      .bkMobileNumber;
    console.log("propsInpayPage--", this.props);
    let {
      PayerName,
      mobileNo,
      PaidBy,
      transactionDate,
      PaymentReceiptNumber,
      ChequeNo,
      ChequeDate,
      IFSC,
      BankName,
      last4Digits,
      TrxNo,
      repeatTrxNo,
      BankBranch,
      DDno,
      ddDate,
      ddIFSC,
      ddBank,
      ddBranch,
    } = this.state;
    console.log("this.state--", ChequeNo);
    console.log("this.state--PaidBy", PaidBy);
    return (
      <div>
        <div className="form-without-button-cont-generic">
          <div classsName="container">
            <div className="col-xs-12">
              {/* {this.props.ApplicantAppStatus != "OFFLINE_RE_INITIATED" ? 
 <PaymentDetails
 paymentDetails={paymentDetails && paymentDetails}
  />     
: ""} */}

              <PaymentDetails
                one={this.props.one}
                two={this.props.two}
                three={this.props.three}
                four={this.props.four}
                paymentDetails={paymentDetails && paymentDetails}
              />

              {/* 
{this.props.ApplicantAppStatus == "OFFLINE_RE_INITIATED" ? 
<DateVenueChangePayDetail 
paymentDetails={paymentDetails && paymentDetails}
Status={this.props.ApplicantAppStatus && this.props.ApplicantAppStatus}
/>
:""} */}

              <PaymentOptionDetails
                PaymentReceiptNumber={PaymentReceiptNumber}
                PayerName={PayerName}
                ChequeNo={ChequeNo}
                ChequeDate={ChequeDate}
                IFSC={IFSC}
                BankName={BankName}
                BankBranch={BankBranch}
                DDno={DDno}
                ddDate={ddDate}
                ddIFSC={ddIFSC}
                ddBank={ddBank}
                ddBranch={ddBranch}
                last4Digits={last4Digits}
                TrxNo={TrxNo}
                repeatTrxNo={repeatTrxNo}
                handleChange={this.handleChange}
                changeChequeDate={this.changeChequeDate}
                changeDdDate={this.changeDdDate}
                mobileNo={mobileNo}
                PaidBy={PaidBy}
                ApplicantMobNum={
                  ApplicantMobNum && ApplicantMobNum
                    ? ApplicantMobNum
                    : "notFound"
                }
                ApplicantName={
                  ApplicantName && ApplicantName ? ApplicantName : "Notfound"
                }
              />

              <PaymentReceiptDetail
                PaymentReceiptNumber={PaymentReceiptNumber}
                handleChange={this.handleChange}
                transactionDateChange={this.transactionDateChange}
                transactionDate={transactionDate}
              />

              {this.state.SubmitDetails == true ? (
                <SubmitPaymentDetails
                  TotalAmount={TotalAmount}
                  billId={billId}
                  userInfo={userInfo}
                  ApplicantName={ApplicantName}
                  ApplicantMobNum={ApplicantMobNum}
                  PaidBy={PaidBy}
                  justTry={this.state.justTry}
                />
              ) : (
                console.log(
                  "your state is not true till yet--",
                  this.state.SubmitDetails
                )
              )}

              <div className="col-xs-12" style={{ marginLeft: "10px" }}>
                <div
                  className="col-sm-12 col-xs-12"
                  style={{ marginBottom: "90px" }}
                >
                  <div className="complaint-detail-detail-section-status row">
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer
          className="apply-wizard-footer"
          style={{ display: "flex", justifyContent: "flex-end" }}
          children={
            <div className="responsive-action-button-cont">
              {/* <Button
                            className="responsive-action-button"
                            primary={true}
                            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
                            fullWidth={true}
                            onClick={this.back}
                            style={{ marginRight: 18 }}
                            startIcon={<ArrowBackIosIcon />}
                        /> */}
              <Button
                className="responsive-action-button"
                primary={true}
                label={
                  <Label buttonLabel={true} label="BK_MYBK_GENERATE_RECEIPT" />
                }
                fullWidth={true}
                onClick={this.submit}
                style={{ rightIcon: "arrow_drop_down" }}
              />
            </div>
          }
        ></Footer>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { bookings, common, auth, form } = state;
  const { createPACCApplicationData } = bookings;
  const { userInfo } = state.auth;
  const { facilationChargesSuccess, arrayName } = bookings;
  const { applicationData } = bookings;
  console.log("BookingInPayment--", bookings);
  
  const { paymentData } = bookings;
  let paymentDataOne = paymentData ? paymentData : "wrong";
  let paidBy = state.screenConfiguration.preparedFinalObject.PaidBy
    ? state.screenConfiguration.preparedFinalObject.PaidBy
    : " ";
  let ppaidBy = paidBy && paidBy ? paidBy : " ";
  console.log("ppaidBy--", ppaidBy);

  console.log("paymentDataOne--", paymentDataOne);
  let checkBillLength =
    paymentDataOne != "wrong" ? paymentDataOne.Bill.length > 0 : "";
  let totalAmountSuPage = checkBillLength
    ? paymentDataOne.Bill[0].totalAmount
    : "notfound";
  console.log("totalAmountSuPage-", totalAmountSuPage);
  let paymentDetails;
  paymentDetails = paymentData ? paymentData.Bill[0] : "";
  let TotalAmount = paymentDetails
    ? paymentDetails.totalAmount
    : "NotFoundAnyAmount";
  console.log("TotalAmount--", TotalAmount);
  let billId = paymentDetails
    ? paymentData.Bill[0].billDetails[0].billId
    : "NotFoundAnyBillId";
  console.log("billId--", billId);
  let billAccountDetailsArray = checkBillLength
    ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails
    : "NOt found Any Array";
  console.log("billAccountDetailsArray--", billAccountDetailsArray);
  let one = 0;
  let two = 0;
  let three = 0;
  let four = 0;
  let five = 0;
  let six = 0;
  for (let i = 0; i < billAccountDetailsArray.length; i++) {
    if (
      billAccountDetailsArray[i].taxHeadCode ==
      "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
    ) {
      one = billAccountDetailsArray[i].amount;
    } else if (
      billAccountDetailsArray[i].taxHeadCode ==
      "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
    ) {
      two = billAccountDetailsArray[i].amount;
    }
  }

  console.log("one--", one);
  console.log("two--", two);
  console.log("three--", three);
  console.log("four--", four);
  console.log("five--", five);
  console.log("six--", six);

  let paymentMode = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.paymentMode
    : "";

  //new data
  let RecNumber = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.CollectionReceiptNum
    : "NotAnyMore";
  console.log("RecNumber--", RecNumber);
  //RecNumber,offlinePayment,offlineTransactionNum,offlineTransactionDate,
  //offlinePayementMode,offlinePayementMode,totalAmountPaid,totalAmount
  let offlinePayment = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.ResponseOfCashPayment
    : "notFound";
  console.log("offlinePayment--", offlinePayment);


//   let RoomBookingData = state.screenConfiguration.preparedFinalObject
//   ? state.screenConfiguration.preparedFinalObject.RoomBookingData
//   : "NA";
// console.log("-RoomBookingData-", RoomBookingData);

  let RoomBookingData = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.RoomBookingData
    : "NA";
  console.log("-RoomBookingData-", RoomBookingData);

  let DataForRoomBooking = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.RoomBookingData
    : "NA";
  console.log("DataForRoomBooking-", DataForRoomBooking);
  let CreateRoomApplication = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.CreateRoomApplication
    : "NA";
  console.log("CreateRoomApplication-", CreateRoomApplication);
  let AppNum = CreateRoomApplication.data.roomsModel[0].roomApplicationNumber;
  console.log("AppNum--AppNum", AppNum);

  let acRoomId; //acRoomId,nonAcRoomId
  let nonAcRoomId;
  let updateNumOfAcRoom; //updateNumOfAcRoom,updateNumOfNonAcRoom

  let updateNumOfNonAcRoom;
  //data.roomsModel
  for (let i = 0; i < CreateRoomApplication.data.roomsModel.length; i++) {
    console.log(
      "CreateRoomApplication.data.roomsModel",
      CreateRoomApplication.data.roomsModel
    );
    if (CreateRoomApplication.data.roomsModel[i].typeOfRoom == "AC") {
      console.log(
        "CreateRoomApplication.TypeOfAcRoom",
        CreateRoomApplication.data.roomsModel[i]
      );
      updateNumOfAcRoom =
        CreateRoomApplication.data.roomsModel[i].totalNoOfRooms;
      acRoomId = CreateRoomApplication.data.roomsModel[i].id;
    }
    if (CreateRoomApplication.data.roomsModel[i].typeOfRoom == "NON-AC") {
      nonAcRoomId = CreateRoomApplication.data.roomsModel[i].id;
      updateNumOfNonAcRoom =
        CreateRoomApplication.data.roomsModel[i].totalNoOfRooms;
    }
  }
  console.log("acRoomId--", acRoomId);
  console.log("nonAcRoomId--", nonAcRoomId);
  console.log("updateNumOfAcRoom--", updateNumOfAcRoom);
  console.log("updateNumOfNonAcRoom--", updateNumOfNonAcRoom);
  let totalRoom = CreateRoomApplication.data.roomsModel[0].totalNoOfRooms;
  console.log("totalRoom--", totalRoom);

  let discountForRoom = CreateRoomApplication.data.roomsModel[0].discount;
  console.log("discountForRoom--", discountForRoom);
  //GlobalNonAccRoomToBook,GlobalAccRoomToBook
  let GlobalNonAccRoomToBook = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook !=
        undefined &&
      state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook !=
        null
      ? state.screenConfiguration.preparedFinalObject.GlobalNonAccRoomToBook
      : "NA"
    : "NA";
  console.log("GlobalNonAccRoomToBook--", GlobalNonAccRoomToBook);
  let GlobalAccRoomToBook = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook !=
        undefined &&
      state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook != null
      ? state.screenConfiguration.preparedFinalObject.GlobalAccRoomToBook
      : "NA"
    : "NA";
  console.log("GlobalAccRoomToBook-", GlobalAccRoomToBook);

  let typeOfRoom = CreateRoomApplication.data.roomsModel[0].typeOfRoom;
  console.log("totalRoom--", typeOfRoom);

  let roomFromDate = CreateRoomApplication.data.roomsModel[0].fromDate;
  console.log("roomFromDate--roomFromDate", roomFromDate);

  let roomToDate = CreateRoomApplication.data.roomsModel[0].toDate;
  console.log("roomToDate--roomToDate", roomToDate); //roomFromDate,roomToDatep

  let RoomId = CreateRoomApplication.data.roomsModel[0].id;
  console.log("RoomId--", RoomId);

  let bothRoom = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !==
        undefined &&
      state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== null
      ? state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom
      : "NA"
    : "NA";
  console.log("bothRoom--", bothRoom);

  //transactionNum
  let offlineTransactionNum = offlinePayment
    ? offlinePayment.Payments[0].transactionNumber
    : "NotFound";
  console.log("offlineTransactionNum--", offlineTransactionNum);

  //transactionDate
  let offlineTransactionDate = offlinePayment
    ? offlinePayment.Payments[0].transactionDate
    : "NotFound";
  console.log("offlineTransactionDate--", offlineTransactionDate);

  //paymentMode
  let offlinePayementMode = offlinePayment
    ? offlinePayment.Payments[0].paymentMode
    : "NotFound";
  console.log("offlinePayementMode--", offlinePayementMode);

  //totalAmountPaid
  let totalAmountPaid = offlinePayment
    ? offlinePayment.Payments[0].paymentDetails[0].bill.totalAmount
    : "NotFound";
  console.log("totalAmountPaid--", totalAmountPaid);

  //base charges
  let totalAmount = offlinePayment
    ? offlinePayment.Payments[0].paymentDetails[0].bill
    : "NotFound"; // till here

  console.log("paymentMode--", paymentMode);

  return {
    typeOfRoom,
    totalRoom,
    GlobalNonAccRoomToBook,
    GlobalAccRoomToBook,
    discountForRoom,
    acRoomId,
    nonAcRoomId,
    updateNumOfAcRoom,
    updateNumOfNonAcRoom,
    RecNumber,
    offlinePayment,
    offlineTransactionNum,
    offlineTransactionDate,
    AppNum,
    roomFromDate,
    roomToDate,
    offlinePayementMode,
    totalAmountPaid,
    totalAmount,
    RoomBookingData,
    RoomId,
    DataForRoomBooking,
    bothRoom, //below is previous data
    ppaidBy,
    RoomBookingData,
    userInfo,
    paymentMode,
    one,
    two,
    three,
    four,
    five,
    six,
    paymentDataOne,
    checkBillLength,
    totalAmountSuPage,
    paymentDetails,
    TotalAmount,
    billId,
    billAccountDetailsArray,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // fetchApplications: criteria => dispatch(fetchApplications(criteria)),
    fetchDataAfterPayment: (criteria) =>
      dispatch(fetchDataAfterPayment(criteria)),
    // createPACCApplication: (criteria, hasUsers, overWrite) => dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
    // updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchPayment: (criteria) => dispatch(fetchPayment(criteria)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryDetails);
