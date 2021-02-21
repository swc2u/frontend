import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import "../index.css";
import Park from "./Park.svg";
class ParkIcon extends React.Component {
    render() {
        const { width, height, margin } = this.props;
        return (
          <img src={Park} style={{width : "40px", height : "50px", marginBottom : "15px"}} />
        );
    }
}

export default ParkIcon;
