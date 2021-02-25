import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import SuccessMessageForPCC from "../../modules/SuccessMessageForPCC";
import { connect } from "react-redux";
import { createWaterTankerApplication, downloadBWTApplication,downloadPaccPermissionLetter } from "../../redux/bookings/actions";
import jp from "jsonpath";
import { getDurationDate, getFileUrlFromAPI} from '../../modules/commonFunction'
import "./index.css";
import { SortDialog, Screen } from "modules/common";
import isEmpty from "lodash/isEmpty";
import {
	downloadEsamparkApp
} from "egov-ui-kit/redux/bookings/actions";



class CreateWBTApplicationSuccess extends Component {

  continueComplaintSubmit = () => {
    let { createPACCApplicationData,userInfo,fetchSuccess } = this.props;
    createPACCApplicationData={}
    fetchSuccess=false;
  
    this.props.history.push(`/egov-services/all-applications`);
    window.location.reload(); 
  };
  componentDidMount = async () => {   
  }

  downloadPermissionLetter= async () => {
    const { downloadpaccpermissinLetter, userInfo,createPACCApplicationData,documentMap} = this.props;

    let applicationDetails = createPACCApplicationData ? createPACCApplicationData : 'dataNotFound';
    console.log("applicationDetails--",applicationDetails)
    let approverName;
  for(let i = 0; i < userInfo.roles.length ; i++ ){
    if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
      approverName = userInfo.roles[i].name
    }
  }
    let fdocname = Object.entries(documentMap)[0][1]

   let BookingInfo  = [
     {
    "applicantDetail": {
      "name": applicationDetails.bkApplicantName,
      "mobileNumber":applicationDetails.bkMobileNumber,
      "email": applicationDetails.bkEmail,
      "permanentAddress": "",
      "permanentCity": "Chandigarh",
      "sector": applicationDetails.bkSector,
      "fatherName": " ",
      "custGSTN": "asd",
      "placeOfService": "Chandigarh"
  },
            "bookingDetail": {
              "applicationNumber": applicationDetails.bkApplicationNumber,
              "applicationDate": applicationDetails.bkDateCreated,
              "bookingPeriod":  getDurationDate(
                applicationDetails.bkFromDate,
                applicationDetails.bkToDate
              ),
              "bookingType": applicationDetails.bkBookingType,
               "venueName": applicationDetails.bkLocation,
              "sector": applicationDetails.bkSector,
              "bookingPurpose": applicationDetails.bkBookingPurpose,
          },
          "generated": {
            "generatedBy": userInfo.name,
          },
          "approvedBy": {
            "approvedBy": userInfo.name,
            "role": approverName
        },
          "emp": {
              "samparkName": "E Sampark",
              "samparkaddress": "sector 7"
          },
          "paymentInfo": {
              "cleaningCharges": applicationDetails.bkCleansingCharges,
              "baseCharge": this.props.totalAmount,
              "cgst" :applicationDetails.bkCgst,
              "utgst": applicationDetails.bkCgst,
              "totalgst": "",
              "refundableCharges": applicationDetails.bkRefundAmount,
              "totalPayment": this.props.totalAmount,
              "paymentDate": convertEpochToDate(this.props.transactionDate,"dayend"),
              "receiptNo": this.props.ReceiptNumber,
          },
          "OtherDetails": {
              "clchargeforwest":  applicationDetails.bkCleansingCharges,
              "westaddress": "",
              "clchargeforother": ""
          },
          "tenantInfo": {
              "municipalityName": "Municipal Corporation Chandigarh",
              "address": "New Deluxe Building, Sector 17, Chandigarh",
              "contactNumber": "+91-172-2541002, 0172-2541003",
              "logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
              "webSite": "http://mcchandigarh.gov.in",
              "statecode": "998",
              "hsncode": "45",
              "mcGSTN":""
          },
          "bankInfo": {
              "accountholderName": applicationDetails.bkBankAccountHolder,
              "rBankName": applicationDetails.bkBankName,
              "rBankACNo": applicationDetails.bkBankAccountNumber,
              "rIFSCCode": applicationDetails.bkIfscCode
          }
      }
  ]
  // downloadEsamparkApp({ BookingInfo: BookingInfo })
  downloadPaccPermissionLetter({ BookingInfo: BookingInfo })

  }
/** 
 	let approverName;
		//userInfo.roles
			
				for(let i = 0; i < userInfo.roles.length ; i++ ){
					if(userInfo.roles[i].code == "BK_E-SAMPARK-CENTER"){
						approverName = userInfo.roles[i].name
					}
				}
		
			

	let	BookingInfo= [
			{
				"applicantDetail": {
					"name": selectedComplaint.bkApplicantName,
					"mobileNumber": selectedComplaint.bkMobileNumber,
					"email": selectedComplaint.bkEmail,
					"permanentAddress": "",
					"permanentCity": "Chandigarh",
					"sector": selectedComplaint.bkSector,
					"fatherName": "",
					"custGSTN": bkCustomerGstNo == "NA" ? "Not Applicable" : bkCustomerGstNo,  //shivam
					"placeOfService": "Chandigarh" //shivam
				},
				"bookingDetail": {
					"applicationNumber": selectedComplaint.bkApplicationNumber,
					"applicationDate": selectedComplaint.dateCreated,
					"bookingPeriod": getDurationDate(
						selectedComplaint.bkFromDate,
						selectedComplaint.bkToDate
					),
					"bookingType": selectedComplaint.bkBookingType,
					"venueName": selectedComplaint.bkLocation,
					"sector": selectedComplaint,
					"bookingPurpose": selectedComplaint
					
				},
				"booking": {
					"bkLocation": selectedComplaint.bkLocation,
					"bkDept": selectedComplaint.bkBookingType,
					"bkFromTo": getDurationDate(
						selectedComplaint.bkFromDate,
						selectedComplaint.bkToDate
					),
				},
				generatedBy: {
					generatedBy: userInfo.name,
				},
				approvedBy:{
					approvedBy: userInfo.name,
					role: approverName,
				},
				"emp": {
					"samparkName": approverName,
					"address": "sector 7",
					"OpCode":"123"
				},
				"paymentInfo": {
					"cleaningCharges": bkCleansingCharges,
					"baseCharge": "1452",
					"cgst": "214",
					"utgst": "245",
					"totalgst": "452",
					"refundableCharges": "546",
					"totalPayment": "7852",
					"paymentDate": "9/feb/2021",
					"receiptNo": "23/ASD/2021",
					"paymentType": "Online",
					"facilitationCharge": "100",
					"discType": "50%",
					"transactionId": "12321",
					"totalPaymentInWords": "Amount in totalPaymentInWords",
					"bankName":"Paytm"
				},
				"OtherDetails": {
					"clchargeforwest": "2000",
					"westaddress": "west area",
					"clchargeforother": "1000"
				},
				"tenantInfo": {
					"municipalityName": "Municipal Corporation Chandigarh",
					"address": "New Deluxe Building, Sector 17, Chandigarh",
					"contactNumber": "+91-172-2541002, 0172-2541003",
					"logoUrl": "https://chstage.blob.core.windows.net/fileshare/logo.png",
					"webSite": "http://mcchandigarh.gov.in",
					"mcGSTN": "aasdadad",
					"statecode": "998",
					"hsncode": "45"
				},
				"bankInfo": {
					"accountholderName": "Shivam",
					"rBankName": "SBI",
					"rBankACNo": "123456789125489",
					"rIFSCCode": "SBIN0123456"
				}
			}
		]
  
*/

  downloadApplicationFunction = async (e) => {
    const { downloadEsamparkApp, userInfo,createPACCApplicationData,documentMap} = this.props;
    
    let applicationDetails = createPACCApplicationData ? createPACCApplicationData : 'dataNotFound';
    console.log("applicationDetails--",applicationDetails)
    let fdocname = Object.entries(documentMap)[0][1]
    
   let BookingInfo = [
      {
          "applicantDetail": {
              "name": applicationDetails.bkApplicantName,
              "mobileNumber":applicationDetails.bkMobileNumber,
              "email": applicationDetails.bkEmail,
              "permanentAddress": "",
              "permanentCity": "Chandigarh",
              "sector": applicationDetails.bkSector,
              "fatherName": " "
          },
          "bookingDetail": {
              "applicationNumber": applicationDetails.bkApplicationNumber,
              "applicationDate": "",
              "bookingPeriod": getDurationDate(
                applicationDetails.bkFromDate,
                applicationDetails.bkToDate
              ),
              "venueName": applicationDetails.bkLocation,
              "sector": applicationDetails.bkSector,
              "bookingPurpose": applicationDetails.bkBookingPurpose,
              "parkDim": applicationDetails.bkDimension
          },
          "feeDetail": {
              "baseCharge": applicationDetails.bkRent,
              "cleaningCharge": applicationDetails.bkCleansingCharges,
              "surcharges": applicationDetails.bkSurchargeRent,
              "facilitationCharge": applicationDetails.bkFacilitationCharges ? applicationDetails.bkFacilitationCharges : "100",
              "utgst": applicationDetails.bkUtgst,
              "cgst": applicationDetails.bkCgst,
              "gst": applicationDetails.bkCgst,
              "totalAmount": applicationDetails.bkRent
          },
          "generatedBy":{
            "generatedBy": userInfo.name,
            "generatedDateTime": userInfo.createdDate
        },
        "documentDetail":{
            "documentName": fdocname
        }
      }
  ]

  downloadEsamparkApp({ BookingInfo: BookingInfo })
  };

  downloadApplicationButton = async (e) => {
   await this.downloadApplicationFunction();
    const {DownloadBWTApplicationDetails,userInfo,Downloadesamparkdetails}=this.props;

		var documentsPreview = [];
		let documentsPreviewData;
		if (Downloadesamparkdetails && Downloadesamparkdetails.filestoreIds.length > 0) {	
			documentsPreviewData = Downloadesamparkdetails.filestoreIds[0];
				documentsPreview.push({
					title: "DOC_DOC_PICTURE",
					fileStoreId: documentsPreviewData,
					linkText: "View",
				});
				let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
				let fileUrls =
					fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
				
	
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
				
			}
  
  
  
  }

  downloadPermissionButton = async (e) => {
    await this.downloadPermissionLetter();
     const {DownloadBWTApplicationDetails,userInfo,EmpPaccPermissionLetter}=this.props;
 
     var documentsPreview = [];
     let documentsPreviewData;
     if (EmpPaccPermissionLetter && EmpPaccPermissionLetter.filestoreIds.length > 0) {	
       documentsPreviewData = EmpPaccPermissionLetter.filestoreIds[0];
         documentsPreview.push({
           title: "DOC_DOC_PICTURE",
           fileStoreId: documentsPreviewData,
           linkText: "View",
         });
         let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
         let fileUrls =
           fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds,userInfo.tenantId) : {};
         
   
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
         
       }
   
   
   
   }

  render() {
    const { createWaterTankerApplicationData,myLocationtwo, downloadBWTApplication,loading,createPACCApplicationData, updatePACCApplicationData } = this.props;
    //BK_MYBK_PCC_CREATE_APPLICATION_HEADER
    // Park And Community Centre

    console.log("InSuccessPage--",
    { labelName: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER-Value", labelKey: "BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER" },
    { labelName: "BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE--", labelKey: "BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE" },
    { labelName: "BK_CS_COMMON_SEND_MESSAGE--", labelKey: "BK_CS_COMMON_SEND_MESSAGE" },
)
 
    return (
      <Screen loading={loading}>
      <div className="success-message-main-screen resolve-success">
      <SuccessMessageForPCC
         headermessage="BK_MYBK_APPLY_SPECIAL_REQUEST_HEADER"
          successmessage="BK_ES_APPLICATION_CREATED_SUCCESS_MESSAGE"
          secondaryLabel="BK_CS_COMMON_SEND_MESSAGE"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
          applicationNumber={createPACCApplicationData&&createPACCApplicationData?createPACCApplicationData.bkApplicationNumber:''}
        />
        <div className="responsive-action-button-cont">
          <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD" />}
            fullWidth={true}
            onClick={this.downloadApplicationButton}
            style={{ marginRight: 18 }}
          />
           {/* <Button
            className="responsive-action-button"
            primary={true}
            label={<Label buttonLabel={true} label="BK_CORE_COMMON_DOWNLOAD" />}
            fullWidth={true}
            onClick={this.downloadPermissionLetter}
            style={{ marginRight: 18 }}
          /> */}
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
            className="responsive-action-button"
          />
        </div>
      </div>
      </Screen>
    );
  }
}


const mapStateToProps = state => {
  const { complaints, bookings,common, auth, form } = state;
  const { userInfo } = auth;
  const { updatePACCApplicationData,fetchSuccess, Downloadesamparkdetails,EmpPaccPermissionLetter} = bookings;
  const { createWaterTankerApplicationData, DownloadBWTApplicationDetails,categoriesById } = complaints;
  let documentMap = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.documentMap : "";
  let createPACCApplicationData = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.CreatePaccAppData : "NotAnyMore";
  console.log("createPACCApplicationData--",createPACCApplicationData)


  // const loading = !isEmpty(createPACCApplicationData)
  // ? fetchSuccess
  //   ? false
  //   : true
  // : true;

  const loading = false;

  
  return {
    createWaterTankerApplicationData, DownloadBWTApplicationDetails,loading,fetchSuccess,createPACCApplicationData,
    updatePACCApplicationData,Downloadesamparkdetails,userInfo,documentMap,EmpPaccPermissionLetter
  }
}

const mapDispatchToProps = dispatch => {
  return {
    downloadPaccPermissionLetter: criteria => dispatch(downloadPaccPermissionLetter(criteria)),
    downloadEsamparkApp: criteria => dispatch(downloadEsamparkApp(criteria)),
    createWaterTankerApplication: criteria => dispatch(createWaterTankerApplication(criteria)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWBTApplicationSuccess);