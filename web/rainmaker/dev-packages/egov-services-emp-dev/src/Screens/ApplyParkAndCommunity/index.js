import React, { Component } from 'react';
import PersonalInfo from './components/ApplicatDetails';  
import BookingDetails from './components/BookingDetails'; 
import BankDetails from './components/BankDetails';
import SummaryInfo from './components/SummaryDetails';
import DocumentDetails from './components/DocumentsDetails'; 
import ParkPaymentDetails from './components/PaccPaymentDetails'
import fetchfacilationCharges from 'egov-ui-kit/redux/bookings/actions'
import { connect } from "react-redux";
import get from "lodash/get"; 
import moment from 'moment';
import { httpRequest } from "egov-ui-kit/utils/api";
import Label from "egov-ui-kit/utils/translationNode";
import { Box, Button, Card, CardContent, CircularProgress, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export class StepForm extends Component {
// this.props.appData &&  this.props.appData.bkApplicantName ||  "" 

    state = {  
        step: 0,  
        firstName: this.props.appData !== "NotFound" ? (this.props.appData.bkApplicantName ? this.props.appData.bkApplicantName : '') : '',
        bookingStepRefundAmount:'',
        BankAccountName: this.props.appData !== "NotFound" ? (this.props.appData.bkBankName ? this.props.appData.bkBankName : '') : '',
        NomineeName: this.props.appData !== "NotFound" ? (this.props.appData.bkNomineeName ? this.props.appData.bkNomineeName : '') : '',
        BankAccountNumber: this.props.appData !== "NotFound" ? (this.props.appData.bkBankAccountNumber ? this.props.appData.bkBankAccountNumber : '') : '',
        IFSCCode: this.props.appData !== "NotFound" ? (this.props.appData.bkIfscCode ? this.props.appData.bkIfscCode : ''):'',
        AccountHolderName: this.props.appData !== "NotFound" ? (this.props.appData.bkBankAccountHolder ? this.props.appData.bkBankAccountHolder : '') : '',
        accountType:  this.props.appData !== "NotFound" ? (this.props.appData.bkAccountType ? this.props.appData.bkAccountType : 'Saving') : 'Saving',
        lastName: '', 
        email:this.props.appData !== "NotFound" ? (this.props.appData.bkEmail ? this.props.appData.bkEmail : '') : '',
        mobileNo:this.props.appData !== "NotFound" ? (this.props.appData.bkMobileNumber ? this.props.appData.bkMobileNumber : '') : '',
        jobTitle: '', 
        jobCompany: '',
        jobLocation: '',
        houseNo:this.props.appData !== "NotFound" ? (this.props.appData.bkHouseNo ? this.props.appData.bkHouseNo : '') : '',
        purpose: this.props.appData !== "NotFound" ?(this.props.appData.bkBookingPurpose ? this.props.appData.bkBookingPurpose : '') : '',
        locality:this.props.appData !== "NotFound" ? (this.props.appData.bkLocation ? this.props.appData.bkLocation : '') : '',
        residenials: this.props.appData !== "NotFound" ?(this.props.appData.bkResidentialOrCommercial !== undefined && this.props.appData.bkResidentialOrCommercial !== null ? this.props.appData.bkResidentialOrCommercial : '') : '',
        approverName: '',//bkBookingPurpose
        comment: '',
        dimension: '', 
        DiscountReason : this.props.appData !== "NotFound" ?(this.props.appData.bkRemarks ? this.props.appData.bkRemarks : '') : '',//
        location: this.props.appData !== "NotFound" ?(this.props.appData.bkLocation ? this.props.appData.bkLocation : '') : '',//bkLocation
        cleaningCharges: '', 
        rent: '',
        facilitationCharges: '',
        NewfCharges: '',
        surcharge: '', utGST: '', cGST: '',
        GSTnumber: this.props.appData !== "NotFound" ?(this.props.appData &&  this.props.appData.bkCustomerGstNo ||  "") : '', type: '',
        fromDate: '', finalRent: '',
        toDate: '', transactionNumber: '', bankName: '', 
        paymentMode: this.props.appData !== "NotFound" ?(this.props.appData.bkMaterialStorageArea !== undefined && this.props.appData.bkMaterialStorageArea !== null ? this.props.appData.bkMaterialStorageArea : '') : '',
         amount: '', transactionDate: '', 
        discountType: this.props.appData !== "NotFound" ?(this.props.appData.bkPlotSketch ? this.props.appData.bkPlotSketch : 'General') : 'General',       //bkPlotSketch 
        childrenArray: [
            { labelName: "Applicant Details", labelKey: "APPLICANT DETAILS" },
            { labelName: "Booking Details", labelKey: "BOOKING DETAILS" },
            { labelName: "Bank Details", labelKey: "BANK DETAILS" },
            // { labelName: "Payments Details", labelKey: "PAYMENT DETAILS" },
            { labelName: "Documents", labelKey: "DOCUMENTS" },
            { labelName: "Summary", labelKey: "SUMMARY" },]

            
    }

    componentDidMount = async () => {

        let requestBody = {
            MdmsCriteria:{
                tenantId: commonConfig.tenantId,
            moduleDetails: [
                {
                    "moduleName": "BillingService",
                    "masterDetails": [
                        {
                            "name": "TaxHeadMaster"
                        }
                    ]
                }
            ]
        }
        }


        let hereFcCharges = await httpRequest(
            "egov-mdms-service/v1/_search",
            "_search", [],
            requestBody
          );
      

        let TaxHeadMaster = hereFcCharges.MdmsRes.BillingService.TaxHeadMaster
       
        var arrayName = [];
        arrayName.push(hereFcCharges.MdmsRes.BillingService.TaxHeadMaster)
        

        let IndexfCharges;
        if (arrayName && arrayName.length > 0) {
          arrayName.forEach((item) => {
            item.forEach((value) => {
              if (value.code == "FACILITATION_CHARGE") { 
                IndexfCharges = value
              }
            })
          })
        }
    
   let testFcharges = IndexfCharges && IndexfCharges.facilitationCharge ? IndexfCharges.facilitationCharge : "valueNotsetYet"
     this.setState({
        NewfCharges : testFcharges
     })    
      }

     nextStep = () => {
        const { step } = this.state;
        this.setState({
            step: step + 1
        });
    }

    prevStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 1
        });
    }

    firstStep = () => {
        const { step } = this.state;
        this.setState({
            step: step - 4
        });
    }

    onFromDateChange = e => {
        let fromDate = e.target.value;
        this.setState({
            fromDate 
        })
    }
    //screenConfiguration.preparedFinalObject.discountDocumentsUploadRedux
    handleChangeDiscount = (event) => {
        let {state} = this.props
        let findDocument;
        findDocument = state.screenConfiguration.preparedFinalObject.hasOwnProperty('discountDocumentsUploadRedux')
           
            let getDocumentRedux = get(
             state,
             "screenConfiguration.preparedFinalObject.discountDocumentsUploadRedux",
             "NotFound"
           );
           
            if(findDocument == true &&  getDocumentRedux == null){
      
      this.props.prepareFinalObject('discountDocumentsUploadRedux', {'0': {
      documentType: 'DOC',
      documentCode: 'BK_PCC_DISCOUNT_DOCUMENT',
      isDocumentRequired: true,
      isDocumentTypeRequired: false,
      mydocstate: false
      }})
      
      }
        this.setState({ discountType: event.target.value });
    };
    AccountType = (event) => {
        this.setState({ accountType: event.target.value });
    };

    onToDateChange = e => {
        const toDate = e.target.value;
        this.setState({
            toDate: toDate
        })
    }

    transactionDateChange = e => {
        const trDate = e.target.value;
        this.setState({
            transactionDate: trDate
        })

    }




    handleChange = input => e => {
        this.setState({ [input]: e.target.value });
    }



    calculateBetweenDaysCount = (startDate, endDate) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date(startDate);
        const secondDate = new Date(endDate);

        const daysCount =
            Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
        return daysCount;
    };
    showStep = () => {
        let { step, firstName, transactionDate, transactionNumber, bankName, paymentMode,
            BankAccountName,NomineeName,BankAccountNumber,IFSCCode,AccountHolderName,
            lastName, utGST, cGST, GSTnumber, type, jobTitle, facilitationCharges, surcharge,DiscountReason,
            jobCompany, approverName, comment, jobLocation, mobileNo, email,fCharges,
            dimension, cleaningCharges, houseNo, rent, purpose, locality, residenials, discountType,NewfCharges,accountType } = this.state;
            let fc = fCharges?fCharges.facilitationCharge:'100';
            var facCharges = NewfCharges !== "valueNotsetYet" && NewfCharges !== undefined && NewfCharges !== null && NewfCharges !== ""? NewfCharges : fc

      let checkDateVenueChange = false;

       let {ApplyForDateVenueChange} = this.props   
      

if(ApplyForDateVenueChange !== "NotFound"){
    checkDateVenueChange = true
}

      let bookingData = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.availabilityCheckData:""  
        let vanueData = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.bkBookingData:""
       
        let { fromDate, toDate, location, amount, finalRent } = this.state;
       
        let paccDate = this.props.stateData.screenConfiguration.preparedFinalObject ? this.props.stateData.screenConfiguration.preparedFinalObject.DisplayPacc : '';
        let daysCount = this.calculateBetweenDaysCount(
            bookingData ? bookingData.bkFromDate: "",
            bookingData ? bookingData.bkToDate: ""
        );
       
        let venueType = vanueData ? (vanueData.venueType && vanueData.venueType !== undefined && vanueData.venueType !== null ? (vanueData.venueType) : ''): "";
       
        let bokingType = bookingData ? (bookingData.bkBookingVenue && bookingData.bkBookingVenue !== undefined && bookingData.bkBookingVenue !== null ? (bookingData.bkBookingVenue) : ''): "";
       

        let totalAmount1
        let vrent
if(vanueData && vanueData !== undefined && vanueData !== null && vanueData.rent !== undefined && vanueData.rent !== null){
        vrent = Number(vanueData.rent);

totalAmount1 = vrent * daysCount;
  
    if (discountType == '100%' || discountType == "KirayaBhog" || discountType == "ReligiousFunction") {
        totalAmount1 = 0;
    } else if (discountType == '50%') {
        let discount = (50 * Number(totalAmount1)) / 100;
  
        totalAmount1 = Number(totalAmount1) - discount;
  
    } else if (discountType == '20%') {
        let discount = (20 * Number(totalAmount1)) / 100;
  
        totalAmount1 = Number(totalAmount1) - discount;
  

    } else {
        totalAmount1 = totalAmount1;
  
    }
}  

        if (paccDate) {
           
            fromDate = paccDate.bkDisplayFromDateTime;
           
            toDate = paccDate.bkDisplayToDateTime;
           
        }
        else {
            fromDate = moment(bookingData.bkFromDate).format("YYYY-MM-DD");
          
            toDate = moment(bookingData.bkToDate).format("YYYY-MM-DD");
          
        }




        if(location == ''){
            location = bookingData.bkLocation;
           
        }
        amount = vanueData.amount;
let displayRefundAmount =   vanueData!== undefined && vanueData!== null ? (vanueData.refundabelSecurity !== undefined && vanueData.refundabelSecurity !== null ? (vanueData.refundabelSecurity) : "") : ""

let NumberRefundAmount = Number(displayRefundAmount);


        cleaningCharges = Number(vanueData.cleaningCharges);
        let RentPlusCcharges = Number(cleaningCharges) + Number(totalAmount1);

        utGST = (Number(RentPlusCcharges) * Number(vanueData.utgstRate)) / 100

       
        cGST = (Number(RentPlusCcharges) * Number(vanueData.cgstRate)) / 100


        locality = vanueData.sector;


        let Newsurcharge = Number(utGST) + Number(cGST)

 
        surcharge = Math.round((Number(Newsurcharge) + Number.EPSILON) * 100) / 100
        //Number(Newsurcharge).toFixed(2)

        
       
       
        dimension = vanueData.dimensionSqrYards;
        let typefc = typeof(facCharges)
        
        let conFc = Number(facCharges)
        let showAmount;
        
        finalRent = RentPlusCcharges + utGST + cGST + conFc;
        

        let checkOne = Number.isNaN(finalRent)
        if(checkOne == false){
            showAmount = finalRent
        }

        let finalRent1 = Number(finalRent)

        let RefundPlusAllRent = finalRent1 + NumberRefundAmount;


        let RefundPlusAllRentNum = Number(RefundPlusAllRent)

        let fixedRefundPlusAllRentNum = RefundPlusAllRentNum.toFixed()

        let VfinalAmount = finalRent1.toFixed()
        
        let propsData = this.props
        if (step === 0)
            return (<PersonalInfo
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                firstName={firstName}    
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
                houseNo={houseNo}
                handleChangeDiscount={this.handleChangeDiscount}
                discountType={discountType}
                DiscountReason={DiscountReason}
                checkDateVenueChange={checkDateVenueChange}
            />);
        if (step === 1)
            return (<BookingDetails
                checkDateVenueChange={checkDateVenueChange}
                houseNo={houseNo}
                refundAbleAmount={displayRefundAmount}
                handleChangeDiscount={this.handleChangeDiscount}
                discountType={discountType}
                onFromDateChange={this.onFromDateChange}
                onToDateChange={this.onToDateChange}
                fromDate={fromDate} 
                toDate={toDate}
                dimension={dimension}
                 location={location}
                cleaningCharges={cleaningCharges}
                purpose={purpose}
                // rent={vrent}
                rent={totalAmount1}
                utGST={utGST}
                cGST={cGST}
                GSTnumber={GSTnumber}
                surcharge={surcharge}
                facilitationCharges={facilitationCharges}
                residenials={residenials}
                locality={locality}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                approverName={approverName}
                comment={comment}
                type={type}
            />);
        if (step === 2)
            return (<BankDetails
                checkDateVenueChange={checkDateVenueChange}
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                BankAccountName={BankAccountName}    
                NomineeName={NomineeName}
                BankAccountNumber={BankAccountNumber}
                IFSCCode={IFSCCode}
                AccountHolderName={AccountHolderName}
                accountType={accountType}
                AccountType={this.AccountType}
                nextStep={this.nextStep}
                prevStep={this.prevStep}
            />);
        if (step === 3)
            return (<DocumentDetails
                checkDateVenueChange={checkDateVenueChange}
                nextStep={this.nextStep}
                rent={vrent}
                prevStep={this.prevStep}
                handleChange={this.handleChange}
                firstName={firstName} 
                lastName={lastName}
                email={email}
                mobileNo={mobileNo}
            />);
        if (step === 4)
            return (<SummaryInfo
                bookingData={bookingData}
                venueType={venueType}
                bokingType={bokingType}
                discountType={discountType}
                accountType={accountType}
                approverName={approverName}
                amount={amount}
                bankName={bankName}
                transactionDate={transactionDate}
                transactionNumber={transactionNumber}
                paymentMode={paymentMode}
                comment={comment} 
                BankAccountName={BankAccountName}  //start for bank details 
                NomineeName={NomineeName} 
                BankAccountNumber={BankAccountNumber}
                IFSCCode={IFSCCode}
                AccountHolderName={AccountHolderName}
                firstName={firstName} //start of application details
                purpose={purpose}
                utGST={utGST}
                cGST={cGST}
                lastName={lastName}
                jobTitle={jobTitle}
                jobCompany={jobCompany}
                jobLocation={jobLocation}
                prevStep={this.prevStep}
                mobileNo={mobileNo}
                email={email}
                houseNo={houseNo}
                DiscountReason={DiscountReason}
                dimension={dimension}
                location={location}
                cleaningCharges={cleaningCharges}
                type={type}
                rent={vrent}
                fromDate={fromDate}
                toDate={toDate}
                GSTnumber={GSTnumber}
                surcharge={surcharge}
                facilitationCharges={facilitationCharges}
                locality={locality}
                residenials={residenials}
                {...propsData}
                firstStep={this.firstStep}
            />);
    }

    render() {
        
    

    const { step } = this.state;
    const {fromDateone,
    bookingOne} = this.props;
        return (

            <div className="stepBarSec" style={{ backgroundColor: 'aliceblue'}}>
                <div className="col-xs-12" style={{ padding: 0, float: 'left', width: '100%', backgroundColor: 'aliceblue'}}>
                    <div className="col-sm-12 col-xs-12" style={{ backgroundColor: 'aliceblue'}}>
                        <Stepper className="stepBar" style={{ backgroundColor: "transparent" }} alternativeLabel activeStep={step}>
                            {this.state.childrenArray.map((child, index) => (
                                <Step key={child.labelKey}>
                                    <StepLabel>{child.labelKey}</StepLabel>
                                </Step>
                            ))}

                        </Stepper>
                    </div>
                </div>
                {this.showStep()}

                <style>
        {`
    @media screen and (min-width: 320px) and (max-width: 568px) {
.stepBarSec{margin-top:50px;}
.stepBar{overflow-x: auto; padding: 24px 15px 15px 15px;}
.apply-wizard-footer {left: 0; position: static !important;}
.applyBtnWrapper{display:flex !important; position: static !important;}
.applyBtnWrapper .responsive-action-button{min-width:auto !important; width:50%;}
.rainmaker-displayInline{display:block !important;}
.clearMob{clear: both;}

}
    `}
    </style>
            </div>

           
           
        );
    }
}


const mapStateToProps = state => {
    const { complaints, common, auth, form, bookings} = state;
    const { facilationChargesSuccess, arrayName } = bookings;
  let fromDateone = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.availabilityCheckData : "one"
  let bookingOne = state.screenConfiguration.preparedFinalObject ? state.screenConfiguration.preparedFinalObject.bkBookingData:"two"
  let stateData = state;
  let Previousdiscount = "NotFound"
  let appData = "NotFound"
let findApplicationData;
findApplicationData = state.bookings.hasOwnProperty('applicationData')


let applicationData = get(
    state,
    "bookings.applicationData",
    "NotFound"
  );
 
  

if(findApplicationData == true && applicationData !== "NotFound"){
    appData = state.bookings ? (state.bookings.applicationData !== undefined && state.bookings.applicationData !== null ? state.bookings.applicationData.bookingsModelList.length > 0 ?(state.bookings.applicationData.bookingsModelList[0]) :'NA' : 'NA'): 'NA'
   
  
    if(appData !== undefined && appData !== null && appData !== 'NA'){
       if(appData.discount == 0){
          Previousdiscount = "General"
       } 
       if(appData.discount == 50){
          Previousdiscount = "50%"
       }
       if(appData.discount == 20){
          Previousdiscount = "50%"
       }
       if(appData.discount == 100){
          Previousdiscount = "100%"
       }
    }
}
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

  let ApplyForDateVenueChange = get(
    state,
    "screenConfiguration.preparedFinalObject.EmployeeDateVenueChange",
    "NotFound"
  );

    return {
        stateData,
        fromDateone,
        bookingOne,
        fCharges,
        appData,
        Previousdiscount,
        ApplyForDateVenueChange,
        state
    }
}

const mapDispatchToProps = dispatch => {
    return {
        prepareFinalObject: (jsonPath, value) =>
        dispatch(prepareFinalObject(jsonPath, value))
    }
  }

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StepForm);
