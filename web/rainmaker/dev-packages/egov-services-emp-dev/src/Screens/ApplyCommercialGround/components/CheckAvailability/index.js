import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { connect } from "react-redux";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Grid from "@material-ui/core/Grid";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Footer from "../../../../modules/footer";
import "./index.css";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { fetchApplicaionSector } from "egov-ui-kit/redux/bookings/actions";
import BookingMedia from "../BookingMedia";
import BookingCalendar from "../BookingCalendar"; //CommercialBookingCalendar
import CommercialBookingCalendar from "../CommercialBookingCalendar";
import { httpRequest } from "egov-ui-kit/utils/api";
import get from "lodash/get";
import set from "lodash/set";
import BookingTimeSlot from "../BookingTimeSlot";
import SelectedTimeSlotInfo from "../SelectedTimeSlotInfo";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { withStyles } from "@material-ui/core/styles";
import DayPicker, {
  DateUtils,
} from "../../../../contributed-modules/react-day-picker";

const styles = (theme) => ({
  cool: {
    "& .MuiFormControlLabel-label": {
      marginBottom: "0px",
    },
  },
  label: {
    marginBottom: "0px !important",
  },
});

class CheckAvailability extends Component {
  state = {
    NewbkBookingType: "Normal Booking",
    vanueType:
      this.props.oldBookingData != "notfound"
        ? this.props.oldBookingData.bkBookingType
        : "Parks",
    oldBookingData: "",
    SetForCommercial: false,
    SetForParkComm: true,
    open: false,
    setOpen: false,
    showCalendar: false,
    calendarAfterImg: false,
    locality:
      this.props.oldBookingData != "notfound"
        ? this.props.oldBookingData.Sector
        : "",
    masterDataPCC: [],
    SectorArrayCommercial: [],
    availabilityCheckData: {
      bkSector: this.props.oldBookingData
        ? this.props.oldBookingData.Sector
        : "",
      bkBookingType: this.props.oldBookingData
        ? this.props.oldBookingData.bkBookingType
        : "Parks",
    },
    OldAvailabilityCheckData: { bkBookingType: "Parks" },
    MediaState: {
      bkSector: this.props.oldBookingData
        ? this.props.oldBookingData.Sector
        : "",
      bkBookingType: this.props.oldBookingData
        ? this.props.oldBookingData.bkBookingType
        : "",
    },
  };

  handleClose = () => {
    this.setState({
      setOpen: false,
    });
  };

  handleOpen = () => {
    this.setState({
      setOpen: true,
    });
  };
  handleChange = async (event) => {
    let { userInfo, prepareFinalObject } = this.props;
    // this.setState({ vanueType: event.target.value },this.SetDataParkCom());
    this.setState(
      { vanueType: event.target.value },
      prepareFinalObject("DropDownValue", event.target.value)
    );

    if (this.state.vanueType != undefined) {
      if (this.state.vanueType == "Commercial Ground") {
        alert("Commercial Ground");
      } else if (
        this.state.vanueType === "Community Center" ||
        this.state.vanueType === "Parks"
      ) {
        alert("park & community");
      }
    }
    this.setState({
      availabilityCheckData: { bkBookingType: event.target.value },
    });
  };
newBookingType = async (event) => {
  let { prepareFinalObject } = this.props;
  this.setState(
    { NewbkBookingType: event.target.value }); 
    prepareFinalObject("NewbkBookingTypeNewReq", event.target.value)
};

  getBetweenDays = function (start, end) {
    let arr = [];
    // let endDate = new Date(end);
    for (
      let dt = new Date(start);
      dt <= new Date(end);
      dt.setDate(dt.getDate() + 1)
    ) {
      arr.push(new Date(dt));
    }
    return arr;
  };

  getSectorDataFromAPI = async (availabilityCheck) => {
    
    let venueType = availabilityCheck.bkBookingType;
    
    let sector = availabilityCheck.bkSector.toUpperCase();
    
    let { userInfo } = this.props;
    let requestbody = {
      venueType: venueType,
      tenantId: userInfo.tenantId,
      sector: sector,
    };
    
    let sectorDataFromMaster = await httpRequest(
      "bookings/park/community/master/_fetch?",
      "_search",
      [],
      requestbody
    );
    
    this.setState({ masterDataPCC: sectorDataFromMaster.data });
    
  };
  
  toGetOldImage = async (oldBookingData) => {
    
    let venueType = oldBookingData.bkBookingType;
    
    let sector = oldBookingData.Sector
      ? oldBookingData.Sector.toUpperCase()
      : "";
    
    let { userInfo } = this.props;
    let requestbody = {
      venueType: venueType,
      tenantId: userInfo.tenantId,
      sector: sector,
    };
    
    let sectorDataFromMaster = await httpRequest(
      "bookings/park/community/master/_fetch?",
      "_search",
      [],
      requestbody
    );
    
    this.setState({ masterDataPCC: sectorDataFromMaster.data });
    
  };

  //for parkCommunity and date/venue change Sector handling
  sectorHandleChange = (input) => (e) => {
    this.setState({ masterDataPCC: [] });
    let availabilityCheck = {
      bkSector: e.target.value,
      bkBookingType: this.state.vanueType,
    };

    this.setState({ availabilityCheckData: availabilityCheck });
    this.getSectorDataFromAPI(availabilityCheck);

    this.setState({ [input]: e.target.value });
  };

  //for commercial sector handling
  sectorHandleForCommercial = async (e) => {
    const { prepareFinalObject } = this.props;
    this.setState({ masterDataPCC: [] });
    let requestBody = {
      bookingType: "GROUND_FOR_COMMERCIAL_PURPOSE",
      bookingVenue: e.target.value,
    };
    let availabilityData = await httpRequest(
      "bookings/commercial/ground/availability/_search",
      "",
      [],
      requestBody
    );
    let data = availabilityData.data;
    
    let reservedDates = [];
    var daylist = [];
    data.map((dataitem) => {
      let start = dataitem.fromDate;
      let end = dataitem.toDate;
      daylist = this.getBetweenDays(start, end);
      daylist.map((v) => {
        reservedDates.push(v.toISOString().slice(0, 10));
      });
    });
    prepareFinalObject("availabilityCheckData.reservedDays", reservedDates);
    prepareFinalObject(
      "availabilityCheckData.reservedDaysforCommercial",
      reservedDates
    );
    prepareFinalObject(
      "availabilityCheckData.reservedDaysforCommercialTwo",
      reservedDates
    );

    let availabilityCheck = {
      bkSector: e.target.value,
      bkBookingType: this.state.vanueType,
    };

    this.setState({ availabilityCheckData: availabilityCheck });
    this.getSectorDataFromAPI(availabilityCheck);

    this.setState({ locality: e.target.value },
      prepareFinalObject(
        "CommercialEmpBooking.BookingVenue",e.target.value
      )
      );
  };

  componentDidMount = async () => {
    let {
      fetchApplicaionSector,
      oldBookingData,
      prepareFinalObject,
      userInfo,
    } = this.props;
    let PreBookingData = {
      bkSector: oldBookingData.Sector,
      bkBookingType: oldBookingData.bkBookingType,
    };
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: userInfo.tenantId,
        moduleDetails: [
          {
            moduleName: "tenant",
            masterDetails: [
              {
                name: "tenants",
              },
            ],
          },
          {
            moduleName: "Booking",
            masterDetails: [
              {
                name: "Booking_Vanue",
              },
            ],
          },
        ],
      },
    };
    try {
      let payload = null;
      payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
     
      let MdmsResBookingSector = payload.MdmsRes.Booking.Booking_Vanue;
      let CommercialSector = [];
     
      MdmsResBookingSector.forEach((event) => {
     
        CommercialSector.push(event);
     
      });
      this.setState({
        SectorArrayCommercial: CommercialSector,
      });
    } catch (e) {
      console.log(e);
    }
    //commercial
    fetchApplicaionSector();
    this.setState({
      oldBookingData,
    });
    if (oldBookingData != "notfound") {
      
      this.toGetOldImage(oldBookingData);
      
      let requestBody = {
        tenantId: "ch.chandigarh",
        bookingType: oldBookingData.bkBookingType,
        bookingVenue: oldBookingData.bkBookingVenueID,
        sector: oldBookingData.Sector,
      };
      let availabilityData = await httpRequest(
        "/bookings/park/community/availability/_search",
        "_search",
        [],
        requestBody
      );
      let data = availabilityData.data;
      let reservedDates = [];
      var daylist = [];
      data.map((dataitem) => {
        let start = dataitem.fromDate;
        let end = dataitem.toDate;
        daylist = this.getBetweenDays(start, end);
        daylist.map((v) => {
          reservedDates.push(v.toISOString().slice(0, 10));
        });
      });

      prepareFinalObject("availabilityCheckData.reservedDays", reservedDates);

      prepareFinalObject("availabilityCheckData.reservedTimeSlotsData", data);

      this.setState({
        // locality : oldBookingData.Sector,
        // vanueType : oldBookingData.bkBookingType,
        OldAvailabilityCheckData: PreBookingData,
        showCalendar: true,
        // oldAvailabilityCheckData :oldBookingData.Sector
      });

      let requestbody = {
        venueType: oldBookingData.bkBookingType,
        tenantId: userInfo.tenantId,
        sector: oldBookingData.Sector,
      };
      
      let sectorDataFromMaster = await httpRequest(
        "bookings/park/community/master/_fetch?",
        "_search",
        [],
        requestbody
      );
      
      this.setState({ masterDataPCC: sectorDataFromMaster.data });
      
    }
  };

  callBackForResetCalender = () => {
    const { prepareFinalObject } = this.props;

    this.props.prepareFinalObject("availabilityCheckData.bkFromDate", null);

    this.props.prepareFinalObject("availabilityCheckData.bkToDate", null);
  };

 calculateBetweenDaysCount = (startDate, endDate) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(startDate);
    const secondDate = new Date(endDate);

    const daysCount =
        Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
    return daysCount;
};


  continue = (e) => {
    const {NewBookFromDate , AppStatus, NewBookToDate, toggleSnackbarAndSetText,oldToDate,oldFromDate,AgainNewFromDate,AgainNewToDate,PrevFromDate,PrevToDate,
      oldBookingData,bookingVenue,prepareFinalObject} = this.props

    let d1,d2,PrevBookdaysCount,newBookdaysCount,d1NewFromDate,d2NewToDate,AgainNewd1,AgainNewd2,forOldMasterData,checkType


if(AppStatus === "OFFLINE_APPLIED" || AppStatus != "notFound"){

  d1 = new Date(PrevFromDate)
  d2 = new Date(PrevToDate)

  PrevBookdaysCount = this.calculateBetweenDaysCount(PrevFromDate,PrevToDate)  //Set number of days from previous date


  if(NewBookFromDate != "notFound" && NewBookToDate !="notFound"){   //set Number Of Days from new date
    d1NewFromDate = new Date(NewBookFromDate)
    d2NewToDate = new Date(NewBookToDate)
    newBookdaysCount =  this.calculateBetweenDaysCount(NewBookFromDate,NewBookToDate)
   
  }

 if(AgainNewFromDate != "notFound" && AgainNewToDate != "notFound"){
  AgainNewd1 = new Date(AgainNewFromDate)
  AgainNewd2 = new Date(AgainNewToDate)
 }

if(oldBookingData.bkBookingVenue){  

PrevBookdaysCount = this.calculateBetweenDaysCount(PrevFromDate,PrevToDate)



 if(bookingVenue === "NotFound"){  /**first Condition**Not Selected Venue means Venue remain same but here date Change**/

  if(d1 == AgainNewd1 && d2 == AgainNewd2){

    toggleSnackbarAndSetText(
      true,
      {
        labelName: "Please Change Date Or Venue",
        labelKey: `Please Change Date Or Venue`
      },
      "error"
    );
  }
 if(NewBookFromDate === "notFound" && NewBookToDate ==="notFound"){
    
    toggleSnackbarAndSetText(
      true,
      {
        labelName: "Please Change Date Or Venue",
        labelKey: `Please Change Date Or Venue`
      },
      "error"
    );
  }
if(NewBookFromDate != "notFound" && NewBookToDate != "notFound"){
  newBookdaysCount =  this.calculateBetweenDaysCount(NewBookFromDate,NewBookToDate)
  
  if(newBookdaysCount != PrevBookdaysCount){
  
    toggleSnackbarAndSetText(
      true,
      {
        labelName: "You Can Only Change Dates Not Number Of Days",
        labelKey: `You Can Only Change Dates Not Number Of Days`
      },
      "error"
    );
  }
  else{
    forOldMasterData=this.state.masterDataPCC,
    
    checkType = typeof(forOldMasterData)
    
    var result = forOldMasterData.filter((x) => { return x.name == oldBookingData.Sector });
    
    prepareFinalObject(
      "bkBookingData",
      result
  );
    
    this.props.history.push(`/egov-services/applyPark-community-center`);
  }
}  
}

  if(oldBookingData.bkBookingVenue === bookingVenue){ /**Second condition*** Venue Same but date change in this condition**/
    
    if((NewBookFromDate === "notFound" && NewBookToDate ==="notFound") || (d1 == AgainNewd1 && d2 == AgainNewd2)){
    
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please Change Date Or Venue",
          labelKey: `Please Change Date Or Venue`
        },
        "error"
      );
    }
    else if ((AgainNewd1 != "notFound" && AgainNewd2 != "notFound") || ((d1 != AgainNewd1 && d2 != AgainNewd2))) {
 
  newBookdaysCount =  this.calculateBetweenDaysCount(NewBookFromDate,NewBookToDate)
 
  if(newBookdaysCount != PrevBookdaysCount){
 
    toggleSnackbarAndSetText(
      true,
      {
        labelName: "You Can Only Change Dates Not Number Of Days",
        labelKey: `You Can Only Change Dates Not Number Of Days`
      },
      "error"
    );
  }
  else{
    
    this.props.history.push(`/egov-services/applyPark-community-center`);
  }
  }
  }
  if(bookingVenue != "NotFound" && oldBookingData.bkBookingVenue != bookingVenue){   /**Third Condition**Change Venue but date remain same in this Condition**/
  
  if((NewBookFromDate === "notFound" && NewBookToDate ==="notFound") || (d1 == AgainNewd1 && d2 == AgainNewd2)){
  
    this.props.history.push(`/egov-services/applyPark-community-center`);
    prepareFinalObject("availabilityCheckData.bkFromDate", d1);
    prepareFinalObject("availabilityCheckData.bkToDate", d2);
  }
  else{
  
    toggleSnackbarAndSetText(
      true,
      {
        labelName: "You Can Only Change Either Date Or Venue",
        labelKey: `You Can Only Change Either Date Or Venue`
      },
      "error"
    );
  }
 }
 }
} /**If Condition "END" for Date/Venue Change**/
else{  /**loop for new Booking Create**/
  if(NewBookFromDate && NewBookToDate === "notFound"){   /** Condition for New Booking Book To Check BothDates**/
    toggleSnackbarAndSetText(
      true,
      {
        labelName: "Please Select To Date Before Proceed Further",
        labelKey: `Please Select To Date Before Proceed Further`
      },
      "error"
    );
  }
  if(NewBookFromDate && NewBookToDate){   /** Condition for New Booking Book For No of Days Check**/
  let daysCount = this.calculateBetweenDaysCount(NewBookFromDate,NewBookToDate)
  if(daysCount > 2){
    toggleSnackbarAndSetText(
      true,
      {
        labelName: "You can not book venue for more than 2 days",
        labelKey: `You can not book venue for more than 2 days`
      },
      "error"
    );
   } 
   else{
    this.props.history.push(`/egov-services/applyPark-community-center`);
   }
  }
}        
};

  render() {
    const {
      firstName,
      email,
      mobileNo,
      lastName,
      stateData,
      handleChange,
      sImageUrl,
      applicationSector,
      complaintSector,
      bkVenue,
      oldFromDate,
      oldToDate,
      classes,
      oldBookingData,
      DropDownValue,
    } = this.props;
   
   
    let sectorData = [];
    let vanueData = this.props.stateData.screenConfiguration.preparedFinalObject
      .bkBookingData;
    sectorData.push(applicationSector);

    let arrayData = [];
    let y = sectorData.forEach((item, index) => {
      if (item) {
        let finalValues = Object.values(item);
        finalValues.forEach((event) => {
          arrayData.push(event);
        });
      }
    });
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden",
    };
    const radioformControl = {
      marginBottom: "0px",
    };

    const stylr = {};

    const changeCalendar = () => {
      this.setState(
        {
          showCalendar: true,
        },
      );
    };
    const handleCalAfterImage = () => {
      this.setState({ calendarAfterImg: true });
    };

    return (
      <div>
        <div style={{ float: "left", width: "100%", padding: "36px 15px" }}>
          <div
            className="col-xs-12"
            style={{ background: "#fff", padding: "15px 0" }}
          >
            <div>
              <div style={{ paddingBottom: "5px", marginLeft: "15px" }}>
                <Label
                  label="BK_MYBK_CHECK_AVAILABILITY"
                  labelClassName="dark-heading"
                />
              </div>
              <div className="col-sm-6 col-xs-6">
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Label label="BK_MYBK_BOOKING_TYPE" />
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="gender1"
                    value={this.state.vanueType}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel
                      value="Community Center"
                      control={<Radio color="primary" />}
                      label="Community Center"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Parks"
                      control={<Radio color="primary" />}
                      label="Park"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Commercial Ground"
                      control={<Radio color="primary" />}
                      label="Commercial Ground"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            {/*New Requirement Changes*/}
            {this.state.vanueType === "Community Center" || this.state.vanueType === "Parks"? (
            <div>
              <div className="col-sm-6 col-xs-6">
                <FormControl component="fieldset">
                  <FormLabel component="legend">
                    <Label label="BK_MYBK_TYPES_OF_BOOKING" />
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-label="position"
                    name="gender1"
                    value={this.state.NewbkBookingType}
                    onChange={this.newBookingType}
                  >
                    <FormControlLabel
                      value="Normal Booking"
                      control={<Radio color="primary" />}
                      label="Normal Booking"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="Commercial Booking"
                      control={<Radio color="primary" />}
                      label="Commercial Booking"
                      classes={classes.label}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>) : ""}

            {/*condition rendering for Dropdown according to Booking Type*/}
            {this.props.DropDownValue != "notfound" &&
            this.props.DropDownValue === "Commercial Ground" ? (
              <div>
                <div className="col-sm-6 col-xs-6">
                  {" "}
                  {/*for commercial selection*/}
                
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel
                      shrink
                      style={{ width: "100%" }}
                      id="demo-controlled-open-select-label"
                    >
                      <Label label="Booking Venue" />
                    </InputLabel>
                    <Select
                      maxWidth={false}
                      labelId="demo-controlled-open-select-label-Locality"
                      id="demo-controlled-open-select-locality"
                      open={this.state.SetOpen}
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                      value={this.state.locality}
                      displayEmpty
                      onChange={(e) => {
                        this.sectorHandleForCommercial(e);
                      }}
                    >
                      <MenuItem value="" disabled>
                        Booking Venue
                      </MenuItem>
                      {this.state.SectorArrayCommercial.map((child, index) => (
                        <MenuItem value={child.code}>{child.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            ) : (
              <div>
               
                <div className="col-sm-6 col-xs-6">
                  {" "}
                  {/*for park & community*/}
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel
                      shrink
                      style={{ width: "100%" }}
                      id="demo-controlled-open-select-label"
                    >
                      <Label label="Locality" />
                    </InputLabel>
                    <Select
                      maxWidth={false}
                      labelId="demo-controlled-open-select-label-Locality"
                      id="demo-controlled-open-select-locality"
                      open={this.state.SetOpen}
                      onClose={() => this.handleClose()}
                      onOpen={() => this.handleOpen()}
                      value={this.state.locality}
                      displayEmpty
                      onChange={this.sectorHandleChange("locality")}
                    >
                      <MenuItem value="" disabled>
                        Locality
                      </MenuItem>
                      {arrayData.map((child, index) => (
                        <MenuItem value={child.code}>{child.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            )}

            {/* sector drop down for date/venue change */}
            {this.state.oldBookingData &&
            this.state.oldBookingData != "notfound" ? (
              <div>
              
                <div className="col-sm-6 col-xs-6">
                  <div className="col-sm-6 col-xs-6">
                    <FormControl style={{ width: "100%" }}>
                      <InputLabel
                        shrink
                        style={{ width: "100%" }}
                        id="demo-controlled-open-select-label"
                      >
                        <Label label="Locality" />
                      </InputLabel>
                      <Select
                        maxWidth={false}
                        labelId="demo-controlled-open-select-label-Locality"
                        id="demo-controlled-open-select-locality"
                        open={this.state.SetOpen}
                        onClose={() => this.handleClose()}
                        onOpen={() => this.handleOpen()}
                        value={this.state.locality}
                        // displayEmpty
                        onChange={this.sectorHandleChange("locality")}
                      >
                        <MenuItem value="" disabled>
                          Locality
                        </MenuItem>
                        {arrayData.map((child, index) => (
                          <MenuItem value={child.code}>{child.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {/*Import Booking Media for Commercial*/}
            {this.state.vanueType === "Commercial Ground" &&
            this.state.locality ? (
              <CommercialBookingCalendar
                witholDdATA={"withCommercialData"}
                masterDataPCC={this.state.masterDataPCC}
                availabilityCheckData={this.state.availabilityCheckData}
                bookingVenue={this.props && this.props.bookingVenue}
                oldBookingData={this.state.oldBookingData}
                locality={this.state.locality && this.state.locality}
              />
            ) : (
              ""
            )}

            {/*for old availbility check Import Image*/}
            {this.state.availabilityCheckData &&
            this.state.availabilityCheckData.bkSector ? (
              <BookingMedia
                changeCalendar={changeCalendar}
                handleCalAfterImage={handleCalAfterImage}
                one={"withBookingMediaNew"}
                masterDataPCC={this.state.masterDataPCC}
                availabilityCheckData={this.state.availabilityCheckData}
                pacc_image_initial_path={sImageUrl && sImageUrl[0].Value}
              />
            ) : (
              <BookingMedia
                changeCalendar={changeCalendar}
                handleCalAfterImage={handleCalAfterImage}
                one={"withBookingMediaOld"}
                masterDataPCC={this.state.masterDataPCC}
                availabilityCheckData={this.state.availabilityCheckData}
                pacc_image_initial_path={sImageUrl && sImageUrl[0].Value}
              />
            )}

            {/*for old availbility check  import timeSlot Selected One*/}
            {this.state.oldBookingData &&
            this.state.oldBookingData.bkBookingType == "Community Center" &&
            this.state.availabilityCheckData.bkBookingType ==
              "Community Center" &&
            this.props.bookingVenue == "NotFound" ? (
              <BookingTimeSlot
                masterDataPCC={this.state.masterDataPCC}
                availabilityCheckData={this.state.availabilityCheckData}
                oldAvailabilityCheckData={
                  this.state.oldBookingData && this.state.oldBookingData
                }
              />
            ) : (
              ""
            )}

            {/*for old availbility check  import Selected timeSlot To show On UI*/}
            {this.state.oldBookingData &&
            this.state.oldBookingData.bkBookingType == "Community Center" &&
            this.state.availabilityCheckData.bkBookingType ==
              "Community Center" &&
            this.props.bookingVenue == "NotFound" ? (
              <SelectedTimeSlotInfo
                masterDataPCC={this.state.masterDataPCC}
                availabilityCheckData={this.state.availabilityCheckData}
                oldAvailabilityCheckData={
                  this.state.oldBookingData && this.state.oldBookingData
                }
                bookingVenue={
                  this.state.oldBookingData.bkBookingVenue
                    ? this.state.oldBookingData.bkBookingVenue
                    : this.props && this.props.bookingVenue
                }
                oldFromDate={oldFromDate}
                oldToDate={oldToDate}
              />
            ) : (
              ""
            )}

            {this.state.oldBookingData &&
              this.state.oldBookingData.bkBookingVenue !=
                "HALL FOR 4 HOURS AT COMMUNITY CENTRE SECTOR 39 CHANDIGARH" &&
              !vanueData &&
              this.state.showCalendar &&
              this.state.calendarAfterImg && (
                <BookingCalendar
                  witholDdATA={"witholDdATA"}
                  masterDataPCC={this.state.masterDataPCC}
                  availabilityCheckData={this.state.availabilityCheckData}
                  oldAvailabilityCheckData={
                    this.state.oldBookingData && this.state.oldBookingData
                  }
                  bookingVenue={
                    this.state.oldBookingData.bkBookingVenue
                      ? this.state.oldBookingData.bkBookingVenue
                      : this.props && this.props.bookingVenue
                  }
                  oldFromDate={oldFromDate}
                  oldToDate={oldToDate}
                />
              )}

            {this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkBookingType ==
                "Community Center" &&
              vanueData &&
              vanueData.bookingAllowedFor != "" && (
                <BookingTimeSlot
                  masterDataPCC={this.state.masterDataPCC}
                  availabilityCheckData={this.state.availabilityCheckData}
                  oldFromDate
                  oldToDate
                />
              )}
            {this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkBookingType ==
                "Community Center" &&
              vanueData &&
              vanueData.bookingAllowedFor != "" && (
                <SelectedTimeSlotInfo
                  masterDataPCC={this.state.masterDataPCC}
                  availabilityCheckData={this.state.availabilityCheckData}
                />
              )}

            {this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkSector &&
              vanueData != undefined &&
              vanueData.bookingAllowedFor == "" &&
              this.state.showCalendar &&
              this.state.calendarAfterImg && (
                <BookingCalendar
                  witholDdATA={"withNewData"}
                  masterDataPCC={this.state.masterDataPCC}
                  availabilityCheckData={this.state.availabilityCheckData}
                  bookingVenue={this.props && this.props.bookingVenue}
                  oldBookingData={this.state.oldBookingData}
                />
              )}

            {/*Button Code For Submit And Reset*/}

            {/*start of book button for commercil*/}
            {this.state.vanueType === "Commercial Ground" &&
              this.state.locality && (
                <div
                  className="col-sm-12 col-xs-12"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label
                        buttonLabel={true}
                        label="BK_MYBK_EMP_RESET_BUTTON"
                      />
                    }
                    fullWidth={true}
                    onClick={this.callBackForResetCalender}
                    style={{ marginRight: 18 }}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label buttonLabel={true} label="BK_PARKCC_COMMON_BOOK" />
                    }
                    fullWidth={true}
                    onClick={this.continue}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                </div>
              )}
            {/*end of book button for commercil*/}

            {this.state.availabilityCheckData &&
              this.state.availabilityCheckData.bkSector &&
              vanueData != undefined && (
                <div
                  className="col-sm-12 col-xs-12"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label
                        buttonLabel={true}
                        label="BK_MYBK_EMP_RESET_BUTTON"
                      />
                    }
                    fullWidth={true}
                    onClick={this.callBackForResetCalender}
                    style={{ marginRight: 18 }}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label buttonLabel={true} label="BK_PARKCC_COMMON_BOOK" />
                    }
                    fullWidth={true}
                    onClick={this.continue}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                </div>
              )}
            {this.state.oldBookingData &&
              this.state.oldBookingData.Sector != undefined && (
                <div
                  className="col-sm-12 col-xs-12"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label
                        buttonLabel={true}
                        label="BK_MYBK_EMP_RESET_BUTTON"
                      />
                    }
                    fullWidth={true}
                    onClick={this.callBackForResetCalender}
                    style={{ marginRight: 18 }}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                  <Button
                    className="responsive-action-button"
                    primary={true}
                    label={
                      <Label buttonLabel={true} label="BK_PARKCC_COMMON_BOOK" />
                    }
                    fullWidth={true}
                    onClick={this.continue}
                    startIcon={<ArrowForwardIosIcon />}
                  />
                </div>
              )}
            {/*</Footer>*/}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { bookings, common, auth, form } = state;
  let stateData = state;
  const { complaintSector, sImageUrl, applicationSector } = bookings;
  var bookingVenueData =
    state &&
    state.screenConfiguration.preparedFinalObject.availabilityCheckData;  //bkLocation
  
  let bookingVenue =
    bookingVenueData && bookingVenueData.bkLocation
      ? bookingVenueData.bkLocation
      : "NotFound";
  
  const { userInfo } = state.auth;
  let bkVenue = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        .bkBookingVenue
    : "notfound";
  

  let oldFromDate = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        .bkFromDate
    : "notfound";
  

  let oldToDate = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        .bkToDate
    : "notfound";
  

  let oldBookingData = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
    : "notfound";
  

  let DropDownValue = state.screenConfiguration.preparedFinalObject
    .DropDownValue
    ? state.screenConfiguration.preparedFinalObject.DropDownValue
    : "notfound";

  let NewBookFromDate = state.screenConfiguration.preparedFinalObject.availabilityCheckData && state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkFromDate || "notFound"
  

  let NewBookToDate = state.screenConfiguration.preparedFinalObject.availabilityCheckData && state.screenConfiguration.preparedFinalObject.availabilityCheckData.bkToDate || "notFound"
  

  let AppStatus = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.ApplicationStatus || "notFound"
  

  let AgainNewFromDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.NewBookingFromDate || "notFound"
  

  let AgainNewToDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.NewBookingToDate || "notFound"
  

   let PrevFromDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.FromDate || "notFound"
   

   let PrevToDate = state.screenConfiguration.preparedFinalObject.PreviousBookingData && state.screenConfiguration.preparedFinalObject.PreviousBookingData.ToDate || "notFound"
   
  return {
    userInfo,NewBookFromDate,NewBookToDate,AppStatus,AgainNewFromDate,AgainNewFromDate,PrevFromDate,PrevToDate,
    DropDownValue,
    complaintSector,
    bookingVenue,
    stateData,
    sImageUrl,
    applicationSector,
    bkVenue,
    oldFromDate,
    oldToDate,
    oldBookingData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    fetchApplicaionSector: () => dispatch(fetchApplicaionSector()),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CheckAvailability));
