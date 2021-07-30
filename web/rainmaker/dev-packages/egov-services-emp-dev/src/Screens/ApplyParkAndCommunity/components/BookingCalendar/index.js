import React from "react";
import DayPicker, {
  DateUtils,
} from "../../../../contributed-modules/react-day-picker";
import {
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { connect } from "react-redux";
import "../../../../contributed-modules/react-day-picker/lib/style.css";
import "./index.css";
import get from "lodash/get";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

class BookingCalendar extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = this.getInitialState();
    this.state = {
      filterfromDate: "",
      filtertoDate: "",
      dselectedDays: [],
      CheckFromDateExist: false,
      newFrom: "",
      newTo: "",
      CheckBothDataExist: false,
    };
  }
//availabilityCheckData.bkFromDate    
  componentDidMount() {
   
    const {
      availabilityCheckData,
      oldToDate,
      oldAvailabilityCheckData,
      oldFromDate,oldBookingData,
      witholDdATA,
    } = this.props;
   
   
    if (
      (oldAvailabilityCheckData &&
        oldAvailabilityCheckData.FromDate != undefined) ||
      (oldBookingData &&
        oldBookingData != "notfound" &&
        oldBookingData.bkFromDate != undefined)
    ) {
      this.setState(
        {
          from: new Date(oldFromDate),
          to: new Date(oldToDate),
          enteredTo: new Date(oldToDate),
        }
      );
    }

    if (availabilityCheckData && availabilityCheckData.reservedDays) {
      
      let pushReservedDay = [];
      availabilityCheckData.reservedDays.length > 0 &&
        availabilityCheckData.reservedDays.map((el) => {
          pushReservedDay.push(new Date(el));
        });
      

      if (availabilityCheckData.bkFromDate) {
        this.setState(
          {
            dselectedDays: pushReservedDay,
            from: new Date(availabilityCheckData.bkFromDate),
            to: new Date(availabilityCheckData.bkToDate),
            enteredTo: new Date(availabilityCheckData.bkToDate),
          },
      
        );
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.availabilityCheckData === undefined ||
      nextProps.availabilityCheckData.length === 0
    ) {
      
      this.setState({
        dselectedDays: [],
        from: null,
        to: null,
        enteredTo: null,
      });
    }
    else {
      if (
        nextProps.availabilityCheckData.bkFromDate === null &&
        nextProps.availabilityCheckData.bkToDate === null
      ) {
     
        this.setState({
          from: null,
          to: null,
          enteredTo: null,
        });
      }
      if ("reservedDays" in nextProps.availabilityCheckData) {
        let pushReservedDay = [];
        nextProps.availabilityCheckData.reservedDays.length > 0 &&
          nextProps.availabilityCheckData.reservedDays.map((el) => {
            pushReservedDay.push(new Date(el));
          });
        let previousDates = this.getPreviousTodayDates();
        previousDates.map((val) => {
          pushReservedDay.push(val);
        });
     
        this.setState({
          dselectedDays: pushReservedDay,
        });
      }

      if ("bkApplicationNumber" in nextProps.availabilityCheckData) {
        if (
          nextProps.availabilityCheckData.bkFromDate !== null &&
          nextProps.availabilityCheckData.bkToDate !== null
        ) {
         
          this.setState(
            {
              from: new Date(nextProps.availabilityCheckData.bkFromDate),
              to: new Date(nextProps.availabilityCheckData.bkToDate),
              enteredTo: new Date(nextProps.availabilityCheckData.bkToDate),
            },
           
          );
        } else if (
          nextProps.availabilityCheckData.bkFromDate !== null &&
          nextProps.availabilityCheckData.bkToDate === null
        ) {
        
          this.setState(
            {
              from: new Date(nextProps.availabilityCheckData.bkFromDate),
              to: null,
              enteredTo: null,
            },
          
          );
        } else {
          this.setState(this.getInitialState());
        }
      }
    }
  }

  getInitialState() {
    return {
      from: null,
      to: null,
      enteredTo: null,
    };
  }

  isSelectingFirstDay(from, to, day) {
    const { oldAvailabilityCheckData } = this.props;
    if (oldAvailabilityCheckData) {
     
      if (from && to) {
     
        return true;
      } else if (from == null && to == null) {
     
        return true;
      } else if (to && from == null) {
     
        return true;
      } else {
     
        return false;
      }
    } else {
     
      const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
     
      const isRangeSelected = from && to; //
      
      let funRet = !from || isBeforeFirstDay || isRangeSelected;
      
      if (funRet) {
      
        this.setState({
          CheckFromDateExist: true,
        });
      }
      if (!funRet) {
      
        this.setState({
          CheckFromDateExist: false,
        });
      }
      return funRet;
    }
  }

  handleDayClick = (day, modifiers = {}) => {
    
    
    const { oldAvailabilityCheckData } = this.props;
    const { from, to } = this.state;
    for(let i = 0 ; i< this.props.bookedSlotDateArray.length; i++)
    {
        let d= `${new Date(day).getDate()}-${new Date(day).getMonth()}-${new Date(day).getFullYear()}`
     
        let ad= `${new Date(this.props.bookedSlotDateArray[i]).getDate()}-${new Date(this.props.bookedSlotDateArray[i]).getMonth()}-${new Date(this.props.bookedSlotDateArray[i]).getFullYear()}`

        if(d==ad){
            this.handleResetClick();
            // this.props.showError4();
            this.props.toggleSnackbarAndSetText(
              true,
              {
                labelName: "Green dates are only available for three hours slot booking!",
                labelKey: "Green dates are only available for three hours slot booking!",
              },
              "warning"
            );


            return;
        }
    }


    if (from && to && day >= from && day <= to) {
     
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
     
      if (day >= new Date()) {
     
     
        this.props.prepareFinalObject("availabilityCheckData.bkFromDate", day);
        this.props.prepareFinalObject("PreviousBookingData.NewBookingFromDate", day);
        this.props.prepareFinalObject(
     
          "oldAvailabilityCheckData.bkToDate",
          null
        );
        this.setState({
          from: day,
          to: null,
          enteredTo: null,
        });
      } else {
        this.handleResetClick();
       
      }
    } else {
      this.setState({
        to: day,
        enteredTo: day,
      });
      this.props.prepareFinalObject("availabilityCheckData.bkToDate", day);
      this.props.prepareFinalObject("PreviousBookingData.NewBookingToDate", day);
      
      this.checkRangeValidity();
    }
  };

  handleDayMouseEnter = (day) => {
    
    const { from, to } = this.state;
    const { oldAvailabilityCheckData } = this.props;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
      
    }
  };

  handleResetClick = () => {
    this.setState(this.getInitialState());
    this.props.prepareFinalObject("availabilityCheckData.bkToDate", null);
    this.props.prepareFinalObject("availabilityCheckData.bkFromDate", null);
  };

  checkRangeValidity() {
    let Range = {
      from: this.state.from,
      to: this.state.enteredTo,
    };
    for (let i = 0; i < this.state.dselectedDays.length; i++) {
      let bookedDate = this.state.dselectedDays[i];

      if (DateUtils.isDayInRange(bookedDate, Range)) {
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "Selected range should not contain reserved date",
            labelKey: `Selected range should not contain reserved date`,
          },
          "warning"
        );
        this.handleResetClick();
      } else {
        //  this.props.showBookButton()
      }
    }
  }

  getPreviousTodayDates() {
    let date = new Date();
    var d = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    var defaultDisabledDate = [];
    while (d > 1) {
      d = d - 1;
      let nd = new Date(y, m, d);

      defaultDisabledDate.push(nd);
    }
    return defaultDisabledDate;
  }

  render() {
    const { ChangeFromDate, ChangeToDate, resetDate } = this.props;
 

    let { from, to, enteredTo } = this.state;
 
    if (resetDate && ChangeFromDate && ChangeToDate) {
      from = ChangeFromDate;
      to = ChangeToDate;
    }
    const modifiers = { start: from, end: enteredTo,timeSlotBookedDates : this.props.bookedSlotDateArray };
 
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];
 
    const WEEK_DAY_LONG = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const DATAE = this.getPreviousTodayDates();
    const past = {
      value: DATAE.map((val) => {
        return new Date(val);
      }),
    };
    let data = new Date();
    let newData = new Date(data.setMonth(data.getMonth() + 5));
    return (
      <div>
      <div className="calendar-wrapper">
        <div className="calendar-section">
         
          <DayPicker
            className="Selectable"
            numberOfMonths={2}
            initialMonth={new Date()}
            disabledDays={this.state.dselectedDays}
            fromMonth={new Date()}
            toMonth={newData}
            modifiers={modifiers}
            weekdaysShort={WEEK_DAY_LONG}
            selectedDays={selectedDays}
            onDayClick={this.handleDayClick}
            onDayMouseEnter={this.handleDayMouseEnter}
          />
        </div>
        <div className="calendar-info">
          {/* <h2 className="calendar-info-title">
                        Select From &amp; To Date in Calendar{" "}
                    </h2> */}
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                display: "block",
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "1.375em",
              }}
            >
              Booking Venue
            </span>
            <span
              // bkVenue,oldFromDate,oldToDate 

              style={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "19px",
                letterSpacing: "0.67px",
              }}
            >
              {" "}
              {this.props.bookingVenue === ""
                ? "------------"
                : this.props.bookingVenue}
            </span>
          </div>

          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                display: "block",
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "1.375em",
              }}
            >
              From Date
            </span>
            <span
              style={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "19px",
                letterSpacing: "0.67px",
              }}
            >
              {!from ? "--/--/----" : from.toLocaleDateString()}
            </span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                display: "block",
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: 12,
                fontWeight: 400,
                lineHeight: "1.375em",
              }}
            >
              To Date
            </span>
            <span
              style={{
                color: "rgba(0, 0, 0, 0.87)",
                fontSize: 16,
                fontWeight: 400,
                lineHeight: "19px",
                letterSpacing: "0.67px",
              }}
            >
              {!to ? "--/--/----" : to.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div> 
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
    changeRoute: (path) => dispatch(setRoute(path)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    showError: () =>
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Selected range should not contain reserved date",
            labelKey: "",
          },
          "warning"
        )
      ),
    showError2: () =>
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "First Check Availability By Filling Above Form",
            labelKey: "",
          },
          "warning"
        )
      ),
    showError3: () =>
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please select date greater then today",
            labelKey: "",
          },
          "warning"
        )
      ),
      showError4: () =>
      dispatch(
          toggleSnackbar(
              true,
              {
                  labelName: "Green dates are only available for three hours slot booking!",
                  labelKey: "",
              },
              "warning"
          )
      ),
  };
};
const mapStateToProps = (state, ownProps) => {
  let resetDate = state.screenConfiguration.preparedFinalObject
    ? state.screenConfiguration.preparedFinalObject.availabilityCheckData
    : "";
  
  //oldAvailabilityCheckData.bkBookingVenue

  let bkVenue = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        .bkBookingVenue
    : "notfound";
  

  let oldFromDate = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        .FromDate
    : "notfound";
  

  let oldToDate = state.screenConfiguration.preparedFinalObject
    .oldAvailabilityCheckData
    ? state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        .bkToDate
    : "notfound";
  

  let ChangeFromDate = resetDate ? resetDate.bkFromDate : "";
  let ChangeToDate = resetDate ? resetDate.bkToDate : "";
  let availabilityCheckData = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData",
    []
  );

  const reservedTimeSlotsData = get(
    state,
    "screenConfiguration.preparedFinalObject.availabilityCheckData.reservedTimeSlotsData"
);

let timeSlotArray = [];
let bookedSlotArray = [];
var date = new Date();
if (reservedTimeSlotsData && reservedTimeSlotsData.length > 0) {
    for (let i = 0; i < reservedTimeSlotsData.length; i++) {
        const [year, month, day] = reservedTimeSlotsData[i].fromDate.split(
            "-"
        );
        let date = `${year}-${month}-${day}`;
        
        if (
            reservedTimeSlotsData[i].timeslots &&
            reservedTimeSlotsData[i].timeslots.length > 0 && reservedTimeSlotsData[i].timeslots.length < 3
        ) {
            
            for (
                let j = 0;
                j < reservedTimeSlotsData[i].timeslots.length;
                j++
            ) {
                bookedSlotArray.push({
                    date: date,
                    timeSlots: [reservedTimeSlotsData[i].timeslots[j].slot],
                }
                );
            }
        }
    }
}    
let newBookedSlotArray= []
let newBookedSlotObject= []
bookedSlotArray.map(d=>{
    if(newBookedSlotArray.includes(d.date)){
        
        for (let i=0 ; i < newBookedSlotObject.length ; i++) {
            
            if(newBookedSlotObject[i].date===d.date){
                newBookedSlotObject[i].timeSlots.push(d.timeSlots)
            }
        }
    }else{
        newBookedSlotArray.push(d.date)
        newBookedSlotObject.push({
            date  : d.date,
            timeSlots : d.timeSlots
        })
    }
})


let availableSlotDateArray=[]
for (let i=0 ; i < newBookedSlotObject.length ; i++) {
    if(newBookedSlotObject[i].timeSlots.length<3 && !newBookedSlotObject[i].timeSlots.includes("9:00 AM - 8:59 AM") ){
        availableSlotDateArray.push(new Date(newBookedSlotObject[i].date))
    }

}

  if (availabilityCheckData && availabilityCheckData.reservedDays) {
    availabilityCheckData = availabilityCheckData;
  }

  if (availabilityCheckData.reservedDays) {
    return {
      availabilityCheckData,
      bookedSlotDateArray :availableSlotDateArray,
      resetDate,
      ChangeFromDate,
      ChangeToDate,
      state,
      bkVenue,
      oldFromDate,
      oldToDate,
    };
  } else {
    return {
      resetDate,
      ChangeFromDate,
      ChangeToDate,
      state,
      bkVenue,
      oldFromDate,
      oldToDate,
      bookedSlotDateArray :availableSlotDateArray
    };
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(BookingCalendar);
