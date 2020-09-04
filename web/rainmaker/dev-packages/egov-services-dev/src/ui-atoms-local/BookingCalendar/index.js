import React from "react";
import Helmet from "react-helmet";
import DayPicker, { DateUtils } from "react-day-picker";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
    getFileUrlFromAPI,
    getQueryArg,
} from "egov-ui-framework/ui-utils/commons";
import "react-day-picker/lib/style.css";
import { localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
class BookingCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.state = {
            filterfromDate: "",
            filtertoDate: "",
            dselectedDays: [],
        };
    }

    componentDidMount() {
        const {availabilityCheckData} = this.props
        console.log(availabilityCheckData, "availabilityCheckData");


        const applicationNumber = getQueryArg(
            window.location.href,
            "applicationNumber"
        );
        console.log(applicationNumber, "applicationNumberNew");
        let pushReservedDay = [];
        for (let i = 0; i < this.props.reservedDays.length; i++) {
            pushReservedDay.push(new Date(this.props.reservedDays[i]));
        }
        this.setState({ dselectedDays: pushReservedDay });

         if(this.props.reservedDays.length > 0) {
         
            this.setState({
                from: new Date(this.props.availabilityCheck.bkFromDate),
                // to: new Date(this.props.availabilityCheck.bkToDate),
                enteredTo: new Date(this.props.availabilityCheck.bkToDate),
            });
        } 
        // if(applicationNumber !== null || applicationNumber !== undefined){
        //     alert("in it")
        //     this.setState({
        //         from: new Date(localStorageGet("fromDateCG")),
        //         // to: new Date(this.props.availabilityCheck.bkToDate),
        //         enteredTo: new Date(localStorageGet("toDateCG")),
        //     });
        // } 
    }

    // componentWillReceiveProps(nextProps) {
    //     const applicationNumber = getQueryArg(
    //         window.location.href,
    //         "applicationNumber"
    //     );
    //     console.log(applicationNumber, "applicationNumberNew");
    //     let reservedDays = nextProps.reservedDays;
    //     let pushReservedDay = [];
    //     for (let i = 0; i < reservedDays.length; i++) {
    //         pushReservedDay.push(new Date(reservedDays[i]));
    //     }
    //     this.setState({ dselectedDays: pushReservedDay });

    //     if(this.props.reservedDays.length > 0) {
         
    //         this.setState({
    //             from: new Date(this.props.availabilityCheck.bkFromDate),
    //             // to: new Date(this.props.availabilityCheck.bkToDate),
    //             enteredTo: new Date(this.props.availabilityCheck.bkToDate),
    //         });
    //     } 
    //     // if(applicationNumber !== null || applicationNumber !== undefined){
    //     //     alert("in it")
    //     //     this.setState({
    //     //         from: new Date(localStorageGet("fromDateCG")),
    //     //         // to: new Date(this.props.availabilityCheck.bkToDate),
    //     //         enteredTo: new Date(localStorageGet("toDateCG")),
    //     //     });
    //     // }
    // }

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
        const {availabilityCheckData} = this.props
        let val = this.props.availabilityCheck;
        if (val === "false" || val === undefined) {
            this.handleResetClick();
            this.props.showError2();
            return;
        } else {
            console.log(modifiers.disabled, "Modifiers");
            const { from, to } = this.state;
            if (from && to && day >= from && day <= to) {
                this.handleResetClick();
                return;
            }
            if (this.isSelectingFirstDay(from, to, day)) {
                this.props.prepareFinalObject(
                    "availabilityCheck.bkFromDate",
                    day
                );

                this.setState({
                    from: day,
                    to: null,
                    enteredTo: null,
                });
            } else {
                this.setState({
                    to: day,
                    enteredTo: day,
                });
                this.props.prepareFinalObject(
                    "availabilityCheck.bkToDate",
                    day
                );
                this.checkRangeValidity();
            }
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
        this.props.prepareFinalObject("availabilityCheck.bkToDate", "");
    };

    // setFromDateHandle = (date) => {
    //     this.setState({ filterfromDate: date });
    //     // this.props.prepareFinalObject("Booking", this.state)
    //     // this.props.prepareFinalObject("newBooking", { name: "sumit" })
    //     // console.log(this.props.Booking, "new state")
    // };

    // setToDateHandle = (date) => {
    //     this.setState({ filtertoDate: date });
    // };

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

    // areaChangeHandle = (e) => {
    //     let area = e.target.value;
    //     this.setState({ area: area });
    // };

    // selectChangeHandle = (e) => {
    //     const selectedSelectBox = e.target.dataset.name;
    //     let value = e.target.value;
    //     if (selectedSelectBox == "property") {
    //         this.setState({ prop: value });
    //     } else {
    //         this.setState({ area: value });
    //     }
    // };

    render() {
        const { from, to, enteredTo } = this.state;
        const modifiers = { start: from, end: enteredTo };
        const disabledDays = { before: this.state.from };
        const selectedDays = [from, { from, to: enteredTo }];
        return (
            <div className="Outer">
                <div className="calendar-section fl" style={{ width: "100%" }}>
                    <DayPicker
                        className="Range"
                        numberOfMonths={1}
                        fromMonth={from}
                        selectedDays={selectedDays}
                        disabledDays={this.state.dselectedDays}
                        modifiers={modifiers}
                        onDayClick={this.handleDayClick}
                        onDayMouseEnter={this.handleDayMouseEnter}
                    />
                </div>

                <div>
                    {!from && !to && "Please select the first day."}
                    {from && !to && "Please select the last day."}
                    {from &&
                        to &&
                        `Selected Date from ${from.toLocaleDateString()} to
                ${to.toLocaleDateString()}`}{" "}
                    {from && to && (
                        <button
                            className="link"
                            onClick={this.handleResetClick}
                        >
                            Reset
                        </button>
                    )}
                </div>
                <Helmet>
                    <style>{`

                    .Outer{ align-item :center}
                    .Range{width: 100%}
          .Range .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
          background-color: #f0f8ff !important;
          
          color: #4a90e2;
          }
          .Range .DayPicker-Day {
              
            border-radius: 0 !important;
          }
  
          .DayPicker-Month{width:100%; height:100%;margin:auto;}
          .fl{float:left;}
          .filter-section{width:100%;display:block;margin-bottom:20px;margin-top:40px;}
          .calendar-section{width:100%;display:block;}
          .ml-20{margin-left: 20px;}
          .mb-10{margin-bottom: 10px;}
          .mt-10{margin-top: 10px;}
          .DayPicker-Day {
            background-color: #8BD642;
            color: white;
            border: 2px solid white;
          }
          .DayPicker-Day.DayPicker-Day--disabled{background-color: red;}
          .DayPicker-Day.DayPicker-Day--outside{background-color: #E9E9E9;}
  `}</style>
                </Helmet>
            </div>
        );
    }
}
// const mapStateToProps = (state) => {
//     return {
//         availabilityCheck:
//             state.screenConfiguration.preparedFinalObject.availabilityCheck,
//     };
// };

const mapDispatchToProps = (dispatch) => {
    const actionDefination = [
        {
            path: "components.bookButton",
            property: "visible",
            value: true,
        },
    ];

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
                            "Selected Range Should Not Contain Reserved Date",
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
        //showBookButton: () => dispatchMultipleFieldChangeAction("checkavailability", actionDefination, dispatch)
    };
};

export default connect(null, mapDispatchToProps)(BookingCalendar);
