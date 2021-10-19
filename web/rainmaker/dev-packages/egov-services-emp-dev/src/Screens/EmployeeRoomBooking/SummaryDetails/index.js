import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { createPACCApplication, updatePACCApplication,fetchPayment,fetchApplications } from "egov-ui-kit/redux/bookings/actions";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import "./index.css";
import Footer from "../../../modules/footer"
// import PaccFeeEstimate from "../PaccFeeEstimate"
import SummaryCCBookingDetail from "../SummaryCCBookingDetail" 
import SummaryVenueDetail from "../SummaryVenueDetail"
import SummaryRoomBookingDetail from "../SummaryRoomBookingDetail"
// import { getFileUrlFromAPI } from '../../../../modules/commonFunction' //
import RoomPaymentCard from "../RoomPaymentCard"
import jp from "jsonpath";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import SummaryDocumentDetail from "../SummaryDocumentDetail"
import { httpRequest } from "egov-ui-kit/utils/api";
// import SummaryBankDetails from "../SummaryBankDetails"
import { hashHistory } from 'react-router';
import { withRouter } from "react-router-dom";



class SummaryDetails extends Component {

    state = {
        createPACCApp: '',
        CashPaymentApplicationNumber: '',
        appStatus: '',
        currentAppStatus: '' 
    }

    componentDidMount = async () => {

        let {DataForRoomBooking,userInfo,roomToDate,roomFromDate,fetchPayment,prepareFinalObject,bothRoom} = this.props
       
 let BothRoomSelect=[];
        if(bothRoom == "Both"){
       
            BothRoomSelect = [
                {
                    "action": "OFFLINE_INITIATE",
                    "remarks": "string",
                    "roomBusinessService": "BKROOM",
                    "discount": this.props.discount,
                     "totalNoOfRooms": this.props.AccRoomToBook,
                      "typeOfRoom": "AC",
                    "fromDate": roomFromDate,
                    "toDate": roomToDate
                  },
                  {
                    "action": "OFFLINE_INITIATE",
                    "remarks": "string",
                    "roomBusinessService": "BKROOM",
                    "discount": this.props.discount,
                    "totalNoOfRooms": this.props.NonAccRoomToBook,
                    "typeOfRoom": "NON-AC",
                    "fromDate": roomFromDate,
                    "toDate":roomToDate
                  }]
                }

       if(bothRoom == "AC"){
        
        BothRoomSelect = [
            {
              "action": "OFFLINE_INITIATE",
              "remarks": "string",
              "roomBusinessService": "BKROOM",
              "discount": this.props.discount,
               "totalNoOfRooms": this.props.AccRoomToBook,
                "typeOfRoom": this.props.TypeOfRoomToBook,
              "fromDate": roomFromDate,
              "toDate": roomToDate
            }]
                    }
                if (bothRoom == "NON-AC"){
                    
                    BothRoomSelect = [
                        {
                          "action": "OFFLINE_INITIATE",
                          "remarks": "string",
                          "roomBusinessService": "BKROOM",
                          "discount": this.props.discount,
                           "totalNoOfRooms": this.props.NonAccRoomToBook,
                            "typeOfRoom": this.props.TypeOfRoomToBook,
                          "fromDate": roomFromDate,
                          "toDate": roomToDate
                        }]
                      
                }

            let Booking = {
            "bkRemarks": null,
            "reInitiateStatus": false,
            "bkApplicationNumber": DataForRoomBooking.bookingsModelList[0].bkApplicationNumber,
            "bkHouseNo": DataForRoomBooking.bookingsModelList[0].bkHouseNo,
            "bkAddress": null,
            "bkSector": DataForRoomBooking.bookingsModelList[0].bkSector,
            "bkVillCity": null,
            "bkAreaRequired": null,
            "bkDuration": "FULLDAY",
            "bkCategory": null,
            "bkEmail": DataForRoomBooking.bookingsModelList[0].bkEmail, 
            "bkContactNo": null,
            "bkDocumentUploadedUrl": null,
            "bkDateCreated":  DataForRoomBooking.bookingsModelList[0].bkDateCreated,
            "bkCreatedBy": null,
            "bkWfStatus": null,
            "bkAmount": null,
            "bkPaymentStatus": "",
            "bkBookingType": DataForRoomBooking.bookingsModelList[0].bkBookingType,
            "bkFromDate": DataForRoomBooking.bookingsModelList[0].bkFromDate,
            "bkToDate": DataForRoomBooking.bookingsModelList[0].bkToDate,
            "bkApplicantName": DataForRoomBooking.bookingsModelList[0].bkApplicantName,
            "bkBookingPurpose": DataForRoomBooking.bookingsModelList[0].bkBookingPurpose,
            "bkVillage": null,
            "bkDimension":DataForRoomBooking.bookingsModelList[0].bkDimension,
            "bkLocation": DataForRoomBooking.bookingsModelList[0].bkLocation,
            "bkStartingDate": null,
            "bkEndingDate": null,
            "bkType": null,
            "bkResidenceProof": null,
            "bkCleansingCharges": DataForRoomBooking.bookingsModelList[0].bkCleansingCharges,
            "bkRent": DataForRoomBooking.bookingsModelList[0].bkRent,
            "bkSurchargeRent": DataForRoomBooking.bookingsModelList[0].bkSurchargeRent,
            "bkFacilitationCharges": DataForRoomBooking.bookingsModelList[0].bkFacilitationCharges,
            "bkUtgst": DataForRoomBooking.bookingsModelList[0].bkUtgst,
            "bkCgst": DataForRoomBooking.bookingsModelList[0].bkCgst,
            "bkMobileNumber": DataForRoomBooking.bookingsModelList[0].bkMobileNumber,
            "bkCustomerGstNo": DataForRoomBooking.bookingsModelList[0].bkCustomerGstNo,
            "bkCurrentCharges": null,
            "bkLocationChangeAmount": null,
            "bkVenue": null,
            "bkDate": null,
            "bkFatherName": null,
            "bkBookingVenue": DataForRoomBooking.bookingsModelList[0].bkBookingVenue,
            "bkBookingDuration": null,
            "bkIdProof": null,
            "bkApplicantContact": null,
            "bkOpenSpaceLocation": null,
            "bkLandmark": null, 
            "bkRequirementArea": null,
            "bkLocationPictures": null,
            "bkParkOrCommunityCenter": null,
            "bkRefundAmount": DataForRoomBooking.bookingsModelList[0].bkRefundAmount,
            "bkNomineeName":DataForRoomBooking.bookingsModelList[0].bkNomineeName,
            "bkBankAccountNumber": DataForRoomBooking.bookingsModelList[0].bkBankAccountNumber,
            "bkBankName": DataForRoomBooking.bookingsModelList[0].bkBankName,
            "bkIfscCode": DataForRoomBooking.bookingsModelList[0].bkIfscCode,
            "bkAccountType": DataForRoomBooking.bookingsModelList[0].bkAccountType,
            "bkBankAccountHolder": DataForRoomBooking.bookingsModelList[0].bkBankAccountHolder,
            "bkPropertyOwnerName": null,
            "bkCompleteAddress": null,
            "bkResidentialOrCommercial": null,
            "bkMaterialStorageArea": null,
            "bkPlotSketch": null,
            "bkApplicationStatus": DataForRoomBooking.bookingsModelList[0].bkApplicationStatus,
            "bkTime": null,
            "bkStatusUpdateRequest": null,
            "bkStatus": null,
            "bkDriverName": null,
            "bkVehicleNumber": null,
            "bkEstimatedDeliveryTime": null,
            "bkActualDeliveryTime": null,
            "bkNormalWaterFailureRequest": null,
            "bkUpdateStatusOption": null,
            "bkAddSpecialRequestDetails": null,
            "bkBookingTime": null,
            "bkApprovedBy": null,
            "bkModuleType": null,
            // "uuid": "5f09ffbe-db9f-41e8-a9b2-dda6515d9cc7",
            "tenantId": DataForRoomBooking.bookingsModelList[0].tenantId,
            "bkAction": DataForRoomBooking.bookingsModelList[0].bkAction,
            "bkConstructionType": null,
            "businessService": DataForRoomBooking.bookingsModelList[0].businessService,
            "bkApproverName": null,
            "assignee": null,
            "wfDocuments": null,
            "financialYear": "2021-2022",
            "financeBusinessService": "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR",//"BKROOM",//BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR
            "roomBusinessService": "BKROOM",
            "roomsModel": BothRoomSelect,
          }
        let createAppData = {
  "applicationType": "BKROOM",
  "applicationStatus": null,
  "applicationId": DataForRoomBooking.bookingsModelList[0].bkApplicationNumber,
  "tenantId": userInfo.tenantId,
  "Booking": Booking   
            }
 
let payloadfund = await httpRequest(
            "bookings/community/room/_create",
            "_search",[],
            createAppData
            );

 

 this.setState({
  
    CashPaymentApplicationNumber : payloadfund.data.roomsModel[0].roomApplicationNumber,
   
 })

 prepareFinalObject("CreateRoomApplication",payloadfund)

 fetchPayment(
    [{ key: "consumerCode", value: payloadfund.data.roomsModel[0].roomApplicationNumber }, { key: "businessService", value: "BOOKING_BRANCH_SERVICES.COMMUNITY_CENTRES_JHANJ_GHAR" }, { key: "tenantId", value: userInfo.tenantId }
    ])
    }

    firstStep = e => {
        e.preventDefault();
        this.props.firstStep();
    }
    back = e => {
        e.preventDefault();
        this.props.prevStep();
    }
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
            let changetenantId = userInfo.tenantId ? userInfo.tenantId.split(".")[0] : "ch";
            let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
            let fileUrls =
                fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds, changetenantId) : {};


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
            prepareFinalObject('documentsPreview', documentsPreview)
        }
    }

submit = async (InitiateAppNumber) => {



let NumberApp = this.state.CashPaymentApplicationNumber;


this.props.SetPaymentURL(`/egov-services/PaymentReceiptDteail/ForRoomBooking/${this.state.CashPaymentApplicationNumber}`);

}

    render() {    
        return ( 
            <div>
                <div className="form-without-button-cont-generic">
                    <div classsName="container">
                        <div className="col-xs-12">

                            <RoomPaymentCard
                            TotalAmount={this.props.TotalAmount} 
                            BKROOM_TAX={this.props.BKROOM_TAX}
                            BKROOM={this.props.BKROOM}
                            BKROOM_ROUND_OFF={this.props.BKROOM_ROUND_OFF}
                            four={this.props.four}
                            />
                           

<SummaryCCBookingDetail 
Name={this.props.Name}    
purpose={this.props.purpose}
houseNo={this.props.houseNo}
mobileNo={this.props.mobileNo}
Sector={this.props.Sector} 
gstNo={this.props.gstNo}
ProofOfResidence={this.props.ProofOfResidence}
                            />

                            <SummaryVenueDetail
                                 location={this.props.location}
                                 NoOfDays={this.props.NoOfDays}
                                 locality={this.props.locality}
                                 fromDate={this.props.fromDate}
                                 toDate={this.props.toDate}
                                 dimension={this.props.dimension}
                                 RefundableSecurity={this.props.RefundableSecurity}
                                 cleaningCharges={this.props.cleaningCharges}
                                 Rent={this.props.Rent}
                                 utgst={this.props.utgst}
                                 cgst={this.props.cgst}
                                 surcharge={this.props.surcharge}
                                 facilitationCharges={this.props.facilitationCharges}
                            />                   
                            <SummaryRoomBookingDetail
                                RoomBookingData={this.props.RoomBookingData}
                                AccRoomToBook={this.props.AccRoomToBook}
                                NonAccRoomToBook={this.props.NonAccRoomToBook}
                            />
                            <div className="col-xs-12" style={{ marginLeft: '10px' }}>
                                <div className="col-sm-12 col-xs-12" style={{ marginBottom: '90px' }}>
                                    <div className="complaint-detail-detail-section-status row">
                                        <div className="col-md-4">
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div></div>
                <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
                    <div className="responsive-action-button-cont">
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
    const { userInfo } = state.auth;

    let SetPaymentURL = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.SetPaymentURL : "NA"

let DataForRoomBooking = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.RoomBookingData : "NA"
    const { paymentData } = bookings;
    let paymentDataOne = paymentData ? paymentData : "wrong";


    let bothRoom = state.screenConfiguration.preparedFinalObject ?
     (state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== undefined && state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom !== null ?state.screenConfiguration.preparedFinalObject.GlobalTypeOfRoom : 'NA'): "NA"

    let billAccountDetailsArray =  paymentDataOne ? paymentDataOne.Bill[0].billDetails[0].billAccountDetails : "NOt found Any Array"

let TotalAmount = paymentDataOne.Bill[0].totalAmount
let BKROOM_TAX = 0;
let BKROOM = 0;
let BKROOM_ROUND_OFF = 0;   
let four = 0;

for(let i = 0; i < billAccountDetailsArray.length ; i++ ){

    if(billAccountDetailsArray[i].taxHeadCode == "CGST_UTGST_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
        BKROOM_TAX = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "RENT_COMMUNITY_CENTRES_JHANJ_GHAR_BOOKING_BRANCH"){
        BKROOM = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "BKROOM_ROUND_OFF"){
        BKROOM_ROUND_OFF = billAccountDetailsArray[i].amount
    }
    else if(billAccountDetailsArray[i].taxHeadCode == "ROOM_FACILITATION_CHARGE"){
        four = billAccountDetailsArray[i].amount
    }
}     
    return { four,
     state,DataForRoomBooking,userInfo,TotalAmount,BKROOM_TAX,BKROOM,BKROOM_ROUND_OFF,SetPaymentURL,bothRoom
        
    }
 
}
const mapDispatchToProps = dispatch => {
    return {

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