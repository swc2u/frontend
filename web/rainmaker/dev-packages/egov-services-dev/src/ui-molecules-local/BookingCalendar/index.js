import React from "react";
import DayPicker, {
    DateUtils,
} from "../../contributed-modules/react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "../../contributed-modules/react-day-picker/lib/style.css";
import "./index.css";
import get from "lodash/get";
class BookingCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.state = {
            filterfromDate: "",
            filtertoDate: "",
            dselectedDays: [],
        };
        const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
        if( !applicationNumber){
            this.handleResetClick()
    
        }
    }

    componentDidMount() {
        const { availabilityCheckData } = this.props;
        if ("reservedDays" in availabilityCheckData) {
            let pushReservedDay = [];
            availabilityCheckData.reservedDays.length > 0 &&
                availabilityCheckData.reservedDays.map((el) => {
                    pushReservedDay.push(new Date(el));
                });
            this.setState({
                dselectedDays: pushReservedDay,
                from: new Date(availabilityCheckData.bkFromDate),
                to: new Date(availabilityCheckData.bkToDate),
                enteredTo: new Date(availabilityCheckData.bkToDate),
            });
        }

    }

    componentWillReceiveProps(nextProps) {
        console.log(
            nextProps.availabilityCheckData,
            "myNextprops.availabilityCheckData"
        );
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
        } else {
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
                    this.setState({
                        from: new Date(
                            nextProps.availabilityCheckData.bkFromDate
                        ),
                        to: new Date(nextProps.availabilityCheckData.bkToDate),
                        enteredTo: new Date(
                            nextProps.availabilityCheckData.bkToDate
                        ),
                    });
                } else if (
                    nextProps.availabilityCheckData.bkFromDate !== null &&
                    nextProps.availabilityCheckData.bkToDate === null
                ) {
                    this.setState({
                        from: new Date(
                            nextProps.availabilityCheckData.bkFromDate
                        ),
                        to: null,
                        enteredTo: null,
                    });
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
            enteredTo: null, // Keep track of the last day for mouseEnter.
        };
    }

    isSelectingFirstDay(from, to, day) {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    handleDayClick = (day, modifiers = {}) => {

        if(this.props.changeDateVenueClickDisable===true){
            this.props.showError5();
            return
        }
        for(let i = 0 ; i< this.props.bookedSlotDateArray.length; i++)
        {
            let d= `${new Date(day).getDate()}-${new Date(day).getMonth()}-${new Date(day).getFullYear()}`
            let ad= `${new Date(this.props.bookedSlotDateArray[i]).getDate()}-${new Date(this.props.bookedSlotDateArray[i]).getMonth()}-${new Date(this.props.bookedSlotDateArray[i]).getFullYear()}`
            if(d==ad){
                this.handleResetClick();
                this.props.showError4();
                return;
            }
        }
        const { availabilityCheckData } = this.props;
        if ("reservedDays" in availabilityCheckData) {
            const { from, to } = this.state;
            if (from && to && day >= from && day <= to) {
                this.handleResetClick();
                return;
            }
            if (this.isSelectingFirstDay(from, to, day)) {
                
                if (day >= new Date()) {
                    this.props.prepareFinalObject(
                        "availabilityCheckData.bkFromDate",
                        day
                    );

                    this.props.prepareFinalObject(
                        "availabilityCheckData.bkToDate",
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
                this.props.prepareFinalObject(
                    "availabilityCheckData.bkToDate",
                    day
                );
                this.checkRangeValidity();
            }
        } else {
            this.handleResetClick();
            this.props.showError2();
            return;
        }
    };

    handleDayMouseEnter = (day) => {
        const { from, to } = this.state;
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
                this.props.showError();
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
        const { from, to, enteredTo } = this.state;
        const modifiers = { start: from, end: enteredTo , timeSlotBookedDates : this.props.bookedSlotDateArray};
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

        let initialMonthDate =
            from === null || from === undefined ? new Date() : new Date(from);
        let initialMonthDateYear = initialMonthDate.getFullYear();
        let initialMonthDateMonth = initialMonthDate.getMonth() + 1;

        let initialMonthDateStr = `${initialMonthDateYear}, ${initialMonthDateMonth}`;

        // console.log(initialMonthDateStr, "initialMonthDateStr");
        // console.log(from, "initialMonthDateStr");
        return (
            <div className="calendar-wrapper">
                <div className="calendar-section">
                    <DayPicker
                        className="Selectable"
                        numberOfMonths={2}
                        initialMonth={
                            from === undefined || from || null
                                ? new Date()
                                : new Date(initialMonthDateStr)
                        }
                        disabledDays={this.state.dselectedDays}
                        fromMonth={new Date()}
                        toMonth={newData}
                        modifiers={modifiers}
                        weekdaysShort={WEEK_DAY_LONG}
                        // modifiers={this.props.bookedSlotDateArray}
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
                            style={{
                                color: "rgba(0, 0, 0, 0.87)",
                                fontSize: 16,
                                fontWeight: 400,
                                lineHeight: "19px",
                                letterSpacing: "0.67px",
                            }}
                        >
                            {this.props.bookingVenue === undefined
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
                     {from===undefined ||from=== null  || from.toLocaleDateString()==='1/1/1970' ? "--/--/----" : from.toLocaleDateString()}
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
                                {to===undefined ||to=== null  || to.toLocaleDateString()==='1/1/1970' ? "--/--/----" : to.toLocaleDateString()}
                        </span>
                    </div>

                    {/* {from && !to && (
                        <span style={{ color: "#fe7a51", fontWeight: "600" }}>
                            ** Please click same day for booking single Date.
                        </span>
                    )} */}
                </div>
            </div>
        );
    }
}
// const mapStateToProps = (state) => {
//     return {
//         availabilityCheckData:
//             state.screenConfiguration.preparedFinalObject.availabilityCheckData,
//     };
// };
const mapStateToProps = (state) => {
   
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
    console.log('bookedSlotDateArray :>> ', bookedSlotArray);
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

    let changeDateVenueClickDisable= get(
        state,
        "screenConfiguration.preparedFinalObject.changeDateVenue.clickDisable"
    );
    
    return {
        bookedSlotDateArray :availableSlotDateArray, changeDateVenueClickDisable
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        prepareFinalObject: (jsonPath, value) =>
            dispatch(prepareFinalObject(jsonPath, value)),
        changeRoute: (path) => dispatch(setRoute(path)),
        showError: () =>
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName:
                            "Selected range should not contain reserved date",
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
                        labelName:
                            "First Check Availability By Filling Above Form",
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
                showError5: () =>
                dispatch(
                    toggleSnackbar(
                        true,
                        {
                            labelName: "Can not change both date and venue",
                            labelKey: "",
                        },
                        "warning"
                    )
                ),
                 //showBookButton: () => dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingCalendar);
