import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment,fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import * as _ from "lodash"
import Footer from "../../../../modules/footer"
import PaccFeeEstimate from "../PaccFeeEstimate"
import SummaryApplicationDetail from "../SummaryApplicationDetail"
import SummaryApplicantDetail from "../SummaryApplicantDetail"
import { getFileUrlFromAPI } from '../../../../modules/commonFunction'
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import SummaryDocumentDetail from "../SummaryDocumentDetail"
import { httpRequest } from "egov-ui-kit/utils/api";
import SummaryBankDetails from "../SummaryBankDetails"
import TermsConditions from "../TermsConditions"
import get from "lodash/get";
import { isArray } from "lodash";
class SummaryDetails extends Component {

    state = {
        createPACCApp: '',
        CashPaymentApplicationNumber: '',
        appStatus: '',
        currentAppStatus: '',
        documentList:[],
        checkBoxState:false
    }

    componentDidMount = async () => {

        let {createPACCApplication, userInfo, documentMap,fetchPayment,prepareFinalObject,fetchApplications,conJsonSecond,conJsonfirst,newTimeSlot } = this.props;
        let { uploadeDocType,DiscountReason,firstName, venueType, bokingType, bookingData, email, mobileNo, surcharge, fromDate, toDate,myLocationtwo,ReasonForDiscount,
            utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose,
            BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,accountType,SecTimeSlotFromTime,SecTimeSlotToTime,
            locality, residenials, paymentMode,facilationChargesSuccess,
            discountType,checkAppStatus,checkAppNum,firstToTimeSlot,
            ReqbodybookingVenue,ReqbodybookingVenueID, discountDocs,
            discountDocumentsUploadRedux,
            documentsUploadRedux
          } = this.props;



let documentsData=[]

if(discountDocumentsUploadRedux!=="NotFound" && discountDocumentsUploadRedux.documents &&discountDocumentsUploadRedux.documents.length>0 && discountDocumentsUploadRedux.documents[0].fileName ){
    let newObj = 
    {documentCode: discountDocumentsUploadRedux.documentCode,
    documentType:discountDocumentsUploadRedux.documentType,
    fileName:discountDocumentsUploadRedux.documents[0].fileName,
    fileStoreId:discountDocumentsUploadRedux.documents[0].fileStoreId
    
}

documentsData.push(newObj)

}
if(documentsUploadRedux!=="NotFound" &&  documentsUploadRedux.documents &&documentsUploadRedux.documents.length>0 && documentsUploadRedux.documents[0].fileName ){
    let newObj = 
    {documentCode: documentsUploadRedux.documentCode,
    documentType:documentsUploadRedux.documentType,
    fileName:documentsUploadRedux.documents[0].fileName,
    fileStoreId:documentsUploadRedux.documents[0].fileStoreId
    
}
documentsData.push(newObj)
}
this.setState({
  documentList: documentsData,
});

this.setState({
    appStatus : checkAppStatus
})
let EmpSideDocType = null

if(uploadeDocType !== "NotFound"){
    EmpSideDocType = uploadeDocType
}

let sendCurrentStatus;
if(checkAppStatus){
    if(checkAppStatus == "NOTFOUND" || checkAppStatus == "OFFLINE_INITIATED"){
        sendCurrentStatus = "OFFLINE_INITIATE"
    }
   else if(checkAppStatus == "OFFLINE_APPLIED"){
       sendCurrentStatus = "OFFLINE_RE_INITIATE"
   }
}

prepareFinalObject("SummaryutGST",this.props.utGST);
prepareFinalObject("SummarycGST",this.props.cGST);
prepareFinalObject("Summarysurcharge",this.props.surcharge);
prepareFinalObject("cGSTSummary",cGST);

let NewfinanceBusinessService;
if(venueType == "Parks"){
    NewfinanceBusinessService = "BOOKING_BRANCH_SERVICES.MANUAL_OPEN_SPACE"
}
if(venueType == "Community Center"){
    NewfinanceBusinessService = "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR"
}


let newDisCount;
let finalDiscount;
if(discountType == "50%"){
newDisCount = 50;
finalDiscount = Number(newDisCount);

}
else if(discountType == "20%"){
    newDisCount = 20;
    finalDiscount = Number(newDisCount);
    }
    else if (discountType == '100%' || discountType == "KirayaBhog" || discountType == "ReligiousFunction"){
        newDisCount = 100;
        finalDiscount = Number(newDisCount);
        }
        else{
            newDisCount = 0;
            finalDiscount = Number(newDisCount);   
            }
let discountDocType = discountDocs && 
!_.isEmpty(discountDocs)? 
discountDocs && discountDocs[0].documentCode : "notFound";

let discountDocFid = discountDocs && 
!_.isEmpty(discountDocs)? 
discountDocs[0].documents && isArray(discountDocs[0].documents) &&  discountDocs[0].documents[0].fileStoreId : "notFound";


        let fid = documentMap ? Object.keys(documentMap) : ""
        let Booking = {
            "uuid": userInfo.uuid,
           "bkRemarks": DiscountReason,
           "bkResidentialOrCommercial":residenials,
           "bkMaterialStorageArea": paymentMode,
           "bkPlotSketch":discountType,
            "discount": finalDiscount,
            "bkBookingType": venueType,    
            
            "bkBookingVenue":  ReqbodybookingVenueID,
            "bkApplicantName": firstName,
            "bkMobileNumber": mobileNo,
            "bkDimension": dimension,
            
            "bkLocation": ReqbodybookingVenue,
            "bkFromDate": fromDate,
            "bkToDate": toDate,
            "bkCleansingCharges": cleaningCharges,
            "bkRent": rent,
            "bkSurchargeRent": surcharge,
            "bkUtgst": utGST,
            "bkCgst": cGST,
            "bkSector": locality,
            "bkEmail": email,
            "bkHouseNo": houseNo,
            "bkBookingPurpose": purpose,
            
            "bkPaymentStatus": checkAppStatus == "OFFLINE_APPLIED" ? "SUCCESS" : "",
            "bkApplicationNumber": checkAppNum !== "NOTFOUND" ? checkAppNum : null,
            "bkCustomerGstNo": GSTnumber,
            "wfDocuments": [{
                "documentType" : EmpSideDocType,
                "fileStoreId": fid[0]
            },
            {
                "documentType" : discountDocType,
                "fileStoreId": discountDocFid
            }
        ],
            "tenantId": userInfo.tenantId,
            
            "bkAction": sendCurrentStatus,
            "businessService": "PACC",
            "financeBusinessService": NewfinanceBusinessService,
            "reInitiateStatus": checkAppStatus == "OFFLINE_APPLIED" ? true : false,
            "financialYear": "2021-2022",
            "bkBankAccountNumber":BankAccountNumber,
             "bkBankName":BankAccountName,
            "bkIfscCode":IFSCCode,
            "bkAccountType":accountType,
            "bkBankAccountHolder":AccountHolderName,
            "bkNomineeName": NomineeName
        }

if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
let slotArray = []
let checkslotArray = []
if(SecTimeSlotFromTime != "notFound" && SecTimeSlotToTime != "notFound"){
    slotArray[0] = conJsonfirst,
    slotArray[1] = conJsonSecond 

    checkslotArray[0] = this.props.first,
    checkslotArray[1] = this.props.second
}
else{
    
	checkslotArray[0] = this.props.first
	
}
                Booking.timeslots = newTimeSlot,
                Booking.bkDuration = "HOURLY",
                Booking.bkFromDate = bookingData.bkFromDate,
                Booking.bkToDate = bookingData.bkToDate,
                Booking.bkFromTime = bookingData.bkFromTime,
                Booking.bkToTime = bookingData.bkToTime
        }
        else if (venueType == "Community Center" && (!bookingData) && (!bookingData.bkFromTime)) {
            Booking.timeslots = [{
                "slot": "9:00 AM - 8:59 AM"
            }],
                Booking.bkDuration = "FULLDAY"
        }
        let createAppData = {

                "applicationType": "PACC",
                "applicationStatus": "",
                "applicationId": checkAppNum !== "NOTFOUND" ? checkAppNum : null,
                "tenantId": userInfo.tenantId,
                "Booking": Booking
            }



try{
    let payloadfund = await httpRequest(
        "bookings/park/community/_create",
        "_search",[],
        createAppData
        );



prepareFinalObject("createAppData",payloadfund)

let appNumber = payloadfund.data.bkApplicationNumber

let AAppStatus = payloadfund.data.bkApplicationStatus


prepareFinalObject("CurrentApplicationNumber",appNumber)

this.setState({
createPACCApp : payloadfund,
CashPaymentApplicationNumber : appNumber,
currentAppStatus : AAppStatus
})
fetchPayment(
[{ key: "consumerCode", value: appNumber }, { key: "businessService", value: NewfinanceBusinessService }, { key: "tenantId", value: userInfo.tenantId }
])
}
catch(err){
    this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "BK_ERR_PACC_SOMTHING_ERR_NOT_FOUND",
          labelKey: `BK_ERR_PACC_SOMTHING_ERR_NOT_FOUND`
        },
        "warning"
      );
}
    }

    firstStep = e => {
        e.preventDefault();
        this.props.firstStep();
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
    // callApiForDocumentData = async (e) => {
    //     const { documentMap, userInfo } = this.props;
    //     var documentsPreview = [];
    //     if (documentMap && Object.keys(documentMap).length > 0) {
    //         let keys = Object.keys(documentMap);
    //         let values = Object.values(documentMap);
    //         let id = keys[0],
    //             fileName = values[0];

    //         documentsPreview.push({
    //             title: "DOC_DOC_PICTURE",
    //             fileStoreId: id,
    //             linkText: "View",
    //         });
    //         let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
    //         let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
    //         let fileUrls =
    //             fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds, changetenantId) : {};


    //         documentsPreview = documentsPreview.map(function (doc, index) {
    //             doc["link"] =
    //                 (fileUrls &&
    //                     fileUrls[doc.fileStoreId] &&
    //                     fileUrls[doc.fileStoreId].split(",")[0]) ||
    //                 "";

    //             doc["name"] =
    //                 (fileUrls[doc.fileStoreId] &&
    //                     decodeURIComponent(
    //                         fileUrls[doc.fileStoreId]
    //                             .split(",")[0]
    //                             .split("?")[0]
    //                             .split("/")
    //                             .pop()
    //                             .slice(13)
    //                     )) ||
    //                 `Document - ${index + 1}`;
    //             return doc;
    //         });
    //         setTimeout(() => {
    //             window.open(documentsPreview[0].link);
    //         }, 100);
    //         prepareFinalObject('documentsPreview', documentsPreview)
    //     }
    // }

submit = async (InitiateAppNumber) => {

    if(this.state.checkBoxState == true) {
        let { uploadeDocType,conJsonSecond,conJsonfirst,updatePACCApplication, discountDocs,state,documentMap, bookingData, venueType,prepareFinalObject,createPACCApplicationData,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,ReasonForDiscount} = this.props;
    
        let checkDate
        let checkDateCondition = false
        let discountDocType = discountDocs && 
        !_.isEmpty(discountDocs)? 
        discountDocs && discountDocs[0].documentCode : "notFound";
        
        let discountDocFid = discountDocs && 
        !_.isEmpty(discountDocs)? 
        discountDocs[0].documents && isArray(discountDocs[0].documents) &&  discountDocs[0].documents[0].fileStoreId : "notFound";
        
    let dataOne = get(
        state,
        "screenConfiguration.preparedFinalObject.createAppData",
        "NotFound"
    );
    
    let EmpSideDocType = null
    
    if(uploadeDocType !== "NotFound"){
        EmpSideDocType = uploadeDocType
    }
    
    if(dataOne !== "NotFound"){
        let data = dataOne.data
        prepareFinalObject("CreatePaccAppData",data);
        let fid = documentMap ? Object.keys(documentMap) : ""
        const { firstName, userInfo, email, mobileNo, surcharge, fromDate, toDate, utGST, cGST, GSTnumber, dimension, location, facilitationCharges, cleaningCharges, rent, houseNo, type, purpose, locality, residenials } = this.props;
    let timeSlotDatesAvail;
        if(data.bkBookingType == "Community Center" && data.bkLocation == "HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH"){
            timeSlotDatesAvail  = data.timeslots
    }
    else{
        timeSlotDatesAvail = []
    }
    
        if (data) {
            
            let Booking = {
                "bkApplicationNumber": data.bkApplicationNumber,
                "bkSector": data.bkSector,
                "bkBookingVenue": data.bkBookingVenue,
                "bkBookingType": data.bkBookingType,
                "bkFromDate": data.bkFromDate,
                "bkToDate": data.bkToDate,
                "timeslots" : timeSlotDatesAvail
            }
    
            let UpdatedReqbody = {
                     Booking:Booking,
                     "applicationNumber" : data.bkApplicationNumber
            }
    try{
        let AvailCheckForSameTime = await httpRequest(
            "bookings/park/community/booked/dates/_search",
            "_search",
            [],
            UpdatedReqbody
          );
          console.log("AvailCheckForSameTime--",AvailCheckForSameTime)
          let checkResponseAvailForSameTime = AvailCheckForSameTime !== undefined && AvailCheckForSameTime !== null ?
          (AvailCheckForSameTime.data && AvailCheckForSameTime.data !== null && AvailCheckForSameTime.data !== undefined ?(AvailCheckForSameTime.data):""):""
         console.log("checkResponseAvailForSameTime--employee",checkResponseAvailForSameTime)
         checkDate = checkResponseAvailForSameTime && checkResponseAvailForSameTime.length > 0 ? AvailCheckForSameTime.data[0] : 'emptyArray'
         console.log("valueFotcheckDate",checkDate)
    if(checkDate !== 'emptyArray' && (checkDate !== data.bkFromDate || checkDate !== data.bkToDate)){
        checkDateCondition = true
        console.log("setcheckDateCondition",checkDateCondition)
    }
    
          if(checkResponseAvailForSameTime !== ""){
              console.log("comeToMainCondition",checkResponseAvailForSameTime)
              if(AvailCheckForSameTime.data.length == 0 || checkDateCondition == true){
                  let Booking = {
                      bkRemarks: data.bkRemarks,
                      bkResidentialOrCommercial: data.bkResidentialOrCommercial,
                      bkMaterialStorageArea: data.bkMaterialStorageArea,
                      discount:data.discount,
                      bkPlotSketch:data.bkPlotSketch,
                      bkBookingType: data.bkBookingType,
                      bkBookingVenue: data.bkBookingVenue,
                      bkApplicantName: data.bkApplicantName,
                      bkMobileNumber: data.bkMobileNumber,
                      bkDimension: data.bkDimension,
                      bkPaymentStatus: "SUCCESS",
                      bkLocation: data.bkLocation,
                      bkFromDate: data.bkFromDate,
                      bkToDate: data.bkToDate,
                      bkCleansingCharges: data.bkCleansingCharges,
                      bkRent: data.bkRent,
                      bkSurchargeRent: data.bkSurchargeRent,
                      bkUtgst: data.bkUtgst,
                      bkCgst: data.bkCgst,
                      bkSector: data.bkSector,
                      bkEmail: data.bkEmail,
                      bkHouseNo: data.bkHouseNo,
                      bkBookingPurpose: data.bkBookingPurpose,
                      bkApplicationNumber: data.bkApplicationNumber,
                      bkCustomerGstNo: data.bkCustomerGstNo ? data.bkCustomerGstNo : 'NA',
                      wfDocuments: [
                          {
                            documentType: EmpSideDocType,
                            fileStoreId: fid[0],
                          },
                          {
                            documentType: discountDocType,
                            fileStoreId: discountDocFid,
                          },
                        ],
                      "tenantId": userInfo.tenantId,
                      "bkAction": data.bkApplicationStatus == "OFFLINE_RE_INITIATED" ? "OFFLINE_MODIFY" : "OFFLINE_APPLY",
                      "businessService": "PACC",
                      "reInitiateStatus": false,
                      "financialYear": "2021-2022",
                      "bkBankAccountNumber":data.bkBankAccountNumber,
                      "bkBankName":data.bkBankName,
                      "bkIfscCode":data.bkIfscCode,
                      "bkAccountType":data.bkAccountType,
                      "bkBankAccountHolder":data.bkBankAccountHolder,
                      "bkNomineeName": data.bkNomineeName
                  }
    
    
                  if (venueType == "Community Center" && bookingData && bookingData.bkFromTime) {
                      let slotArray = []
                      let checkslotArray = []
                      
                      if(SecTimeSlotFromTime != "notFound" && SecTimeSlotToTime != "notFound"){
                          
                          slotArray[0] = conJsonfirst,
                          slotArray[1] = conJsonSecond 
    
                          checkslotArray[0] = this.props.first,
                           checkslotArray[1] = this.props.second
                      }
                      else{
                        checkslotArray[0] = this.props.first
                      }
                      Booking.timeslots = data.timeslots,
                      Booking.bkDuration = "HOURLY",
                      Booking.bkFromDate = bookingData.bkFromDate,
                      Booking.bkToDate = bookingData.bkToDate,
                      Booking.bkFromTime = bookingData.bkFromTime,
                      Booking.bkToTime = bookingData.bkToTime
                  }
                  else if (venueType == "Community Center" && (!bookingData) && (!bookingData.bkFromTime)) {
                      Booking.timeslots = [{
                          "slot": "9:00 AM - 8:59 AM"
                      }],
                          Booking.bkDuration = "FULLDAY"
                  }
          await updatePACCApplication(
                      {
                          "applicationType": "PACC",
                          "applicationStatus": "",
                          "applicationId": data.bkApplicationNumber,
                          "tenantId": userInfo.tenantId,
                          "Booking": Booking
                      });
    
                  let NumberApp = this.state.CashPaymentApplicationNumber;
    
                  this.props.history.push(`/egov-services/PaymentReceiptDteail/${this.state.CashPaymentApplicationNumber}`);
              }
              else{
                  console.log("comeToElseOfMain",checkResponseAvailForSameTime,checkDate,checkDateCondition)
                  this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "Dates are already booked",
                        labelKey: `BK_ERR_PACC_DATE_ALREADY_BOOKED`
                      },
                      "error"
                    );
              }
              }
    }
    catch(err){
    console.log("comeincatch",err)
    this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "The Booking for the Selected Date and Selected Venue is in Process. Please check again after 30 mins for Venue availability.",
          labelKey: `The Booking for the Selected Date and Selected Venue is in Process. Please check again after 30 mins for Venue availability.`
        },
        "error"
      );
    }
            
            }
            else{
                this.props.toggleSnackbarAndSetText(
                    true,
                    {
                      labelName: "Somthing went wrong",
                      labelKey: `BK_ERR_PACC_SOMTHING_ERR_NOT_FOUND`
                    },
                    "error"
                  );
                }
    
    }
    
    else {
      this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "API ERROR",
            labelKey: `API ERROR`
          },
          "error"
        );
      }
    }
    else {
        this.props.toggleSnackbarAndSetText(
            true,
            {
              labelName: "Please accept booking agreement by clicking checkbox.",
              labelKey: `Please accept booking agreement by clicking checkbox.`
            },
            "warning"
          );
        }
}


handleCheckBox=(e)=>{
if(this.state.checkBoxState == false){
    this.setState({
        checkBoxState:true,
    })
}
else{
    this.setState({
        checkBoxState:false,
    })
}
}

    render() {
        const { firstName, fCharges,result, email, mobileNo, locality, surcharge, fromDate, toDate, facilationChargesSuccess,
            onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, bankName, amount, transactionDate, transactionNumber, paymentMode,
            dimension, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, residenials, documentMap,
            BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,totalAmountSuPage,one,two,three,four,five,six,
            PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,InitiateAppNumber,seven,
            BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,accountType,
            } = this.props;

            let fc = fCharges?fCharges.facilitationCharge:'100';
        return (
            <div>
                <div className="form-without-button-cont-generic">
                     <div classsName="container">
                        <div className="col-xs-12">


<PaccFeeEstimate
one={one}
two={two}
three={three}
four={four}
five={five}
six={six}
seven={seven && seven ? seven :"notfound"}
REFUNDABLE_SECURITY={REFUNDABLE_SECURITY}
PACC_TAX={PACC_TAX}
PACPACC_ROUND_OFFC_TAX={PACPACC_ROUND_OFFC_TAX}
FACILITATION_CHARGE={FACILITATION_CHARGE}
totalAmountSuPage={totalAmountSuPage}
                                amount={amount}
                                cGST={cGST}
                                utGST={utGST}
                                fc={fc}
                                firstStep={this.firstStep}
                                currentAppStatus= {this.state.currentAppStatus && this.state.currentAppStatus}
                            />

                            <SummaryApplicantDetail
                             firstStep={this.firstStep}
                                firstName={firstName}
                                email={email}
                                mobileNo={mobileNo}
                            />
                            <SummaryApplicationDetail
                             firstStep={this.firstStep}
                                purpose={purpose}
                                locality={locality}
                                dimension={dimension}
                                fromDate={fromDate}
                                toDate={toDate}
                                cleaningCharges={cleaningCharges}
                                rent={rent}
                                surcharge={this.props.surcharge}
                                cGST={this.props.cGST}
                                utGST={this.props.utGST}
                                GSTnumber={GSTnumber}
                            />
                            <SummaryBankDetails
                               firstStep={this.firstStep}
                                BankAccountName={BankAccountName}
                                NomineeName={NomineeName}
                                BankAccountNumber={BankAccountNumber}
                                IFSCCode={IFSCCode}
                                AccountHolderName={AccountHolderName}
                                accountType={accountType}
                            />
                           
                            {/* <SummaryDocumentDetail
                            uploadeDocType={this.props.uploadeDocType}
                                documentMap={documentMap}
                            /> */}

{this.state.documentList && this.state.documentList.length>0 && this.state.documentList.map(doc=>
                <SummaryDocumentDetail
                uploadeDocType={doc.documentCode}
                TypeOfResidence={this.props.uploadeDocType}
                documentMap={doc}
              />
              )}

                     <TermsConditions
                 handleCheckBox={this.handleCheckBox} 
                            />

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
                <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
                  <div className="col-sm-12 col-xs-12 applyBtnWrapper responsive-action-button-cont">
                        <Button
                            className="responsive-action-button"
                            primary={true}
                            label={<Label buttonLabel={true} label="BK_CORE_COMMON_GOBACK" />}
                            fullWidth={true}
                            onClick={this.back}
                            style={{ marginRight: 18 }}
                            startIcon={<ArrowBackIosIcon />}
                        />
                        <Button
                            className="responsive-action-button"
                            primary={true}
                            label={<Label buttonLabel={true} label="BK_CORE_COMMON_SUBMIT" />}
                            fullWidth={true}
                            onClick={this.submit}
                            style={{ rightIcon: "arrow_drop_down" }}
                        />
                    </div>
                }></Footer>

            </div>
        );
    }
}

const mapStateToProps = state => {

    const { bookings, common, auth, form } = state;
    const { createPACCApplicationData} = bookings;
    const { userInfo } = state.auth;
    const { facilationChargesSuccess, arrayName } = bookings;
    const { paymentData } = bookings;
    let paymentDataOne = paymentData ? paymentData : "wrong";
    
    let checkBillLength =  paymentDataOne != "wrong" ? paymentDataOne.Bill.length > 0 : "";
    let totalAmountSuPage = checkBillLength ? paymentDataOne.Bill[0].totalAmount: "notfound";
    
let  dropDownalue;
dropDownalue = state.screenConfiguration.preparedFinalObject.DropDownValue

let findTypeOfBooking =  state.screenConfiguration.preparedFinalObject.ShowAmountBooking


let discountDocs = get(
    state,
    "screenConfiguration.preparedFinalObject.discountDocumentsUploadRedux",
    "NotFound"
);

let ReqbodybookingVenue  = get(
    state,
    "screenConfiguration.preparedFinalObject.bkBookingData.name",
    "NotFound"
);

let ReqbodybookingVenueID  = get(
    state,
    "screenConfiguration.preparedFinalObject.bkBookingData.id",
    "NotFound"
);

let uploadeDocType = get(
    state,
    "screenConfiguration.preparedFinalObject.UploadedDocType",
    "NotFound"
);
let documentsUploadRedux = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsUploadRedux[0]",
    "NotFound"
  );
  let discountDocumentsUploadRedux = get(
    state,
    "screenConfiguration.preparedFinalObject.discountDocumentsUploadRedux[0]",
    "NotFound"
  );


    let ReasonForDiscount = state.screenConfiguration.preparedFinalObject ?
    (state.screenConfiguration.preparedFinalObject.ReasonForDiscount !== undefined && state.screenConfiguration.preparedFinalObject.ReasonForDiscount !== null ? (state.screenConfiguration.preparedFinalObject.ReasonForDiscount):'NA') :"NA";



    let billAccountDetailsArray =  checkBillLength ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails : "NOt found Any Array"

    let one = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
    let seven = 0;
//
if(findTypeOfBooking == "Parks"){
    
    for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

        if(billAccountDetailsArray[i].taxHeadCode == "PARKING_LOTS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//PACC
            one = billAccountDetailsArray[i].amount
         }
        else if(billAccountDetailsArray[i].taxHeadCode == "CLEANING_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//LUXURY_TAX
            two = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "SECURITY_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
            three = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){ //PACC TAX
            four = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){
            five = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHRGS_MANUAL_OPEN_SPACE_BOOKING_BRANCH"){ //FACILITATION_CHARGE
            six = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "PARK_LOCATION_AND_VENUE_CHANGE_AMOUNT"){
            seven = billAccountDetailsArray[i].amount
        }
    }
}
if(findTypeOfBooking == "Community Center"){
    
    for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

        if(billAccountDetailsArray[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//PACC
            one = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "CLEANING_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//LUXURY_TAX
            two = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "SECURITY_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){//REFUNDABLE_SECURITY
            three = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){ //PACC TAX
            four = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "PACC_ROUND_OFF"){
            five = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "FACILITATION_CHRGS_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){ //FACILITATION_CHARGE
            six = billAccountDetailsArray[i].amount
        }
        else if(billAccountDetailsArray[i].taxHeadCode == "COMMUNITY_LOCATION_AND_VENUE_CHANGE_AMOUNT"){
            seven = billAccountDetailsArray[i].amount
        }
    }
}

    let myLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData:"";
    let myLocationtwo = myLocation?myLocation.bkLocation:"";

    let NewAppNumber =  state.screenConfiguration.preparedFinalObject.CurrentApplicationNumber ? state.screenConfiguration.preparedFinalObject.CurrentApplicationNumber : "NotDetemine";
    

    let tryMyNumber;

    if(NewAppNumber != "NotDetemine"){
        tryMyNumber = NewAppNumber && NewAppNumber;
    }
    

    let InitiateAppNumber = NewAppNumber && NewAppNumber ? NewAppNumber : "NotDetemine";

    
    let fCharges;
    if (arrayName && arrayName.length > 0) {
      arrayName.forEach((item) => {
        item.forEach((value) => {
          if (value.code == "FACILITATION_CHARGE") {
            fCharges = value
          }
        })
      })
    }

    let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
    let bkLocation = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkLocation : "";
   let checkAppStatus = 'NOTFOUND';
   let checkAppNum = 'NOTFOUND';
   let createInitateApp = bookings ? (bookings.applicationData ?(bookings.applicationData.bookingsModelList.length > 0 ? (bookings.applicationData.bookingsModelList): 'NA'): 'NA'): "NA"
  
   if(createInitateApp !== "NA"){
  
    checkAppStatus = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationStatus : "NOTFOUND";
  
    checkAppNum = state.bookings.applicationData ? state.bookings.applicationData.bookingsModelList[0].bkApplicationNumber : "NOTFOUND";
  
}
   let DropDownValue = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData.name : "";
   let SecTimeSlotFromTime = ""
   let SecTimeSlotToTime = ""
   let firstToTimeSlot = ""
   let firstTimeSlotValue = ""
   let newTimeSlot;
   let first  = ""
   let conJsonfirst = ""
   let SecondTimeSlotValue = ""
   let second = ""
   let conJsonSecond = ""
//HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH
   if(DropDownValue === "HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH"){

    newTimeSlot = get(
        state,
        "screenConfiguration.preparedFinalObject.Booking.timeslots",
        "NotFound"
    );

    

    SecTimeSlotFromTime = state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo || "notFound"
    

    SecTimeSlotToTime = state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo || "notFound"
    
     //OFFLINE_APPLIED

     firstToTimeSlot = state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo && state.screenConfiguration.preparedFinalObject.Booking.bkToTime || "notFound"
    
  firstTimeSlotValue =
    state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
    (state.screenConfiguration.preparedFinalObject.Booking.timeslots !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslots[0] : "notFound") : "notFound") :
    "notFound"


  if(firstTimeSlotValue !== "notFound"){
      first=firstTimeSlotValue
  }


  if(firstTimeSlotValue !== "notFound"){
  conJsonfirst= JSON.stringify(firstTimeSlotValue);
  
  }
  

   SecondTimeSlotValue =
    state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
    (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo !== undefined ? (state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.timeslotsTwo[0] : "notFound") : "notFound") :
    "notFound"


  if(SecondTimeSlotValue !== "notFound"){
      second=SecondTimeSlotValue
  
  }

  if(SecondTimeSlotValue !== "notFound"){
  conJsonSecond = JSON.stringify(SecondTimeSlotValue);
  
  }


   }


    return {
        //BK_FEE_HEAD_PACC,LUXURY_TAX,REFUNDABLE_SECURITY,PACC_TAX,  wholeDay !== undefined ?
        //PACPACC_ROUND_OFFC_TAX,FACILITATION_CHARGE,
        firstTimeSlotValue,SecondTimeSlotValue,first,second,ReasonForDiscount,ReqbodybookingVenue,ReqbodybookingVenueID,
        createPACCApplicationData,userInfo,InitiateAppNumber,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,conJsonSecond,conJsonfirst,
        documentMap, bkLocation, facilationChargesSuccess,seven,state,uploadeDocType,
        fCharges,myLocationtwo,totalAmountSuPage,one,two,three,four,five,six,checkAppStatus,checkAppNum,discountDocs,
        discountDocumentsUploadRedux,
        documentsUploadRedux,newTimeSlot
    }

}
const mapDispatchToProps = dispatch => {
    return {

        createPACCApplication: (criteria, hasUsers, overWrite) => dispatch(createPACCApplication(criteria, hasUsers, overWrite)),
        updatePACCApplication: (criteria, hasUsers, overWrite) => dispatch(updatePACCApplication(criteria, hasUsers, overWrite)),
        toggleSnackbarAndSetText: (open, message, error) =>
            dispatch(toggleSnackbarAndSetText(open, message, error)),
            fetchPayment: criteria => dispatch(fetchPayment(criteria)),
            prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SummaryDetails);