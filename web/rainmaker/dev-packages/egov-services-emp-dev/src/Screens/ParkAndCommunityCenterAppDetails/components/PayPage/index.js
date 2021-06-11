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
import Footer from "../../../../modules/footer";
import PaymentReceiptDetail from "../PaymentReceiptDetail";
import PaymentOptionDetails from "../PaymentOptionDetails";
import PaymentDetails from "../PaymentDetails";
import DateVenueChangePayDetail from "../DateVenueChangePayDetail";
import SubmitPaymentDetails from "../SubmitPaymentDetails";
import { getFileUrlFromAPI } from "../../../../modules/commonFunction";
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-kit/utils/api"; //PaymentDetailsTwo
import PaymentDetailsTwo from "../PaymentDetailsTwo";
// import SuccessMessageForPCC from "../../modules/SuccessMessageForPCC";
import SuccessMessageForPCC from "../../../../modules/SuccessMessageForPCC"
import get from "lodash.get";

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
    CurrentApplicationNum: ""
  };

  componentDidMount = async () => {
    let fetchUrl = window.location.pathname;
    let fetchApplicationNumber = fetchUrl.substring(
      fetchUrl.lastIndexOf("/") + 1
    );
    this.setState({
      CurrentApplicationNum : fetchApplicationNumber
    })
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
      selectedComplaint,
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

    let NewfinanceBusinessService;
    if (selectedComplaint.bkBookingType == "Parks") {
      NewfinanceBusinessService = "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE";
    }
    if (selectedComplaint.bkBookingType == "Community Center") {
      NewfinanceBusinessService =
        "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR";
    }

    await fetchApplications({
      applicationNumber: fetchApplicationNumber,
      uuid: userInfo.uuid,
      applicationStatus: "",
      mobileNumber: "",
      bookingType: "",
      tenantId: userInfo.tenantId,
    });

    fetchPayment([
      { key: "consumerCode", value: fetchApplicationNumber },
      { key: "businessService", value: NewfinanceBusinessService },
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

  hasWhiteSpace(s) {
    let check;
    check = s.indexOf(' ') >= 0;
    console.log("check---check",check)
     return check
  }

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

  GoToApplyPage = (e) => {
    this.props.history.push(`/egov-services/applyPark-community-center`);
  };

  submit = async (e) => {
    const {
      TotalAmount,
      billId,
      userInfo,
      ApplicantName,
      ApplicantMobNum,
      prepareFinalObject,
      paymentMode,
      ppaidBy,
      pChequeNo,
      ChnChqDate,
      newDDno,
      NewTrxNo,
      NewddDate,
      pddIFSC,
      pIFSC,state,selectedComplaint
    } = this.props;
    let cardNumber , TransactionNum
    let ppMode = paymentMode && paymentMode ? paymentMode : " ";
    let PaymentReqBody;
    if (ppMode == "Cash") {
      PaymentReqBody = {
        Payment: {
          paymentDetails: [
            {
              businessService: "PACC",
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
      try{
        let EmpPayment = await httpRequest(
          "collection-services/payments/_create?",
          "_search",
          [],
          PaymentReqBody
        );
        if(EmpPayment.ResponseInfo.status == "200" && EmpPayment.Payments.length > 0){

          prepareFinalObject("ResponseOfCashPayment", EmpPayment);
  
          let Booking = {
            "bkApplicationNumber": this.state.CurrentApplicationNum,
            "cardNumber": "0000",
            "transactionNumber": this.state.PaymentReceiptNumber,
        }
          console.log("cash--Booking",Booking)
          let saveCardNum = await httpRequest(
            "bookings/api/save/cardDetails",
            "_search",
            [],
            {Booking:Booking}
          );
          console.log("saveCardNum",saveCardNum)
    
          let ReceiptNum =
            EmpPayment && EmpPayment
              ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber
              : "notFound";
          
      
          prepareFinalObject("CollectionReceiptNum", ReceiptNum);
  
          // TransactionNum = this.state.PaymentReceiptNumber
          // cardNumber = this.state.last4Digits
          this.props.history.push(`/egov-services/success-payment`);
  
        }
      }catch (error){
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "Payment failed please try again",
              labelKey: `Payment failed please try again`
            },
            "error"
          );  
      }  
    }
    if (ppMode == "Cheque") {
      if(pChequeNo !== " " && pChequeNo !== null && pChequeNo !== undefined && 
      ChnChqDate  !== "" && ChnChqDate  !== undefined && ChnChqDate  !== ""  && 
      this.state.ChequeNo !== "" && this.state.ChequeDate !== "" && this.state.IFSC !== "" && this.props.BranchName !== "NotFound" &&
      this.props.BankName !== "NotFound"){

if(ChnChqDate <= this.props.longtodayDate){
  
        PaymentReqBody = {
          Payment: {
            paymentDetails: [
              {
                businessService: "PACC",
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

        try{
          let EmpPayment = await httpRequest(
            "collection-services/payments/_create?",
            "_search",
            [],
            PaymentReqBody
          );
      
          
      
          if(EmpPayment.ResponseInfo.status == "200" && EmpPayment.Payments.length > 0){
  
            prepareFinalObject("ResponseOfCashPayment", EmpPayment);
    
            let Booking = {
              "bkApplicationNumber": this.state.CurrentApplicationNum,
              "cardNumber": "0000",
              "transactionNumber": this.state.PaymentReceiptNumber,
          }
            console.log("cash--Booking",Booking)
            let saveCardNum = await httpRequest(
              "bookings/api/save/cardDetails",
              "_search",
              [],
            {Booking:Booking}
            );
            console.log("saveCardNum",saveCardNum)
      
            let ReceiptNum =
              EmpPayment && EmpPayment
                ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber
                : "notFound";
            
        
            prepareFinalObject("CollectionReceiptNum", ReceiptNum);
    
            // TransactionNum = this.state.PaymentReceiptNumber
            // cardNumber = this.state.last4Digits
            this.props.history.push(`/egov-services/success-payment`);
    
          }
        }catch (error){
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "Payment failed please try again",
              labelKey: `Payment failed please try again`
            },
            "error"
          );  
        }
}
else{
  this.props.toggleSnackbarAndSetText(
    true,
    {
      labelName: "Cheque/DD date can not be future Date",
      labelKey: `BK_CHEQUE_DD_NOT_FUTURE_DATE`
    },
    "error"
  );  
}  
}
     else{
       
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "All fields are mandatory",
          labelKey: `BK_OFFLINE_PAYMENT_MANDATORY`
        },
        "error"
      ); 
     }
    }
    if (ppMode == "DD") {
      if(newDDno !== " " && NewddDate !== " " && this.state.DDno !== "" &&   this.state.ddDate !== "" && this.state.ddIFSC !== "" && this.props.BranchName !== "NotFound" &&
      this.props.BankName !== "NotFound"){
        if(NewddDate <= this.props.longtodayDate){
          PaymentReqBody = {
            Payment: {
              paymentDetails: [
                {
                  businessService: "PACC",
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
          try{ 
            let EmpPayment = await httpRequest(
              "collection-services/payments/_create?",
              "_search",
              [],
              PaymentReqBody
            );
        
           
        
            if(EmpPayment.ResponseInfo.status == "200" && EmpPayment.Payments.length > 0){
  
              prepareFinalObject("ResponseOfCashPayment", EmpPayment);
      
              let Booking = {
                "bkApplicationNumber": this.state.CurrentApplicationNum,
                "cardNumber": "0000",
                "transactionNumber": this.state.PaymentReceiptNumber,
            }
              console.log("cash--Booking",Booking)
              let saveCardNum = await httpRequest(
                "bookings/api/save/cardDetails",
                "_search",
                [],
                {Booking:Booking}
              );
              console.log("saveCardNum",saveCardNum)
        
              let ReceiptNum =
                EmpPayment && EmpPayment
                  ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber
                  : "notFound";
              
          
              prepareFinalObject("CollectionReceiptNum", ReceiptNum);
      
              // TransactionNum = this.state.PaymentReceiptNumber
              // cardNumber = this.state.last4Digits
              this.props.history.push(`/egov-services/success-payment`);
      
            }
          }catch (error) {
            this.props.toggleSnackbarAndSetText(
              true,
              {
                labelName: "Payment failed please try again",
                labelKey: `Payment failed please try again`
              },
              "error"
            );  
          }
        }
else{
  this.props.toggleSnackbarAndSetText(
    true,
    {
      labelName: "Cheque/DD date can not be future Date",
      labelKey: `BK_CHEQUE_DD_NOT_FUTURE_DATE`
    },
    "error"
  );  
}  
      }
      else{
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "All fields are mandatory",
            labelKey: `BK_OFFLINE_PAYMENT_MANDATORY`
          },
          "error"
        ); 
       }
    }
    if (ppMode == "Card") {
      let checkwhiteSpace = this.hasWhiteSpace(this.state.last4Digits)
      console.log("checkwhiteSpace",checkwhiteSpace)
      console.log("card--state-number",this.state.last4Digits)
      console.log("this.state.repeatTrxNo--card",this.state.repeatTrxNo)
      console.log("this.state.TrxNo--card",this.state.TrxNo)
      if(NewTrxNo !== " " && this.state.TrxNo !== ""){
        if(checkwhiteSpace == true || this.state.last4Digits.length > 4 || this.state.last4Digits.length < 4 || this.state.repeatTrxNo !== this.state.TrxNo) {
          console.log("checkwhiteSpace000000",checkwhiteSpace)
          console.log("card--state-number---if--condititon",this.state.last4Digits)
        console.log("this.state.repeatTrxNo--card---0000",this.state.repeatTrxNo)
        console.log("this.state.TrxNo--card---000",this.state.TrxNo)
          this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "Please fill all fields properly",
              labelKey: `Please fill all fields properly`
            },
            "error"
          ); 
        }
        else{
          PaymentReqBody = {
            Payment: {
              paymentDetails: [
                {
                  businessService: "PACC",
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
  
          try{
            let EmpPayment = await httpRequest(
              "collection-services/payments/_create?",
              "_search",
              [],
              PaymentReqBody
            );
           
            if(EmpPayment.ResponseInfo.status == "200" && EmpPayment.Payments.length > 0){
    
              prepareFinalObject("ResponseOfCashPayment", EmpPayment);
      
              let Booking = {
                "bkApplicationNumber": this.state.CurrentApplicationNum,
                "cardNumber": this.state.last4Digits,
                "transactionNumber": this.state.PaymentReceiptNumber,
            }
              console.log("cash--Booking",Booking)
              let saveCardNum = await httpRequest(
                "bookings/api/save/cardDetails",
                "_search",
                [],
                {Booking:Booking}
              );
              console.log("saveCardNum",saveCardNum)
        
              let ReceiptNum =
                EmpPayment && EmpPayment
                  ? EmpPayment.Payments[0].paymentDetails[0].receiptNumber
                  : "notFound";
              
          
              prepareFinalObject("CollectionReceiptNum", ReceiptNum);
      
              // TransactionNum = this.state.PaymentReceiptNumber
              // cardNumber = this.state.last4Digits
              this.props.history.push(`/egov-services/success-payment`);
      
            }
          }catch (error) {
            this.props.toggleSnackbarAndSetText(
              true,
              {
                labelName: "Payment failed please try again",
                labelKey: `Payment failed please try again`
              },
              "error"
            );  
          }
        }
      }
      else if(checkwhiteSpace == true || this.state.last4Digits.length > 4 || this.state.last4Digits < 4 || this.state.repeatTrxNo !== this.state.TrxNo) {
        console.log("checkwhiteSpace000000",checkwhiteSpace)
        console.log("card--state-number---if--condititon",this.state.last4Digits)
      console.log("this.state.repeatTrxNo--card---0000",this.state.repeatTrxNo)
      console.log("this.state.TrxNo--card---000",this.state.TrxNo)
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "Please fill all fields properly",
            labelKey: `Please fill all fields properly`
          },
          "error"
        ); 
      }
      else{
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "All fields are mandatory",
            labelKey: `BK_OFFLINE_PAYMENT_MANDATORY`
          },
          "error"
        ); 
       }
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
    const {
      paymentDetails,
      ApplicantMobNum,
      ApplicantName,
      TotalAmount,
      billId,
      userInfo,createPACCApplicationData
    } = this.props;
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

              {this.props.ApplicantAppStatus !== "OFFLINE_RE_INITIATED" && this.props.ApplicantAppStatus !== "OFFLINE_MODIFIED"? (
                <PaymentDetailsTwo
                  paymentDetails={paymentDetails && paymentDetails}
                  one={this.props.one}
                  two={this.props.two}
                  three={this.props.three}
                  four={this.props.four}
                  five={this.props.five}
                  six={this.props.six}
                />
              ) : (
                ""
              )}

              {/*Amount,dateVenueCharge,Taxes,luxarytaxes,refundabelSecurity,facilitationCHG,OfflineRenArray*/}
              {this.props.ApplicantAppStatus == "OFFLINE_MODIFIED" ? (
                <DateVenueChangePayDetail
                  Amount={this.props.Amount}
                  dateVenueCharge={this.props.dateVenueCharge}
                  Taxes={this.props.Taxes}
                  luxarytaxes={this.props.luxarytaxes}
                  refundabelSecurity={this.props.refundabelSecurity}
                  facilitationCHG={this.props.facilitationCHG}
                  paymentDetails={paymentDetails && paymentDetails}
                  Status={
                    this.props.ApplicantAppStatus &&
                    this.props.ApplicantAppStatus
                  }
                />
              ) : (
                ""
              )}

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
              {/* <Button
                className="responsive-action-button"
                primary={true}
                label={
                  <Label buttonLabel={true} label="BK_MYBK_PAYMENT_PAGE_BACK" />
                }
                fullWidth={true}
                onClick={this.GoToApplyPage}
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
        <style>{
       `
         
           @media only screen and (max-width: 768px)
             {

               .form-without-button-cont-generic {
                 margin-top: 100px;
             }
             }
         `
     }
     </style>
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

  let selectedComplaint = applicationData
    ? applicationData.bookingsModelList[0]
    : "";

  let ApplicantName = selectedComplaint
    ? selectedComplaint.bkApplicantName
    : "notFound";
 

  let ApplicantMobNum = selectedComplaint
    ? selectedComplaint.bkMobileNumber
    : "notFound";
  

  let ApplicantAppStatus = selectedComplaint
    ? selectedComplaint.bkApplicationStatus
    : "notFound";
 

  let paymentDetails;

  // paymentDetails = paymentData ? paymentData.Bill[0] : '';

  const { paymentData } = bookings;

  let paymentDataOne = paymentData ? paymentData : "wrong";
  

  let checkBillLength =
    paymentDataOne != "wrong" ? paymentDataOne.Bill.length > 0 : "";
  
  // Bill[0].totalAmount
  let billAccountDetailsArray = checkBillLength
    ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails
    : "NOt found Any Array";
  
  let one = 0;
  let two = 0;
  let three = 0;
  let four = 0;
  let five = 0;
  let six = 0;
  let seven = 0;

  if (selectedComplaint.bkBookingType == "Parks") {
    for (let i = 0; i < billAccountDetailsArray.length; i++) {
      if (
        billAccountDetailsArray[i].taxHeadCode ==
        "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
      ) {
        //PACC
        one = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
      ) {
        //LUXURY_TAX
        two = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
      ) {
        //REFUNDABLE_SECURITY
        three = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
      ) {
        //PACC TAX
        four = billAccountDetailsArray[i].amount;
      } else if (billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF") {
        five = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
      ) {
        //FACILITATION_CHARGE
        six = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "PARK_LOCATION_AND_VENUE_CHANGE_AMOUNT"
      ) {
        seven = billAccountDetailsArray[i].amount;
      }
    }
  }
  if (selectedComplaint.bkBookingType == "Community Center") {
    for (let i = 0; i < billAccountDetailsArray.length; i++) {
      if (
        billAccountDetailsArray[i].taxHeadCode ==
        "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
      ) {
        //PACC
        one = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "CLEANING_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
      ) {
        //LUXURY_TAX
        two = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
      ) {
        //REFUNDABLE_SECURITY
        three = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
      ) {
        //PACC TAX
        four = billAccountDetailsArray[i].amount;
      } else if (billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF") {
        five = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "FACILITATION_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
      ) {
        //FACILITATION_CHARGE
        six = billAccountDetailsArray[i].amount;
      } else if (
        billAccountDetailsArray[i].taxHeadCode ==
        "COMMUNITY_LOCATION_AND_VENUE_CHANGE_AMOUNT"
      ) {
        seven = billAccountDetailsArray[i].amount;
      }
    }
  }

  let Amount = 0;
  let dateVenueCharge = 0;
  let Taxes = 0;
  let luxarytaxes = 0;
  let refundabelSecurity = 0;
  let facilitationCHG = 0;
  let OfflineRenArray;

  const { fetchPaymentAfterPayment } = bookings;
  console.log(
    "fetchPaymentAfterPayment--",
    fetchPaymentAfterPayment
      ? fetchPaymentAfterPayment
      : "NofetchPaymentAfterPaymentData"
  );

  let abc =
    applicationData !== undefined && applicationData !== null
      ? applicationData.bookingsModelList != undefined &&
        applicationData.bookingsModelList != null
        ? applicationData.bookingsModelList.length > 0
          ? applicationData.bookingsModelList
          : "NA"
        : "NA"
      : "NA";

  if (abc !== "NA") {
    if (
      (selectedComplaint &&
        selectedComplaint.bkApplicationStatus != undefined &&
        selectedComplaint.bkApplicationStatus != null &&
        selectedComplaint.bkApplicationStatus == "OFFLINE_INITIATE") ||
      selectedComplaint.bkApplicationStatus == "OFFLINE_INITIATED"
    ) {
      
      if (selectedComplaint.bkPaymentStatus == "SUCCESS") {
      
        paymentDetails =
          fetchPaymentAfterPayment &&
          fetchPaymentAfterPayment.Payments[0] &&
          fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
        
      } else {
        
        paymentDetails = paymentData ? paymentData.Bill[0] : "";
        
      }
    } else if (
      (selectedComplaint &&
        selectedComplaint.bkApplicationStatus != undefined &&
        selectedComplaint.bkApplicationStatus != null &&
        selectedComplaint.bkApplicationStatus == "OFFLINE_RE_INITIATED") ||
      selectedComplaint.bkApplicationStatus == "OFFLINE_RE_INITIATE"
    ) {
      paymentDetails = paymentData ? paymentData.Bill[0] : "";
      OfflineRenArray = paymentData
        ? paymentData.Bill[0].billDetails[0].billAccountDetails
        : "NOt found Any Array";
      

      if (selectedComplaint.bkBookingType == "Parks") {
        for (let i = 0; i < OfflineRenArray.length; i++) {
          if (
            OfflineRenArray[i].taxHeadCode ==
            "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //PACC
            Amount = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //LUXURY_TAX
            luxarytaxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //REFUNDABLE_SECURITY
            refundabelSecurity = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //PACC TAX
            Taxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //FACILITATION_CHARGE
            facilitationCHG = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "PARK_LOCATION_AND_VENUE_CHANGE_AMOUNT"
          ) {
            dateVenueCharge = OfflineRenArray[i].amount;
          }
        }
      }
      if (selectedComplaint.bkBookingType == "Community Center") {
       
        for (let i = 0; i < OfflineRenArray.length; i++) {
          if (
            OfflineRenArray[i].taxHeadCode ==
            "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //PACC
            Amount = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CLEANING_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //LUXURY_TAX
            luxarytaxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //REFUNDABLE_SECURITY
            refundabelSecurity = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //PACC TAX
            Taxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "FACILITATION_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //FACILITATION_CHARGE
            facilitationCHG = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "COMMUNITY_LOCATION_AND_VENUE_CHANGE_AMOUNT"
          ) {
            dateVenueCharge = OfflineRenArray[i].amount;
          }
        }
      }
    } 
    else if (
        (selectedComplaint &&
          selectedComplaint.bkApplicationStatus != undefined &&
          selectedComplaint.bkApplicationStatus != null &&
          selectedComplaint.bkApplicationStatus == "OFFLINE_APPLIED") ||
        selectedComplaint.bkAction == "OFFLINE_APPLY"
      ){
        paymentDetails = paymentData ? paymentData.Bill[0] : "";
       
      }
      else if (
        (selectedComplaint &&
          selectedComplaint.bkApplicationStatus != undefined &&
          selectedComplaint.bkApplicationStatus != null &&
          selectedComplaint.bkApplicationStatus == "OFFLINE_MODIFIED") ||
        selectedComplaint.bkAction == "OFFLINE_MODIFY"
      ){
        paymentDetails = paymentData ? paymentData.Bill[0] : "";
        

        OfflineRenArray = paymentData
        ? paymentData.Bill[0].billDetails[0].billAccountDetails
        : "NOt found Any Array";
      

      if (selectedComplaint.bkBookingType == "Parks") {
        
        for (let i = 0; i < OfflineRenArray.length; i++) {
          if (
            OfflineRenArray[i].taxHeadCode ==
            "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //PACC
            Amount = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //LUXURY_TAX
            luxarytaxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //REFUNDABLE_SECURITY
            refundabelSecurity = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //PACC TAX
            Taxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"
          ) {
            //FACILITATION_CHARGE
            facilitationCHG = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "PARK_LOCATION_AND_VENUE_CHANGE_AMOUNT"
          ) {
            dateVenueCharge = OfflineRenArray[i].amount;
          }
        }
      }
      if (selectedComplaint.bkBookingType == "Community Center") {
        for (let i = 0; i < OfflineRenArray.length; i++) {
          if (
            OfflineRenArray[i].taxHeadCode ==
            "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //PACC
            Amount = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CLEANING_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //LUXURY_TAX
            luxarytaxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //REFUNDABLE_SECURITY
            refundabelSecurity = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //PACC TAX
            Taxes = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "FACILITATION_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"
          ) {
            //FACILITATION_CHARGE
            facilitationCHG = OfflineRenArray[i].amount;
          } else if (
            OfflineRenArray[i].taxHeadCode ==
            "COMMUNITY_LOCATION_AND_VENUE_CHANGE_AMOUNT"
          ) {
            dateVenueCharge = OfflineRenArray[i].amount;
          }
        }
      }

      }
    else {
      
      paymentDetails =
        fetchPaymentAfterPayment &&
        fetchPaymentAfterPayment.Payments[0] &&
        fetchPaymentAfterPayment.Payments[0].paymentDetails[0].bill;
    }
  }

  let TotalAmount = paymentDetails
    ? paymentDetails.totalAmount
    : "NotFoundAnyAmount";
  
  let billId = paymentDetails
    ? paymentData.Bill[0].billDetails[0].billId
    : "NotFoundAnyBillId";
  

  let myLocation = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.availabilityCheckData
    : "";
  let myLocationtwo = myLocation ? myLocation.bkLocation : "";

  let fCharges;
  if (arrayName && arrayName.length > 0) {
    arrayName.forEach((item) => {
      item.forEach((value) => {
        if (value.code == "FACILITATION_CHARGE") {
          fCharges = value;
        }
      });
    });
  }
  let documentMap = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.documentMap
    : "";
  // let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "";

  let paymentMode = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.paymentMode
    : " ";

  let paidBy = state.screenConfiguration.preparedFinalObject.PaidBy
    ? state.screenConfiguration.preparedFinalObject.PaidBy
    : " ";

  let ppaidBy = paidBy && paidBy ? paidBy : " ";
  

  //IFSC

  let IFSC = state.screenConfiguration.preparedFinalObject.IFSC
    ? state.screenConfiguration.preparedFinalObject.IFSC
    : " ";

  let pIFSC = IFSC && IFSC ? IFSC : " ";
 

  let ddIFSC = state.screenConfiguration.preparedFinalObject.ddIFSC
    ? state.screenConfiguration.preparedFinalObject.ddIFSC
    : " ";

  let pddIFSC = ddIFSC && ddIFSC ? ddIFSC : " ";
  

  //ChequeNo
  let ChequeNo = state.screenConfiguration.preparedFinalObject.ChequeNo
    ? state.screenConfiguration.preparedFinalObject.ChequeNo
    : " ";

  let pChequeNo = ChequeNo && ChequeNo ? ChequeNo : " ";
  

  let NewChequeDate = state.screenConfiguration.preparedFinalObject.ChequeDate
    ? state.screenConfiguration.preparedFinalObject.ChequeDate
    : " ";

  let StrNewChequeDate =  NewChequeDate.toString();
  

  let changeDateNewChequeDate = Date.parse(StrNewChequeDate);

  let ChnChqDate = changeDateNewChequeDate && changeDateNewChequeDate ? changeDateNewChequeDate : "";
  

  let DDno = state.screenConfiguration.preparedFinalObject.DDno
    ? state.screenConfiguration.preparedFinalObject.DDno
    : " ";

  let newDDno = DDno && DDno ? DDno : " ";
  

  let DdDate = state.screenConfiguration.preparedFinalObject.ChangeDdDate
    ? state.screenConfiguration.preparedFinalObject.ChangeDdDate
    : " ";
 
  let strNewddDate = DdDate.toString();
  

  let changeNewddDate = Date.parse(strNewddDate);


let NewddDate = changeNewddDate && changeNewddDate ? changeNewddDate : " ";
  

let todayDate = new Date()


let todaystrDate = todayDate.toString();


let longtodayDate = Date.parse(todaystrDate);


  //TrxNo
  let TrxNo = state.screenConfiguration.preparedFinalObject.TrxNo
    ? state.screenConfiguration.preparedFinalObject.TrxNo
    : " ";

  let NewTrxNo = TrxNo && TrxNo ? TrxNo : " ";
  
  
 let BankName = get(
        state,
        "screenConfiguration.preparedFinalObject.OfflineBank",
        "NotFound"
      );


let BranchName = get(
  state,
  "screenConfiguration.preparedFinalObject.OfflineBranch",
  "NotFound"
);

  return {
    state,
    longtodayDate,
    BranchName,
    BankName,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    Amount,
    dateVenueCharge,
    Taxes,
    luxarytaxes,
    refundabelSecurity,
    facilitationCHG,
    OfflineRenArray,
    createPACCApplicationData,
    userInfo,
    ppaidBy,
    pChequeNo,
    ChnChqDate,
    newDDno,
    NewTrxNo,
    NewddDate,
    ApplicantAppStatus,
    documentMap,
    facilationChargesSuccess,
    billId,
    ApplicantName,
    ApplicantMobNum,
    pddIFSC,
    pIFSC,
    fCharges,
    myLocationtwo,
    paymentDetails,
    TotalAmount,
    paymentMode,
    applicationData,
    selectedComplaint,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchApplications: (criteria) => dispatch(fetchApplications(criteria)),
    fetchDataAfterPayment: (criteria) =>
      dispatch(fetchDataAfterPayment(criteria)),
    createPACCApplication: (criteria, hasUsers, overWrite) =>
      dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
    updatePACCApplication: (criteria, hasUsers, overWrite) =>
      dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchPayment: (criteria) => dispatch(fetchPayment(criteria)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryDetails);
