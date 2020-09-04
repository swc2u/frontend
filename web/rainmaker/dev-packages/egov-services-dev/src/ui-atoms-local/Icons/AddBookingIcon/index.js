import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import "../index.css";
import Booking from "./Booking.svg";
class AddBookingIcon extends React.Component {
    render() {
        const { width, height, margin } = this.props;
        return (
          <img src={Booking} style={{width : "40px", height : "50px", marginBottom : "15px"}} />
        );
    }
}

export default AddBookingIcon;
