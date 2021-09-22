import React from "react";
import {
    prepareFinalObject,
    toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { connect } from "react-redux";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import {
    getAvailabilityDataPCC,
    getBetweenDays,
} from "../../ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

class PlotArea extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
       
            bkLocationBeforeChange: this.props.availabilityCheckData.bkLocation,
            bkFromDateBeforeChange :this.props.availabilityCheckData.bkFromDate,
            bkToDateBeforeChange :this.props.availabilityCheckData.bkToDate
    
        }
    }

    
    getAvailabilityData = async (e, item) => {

        const { availabilityCheckData } = this.props;
        if (
            availabilityCheckData.bkBookingType == "Community Center" &&
            item.bkDuration == "HOURLY"
        ) {
            set(
                this.props.calendarVisiblity.checkavailability_pcc,
                "components.div.children.availabilityCalendarWrapper.visible",
                false
            );
            set(
                this.props.calendarVisiblity.checkavailability_pcc,
                "components.div.children.availabilityTimeSlotWrapper.visible",
                true
            );
        } else {
            set(
                this.props.calendarVisiblity.checkavailability_pcc,
                "components.div.children.availabilityTimeSlotWrapper.visible",
                false
            );

            set(
                this.props.calendarVisiblity.checkavailability_pcc,
                "components.div.children.availabilityCalendarWrapper.visible",
                true
            );
        }
        const changeDateVenue = getQueryArg(
            window.location.href,
            "changeDateVenue"
          );

          if(changeDateVenue!= null){
           
            if(item.name !==this.state.bkLocationBeforeChange){
                
                if (
                    availabilityCheckData.bkBookingType == "Community Center" &&
                    item.bkDuration !== "HOURLY"
                ) {
            
                    this.props.dispatch(
                        toggleSnackbar(
                            true,
                            {
                                labelName: "Venue change for full day is not allowed .Please select Hall for 3 hours.",
                                labelKey: "",
                            },
                            "warning"
                        )
                    )
                    set(
                        this.props.calendarVisiblity.checkavailability_pcc,
                        "components.div.children.availabilityCalendarWrapper.visible",
                        false
                    );
                }
                          if(this.props.availabilityCheckData.bkFromDate !== this.state.bkFromDateBeforeChange || this.props.availabilityCheckData.bkToDate !== this.state.bkToDateBeforeChange ){
                    location.reload();
                }
                this.props.prepareFinalObject(
                    "changeDateVenue.clickDisable",
                    true
                );
                set(
                    this.props.calendarVisiblity,
                    `checkavailability_pcc.components.div.children.availabilityCalendarWrapper.children.availabilityCalendar.children.cardContent.children.Calendar.children.actionButtons.children.resetButton.visible`,
                    false
                );
               }else{
                this.props.prepareFinalObject(
                    "changeDateVenue.clickDisable",
                    undefined
                );
                set(
                    this.props.calendarVisiblity,
                    `checkavailability_pcc.components.div.children.availabilityCalendarWrapper.children.availabilityCalendar.children.cardContent.children.Calendar.children.actionButtons.children.resetButton.visible`,
                    true
                );
            }
        }
        
        
        this.props.prepareFinalObject(
            "availabilityCheckData.bkBookingVenue",
            item.id
        );
        this.props.prepareFinalObject(
            "availabilityCheckData.bkLocation",
            item.name
        );
        this.props.prepareFinalObject(
            "availabilityCheckData.bkDuration",
            item.bkDuration
        );
        this.props.prepareFinalObject("Booking.bkBookingVenue", item.id);
        this.props.prepareFinalObject(
            "Booking.bkDuration",
            item.bkDuration
        );
        this.props.prepareFinalObject(
            "Booking.bkRefundAmount",
            item.refundabelSecurity
        );

        this.props.prepareFinalObject(
            "availabilityCheckData.bkRefundAmount",
            item.refundabelSecurity
        );

        let requestBody = {
            bookingType: availabilityCheckData.bkBookingType,
            bookingVenue: item.id,
            sector: availabilityCheckData.bkSector,
        };

        const response = await getAvailabilityDataPCC(requestBody);
        let responseStatus = get(response, "status", "");

        if (responseStatus == "SUCCESS" || responseStatus == "success") {
            let data = response.data;
            let reservedDates = [];
            var daylist = [];
            data.map((dataitem) => {
                let start = dataitem.fromDate;
                let end = dataitem.toDate;
                daylist = getBetweenDays(start, end);
                daylist.map((v) => {
                    reservedDates.push(v.toISOString().slice(0, 10));
                });
            });
            this.props.prepareFinalObject(
                "availabilityCheckData.reservedDays",
                reservedDates
            );

            console.log(data, "Reservered Time Slots");
            this.props.prepareFinalObject(
                "availabilityCheckData.reservedTimeSlotsData",
                data
            );

            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
            });
            
              
        } else {
            let errorMessage = {
                labelName: "Something went wrong, Try Again later!",
                labelKey: "", //UPLOAD_FILE_TOAST
            };
            this.props.toggleSnackbar(true, errorMessage, "error");
        }
    };

    render() {

        const { masterDataPCC, availabilityCheckData } = this.props;
        return masterDataPCC.map((item) => {
            let coords = `${item.x},${item.y},${item.radius}`;
            let venueId = item.id;
            return (
                <area
                    key={item.id}
                    alt={item.name}
                    title={item.name}
                    onClick={(e) => this.getAvailabilityData(e, item)}
                    // onClick={(item.id) => {
                    //     window.scrollTo({
                    //         top: document.body.scrollHeight,
                    //         behavior: "smooth",
                    //     });
                    // }}
                    shape="circle"
                    coords={coords}
                    style={{
                        cursor: "pointer",
                    }}
                    target="_self"
                />
            );
        });
    }
}
const mapStateToProps = (state) => {
    console.log(state, "Change date  State");
        return {
            calendarVisiblity: state.screenConfiguration.screenConfig,
            oldAvailabilityCheckData : state.screenConfiguration.preparedFinalObject.oldAvailabilityCheckData
        };
    };
    
    const mapDispatchToProps = (dispatch) => {
        return {
            prepareFinalObject: (jsonPath, value) =>
                dispatch(prepareFinalObject(jsonPath, value)),
            toggleSnackbar: (jsonPath, value) =>
                dispatch(toggleSnackbar(jsonPath, value)),
            changeRoute: (path) => dispatch(setRoute(path)),
            dispatch 
        };
    };
    
export default connect(mapStateToProps, mapDispatchToProps)(PlotArea);