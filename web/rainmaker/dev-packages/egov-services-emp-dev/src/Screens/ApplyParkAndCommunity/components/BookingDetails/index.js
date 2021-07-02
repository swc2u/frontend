import React, { Component } from 'react';
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fetchApplicaionSector, fetchfacilationCharges } from "egov-ui-kit/redux/bookings/actions";
import "./index.css";
import Footer from "../../../../modules/footer"
import moment from 'moment';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import FormLabel from '@material-ui/core/FormLabel';


class BookingsDetails extends Component {
  state = {
    open: false, setOpen: false,
    genderValue: "female"
  }

 
  componentDidMount = async () => {
    let { fetchApplicaionSector } = this.props;
    fetchApplicaionSector();
    this.props.fetchfacilationCharges();

  }
  continue = e => {
    e.preventDefault();
    const { jobTitle, jobCompany, toggleSnackbarAndSetText, utGST, GSTnumber, jobLocation, handleChange, facilitationCharges, approverName, dimension, location, cleaningCharges, comment, houseNo, rent, purpose, surcharge, cGST, locality, type, residenials, fromDate, toDate } = this.props;
    if (purpose == "" || residenials == "") {


      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Error_Message_For_Water_tanker_Application",
          labelKey: `BK_ERROR_MESSAGE_FOR_ALL_FILLED_REQUIRED`
        },
        "warning"
      );
    } else if (fromDate > this.state.toDate) {
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "From_Date_Is_Greater_Than_To_Date",
          labelKey: `BK_FROM_DATE_SHOULSD_GREATER_THAN_TO_DATE`
        },
        "warning"
      );
    }
    else {
      this.props.nextStep();
    }
  }

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  }
  handleClose = () => {
    this.setState({
      setOpen: false
    })
  };

  handleOpen = () => {
    this.setState({
      setOpen: true
    })
  };
  handleChangeDiscount = (event) => {
   
    this.setState({ genderValue: event.target.value });
  };

 
  render() {
    const { arrayName, result,fCharges, jobTitle, jobCompany, jobLocation, handleChangeDiscount, checkDateVenueChange,
      discountType, dimension, complaintSector, fromDate, surcharge, toDate, onFromDateChange, onToDateChange, utGST, cGST, GSTnumber, handleChange, location, facilitationCharges, cleaningCharges, rent, approverName, comment, houseNo, type, purpose, locality, residenials, facilationChargesSuccess,firstToTimeSlot,
      refundAbleAmount } = this.props;
      let localRent;
      let localUTGST;
      let LocalGST;

      if(discountType == "100%" || discountType == "KirayaBhog" || discountType == "ReligiousFunction"){
        localRent = 0,
        localUTGST = 0,
        LocalGST = 0
      }
      else{
        localRent = rent 
        localUTGST  = utGST 
        LocalGST = cGST
      }
      this.props.prepareFinalObject("PaccDiscount.localRent", localRent);
      this.props.prepareFinalObject("PaccDiscount.localUTGST", localUTGST);
      this.props.prepareFinalObject("PaccDiscount.LocalGST", LocalGST);
    let sectorData = [];
    sectorData.push(complaintSector);
    let fc = fCharges ? fCharges.facilitationCharge :'100'
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden"
    };
    return (

      <div style={{ float: 'left', width: '100%', padding: '36px 15px' }}>
        <div className="col-xs-12" style={{ background: '#fff', padding: '15px 0' }}>


          <div className="col-sm-6 col-xs-12">
            <TextField
              id="purpose"
              name="purpose"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={purpose}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_NAME_PURPOSE_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_PURPOSE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('purpose')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="location"
              name="location"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={location}
              required={true}
              disabled
              hintText={
                <Label
                  label="BK_MYBK_NAME_LOCATION_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_LOCATION"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('location')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="cleaningCharges"
              name="cleaningCharges"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={cleaningCharges}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_CLEANING_CHARGES_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CLEANING_CHARGES"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('cleaningCharges')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="rent"
              name="rent"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={localRent}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_RENT_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_RENT"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('rent')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
  
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="rent"
              name="rent"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={refundAbleAmount}
              required={true}
              hintText={ 
                <Label
                  label="BK_MYBK_REFUNDABLE_AMOUNT"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_REFUNDABLE_AMOUNT"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('rent')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
 

          <div className="col-sm-6 col-xs-12">
            <TextField
              id="facilitationCharges"
              name="facilitationCharges"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={fc}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_FACILITATION_CHARGES_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_FCHARGES"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('facilitationCharges')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="surcharge"
              name="surcharge"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={surcharge}
              required={true}
              hintText={
                <Label
                  label="Surcharge On Rent"   // label="BK_MYBK_NAME_SURCHARGE_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="Surcharge On Rent"   //label="BK_MYBK_CREATE_SURCHARGE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('surcharge')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="utGST"
              name="utGST"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={localUTGST}
              required={true}
              hintText={
                <Label
                label="UTGST"               //label="BK_MYBK_UTGST_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="UTGST"                         // label="BK_MYBK_CREATE_UTGST"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('utGST')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="cGST"
              name="cGST"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={LocalGST}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_CGST_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_CGST"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('cGST')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="GSTnumber"
              name="GSTnumber"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={GSTnumber}
              hintText={
                <Label
                  label="BK_MYBK_NAME_GSTNUMBER_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_GSTNUMBER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('GSTnumber')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-12">
            <TextField
              id="locality"
              name="locality"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={locality}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_SETCOR_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_SETCOR_PLACEHOLDER"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('locality')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>
          <div className="col-sm-6 col-xs-12">

            <TextField
              id="from-Date"
              name="from-Date"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={fromDate}
              required={true}
              disabled={true}
              hintText={
                <Label
                  label="BK_From_Date"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_From_Date"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('toDate')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />

          </div>
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="to-date"
              name="to-date"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={toDate}   
              // value={ConcatFirstToDate}
              required={true}
              disabled={true}
              hintText={
                <Label
                  label="BK_TO_DATE"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_TO_DATE"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('toDate')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>          
          {/*new requirement end*/}
          <div className="col-sm-6 col-xs-12">
            <TextField
              id="dimension"
              name="dimension"
              type="text"
              disabled = {checkDateVenueChange == true ? true : false}
              value={dimension}
              required={true}
              hintText={
                <Label
                  label="BK_MYBK_DIMENSION_PLACEHOLDER"
                  color="rgba(0, 0, 0, 0.3799999952316284)"
                  fontSize={16}
                  labelStyle={hintTextStyle}
                />
              }
              floatingLabelText={
                <Label
                  key={0}
                  label="BK_MYBK_CREATE_DIMENSION_AREA"
                  color="rgba(0,0,0,0.60)"
                  fontSize="12px"
                />
              }
              onChange={handleChange('dimension')}
              underlineStyle={{ bottom: 7 }}
              underlineFocusStyle={{ bottom: 7 }}
              hintStyle={{ width: "100%" }}
            />
          </div>

          <div className="col-sm-6 col-xs-12">
            <FormControl style={{ width: '100%' }}>
              <InputLabel shrink style={{ width: '100%' }} id="demo-controlled-open-select-label"><Label
                required={true}
                label="BK_MYBK_NORMAL_RESIDENTIAL"
              /></InputLabel>
              <Select
                maxWidth={false}
                required={true}
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                open={this.state.SetOpen}
                displayEmpty
                onClose={() => this.handleClose()}
                onOpen={() => this.handleOpen()}
                disabled = {checkDateVenueChange == true ? true : false}
                value={residenials}
                onChange={handleChange('residenials')}
              >
                <MenuItem value="" disabled>Normal/Commercial</MenuItem>
                <MenuItem value='Nomal'>Normal</MenuItem>
                <MenuItem value='Commercial'>Commercial</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Footer className="apply-wizard-footer" style={{ display: 'flex', justifyContent: 'flex-end' }} children={
            <div className="col-sm-12 col-xs-12 applyBtnWrapper" style={{ textAlign: 'right' }}>
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
                label={<Label buttonLabel={true} label="BK_CORE_COMMON_GONEXT" />}
                fullWidth={true}
                onClick={this.continue}
                startIcon={<ArrowForwardIosIcon />}
              />
            </div>
          }></Footer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  const { complaints, common, auth, form, bookings } = state;
  const { complaintSector } = complaints;
  const { facilationChargesSuccess, arrayName } = bookings;
  
  let SecTimeSlotFromTime = 
  state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
  (state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.bkFromTimeTwo: "notFound" ) : "notFound"

  let SecTimeSlotToTime = 
  state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
  (state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo: "notFound" ) : "notFound"


  let firstToTimeSlot = 
  state.screenConfiguration.preparedFinalObject.Booking !== undefined ?
  (state.screenConfiguration.preparedFinalObject.Booking.bkToTimeTwo !== undefined ? state.screenConfiguration.preparedFinalObject.Booking.bkToTime: "notFound" ) : "notFound"


  let strMid = ","

  


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
  return {
    complaintSector,SecTimeSlotFromTime,SecTimeSlotToTime,firstToTimeSlot,
    facilationChargesSuccess,
    fCharges
  }
}
const mapDispatchToProps = dispatch => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: criteria => dispatch(fetchApplicaionSector(criteria)),
    fetchfacilationCharges: () => dispatch(fetchfacilationCharges()),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookingsDetails);
