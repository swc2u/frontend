import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import "../index.css";
import OpenSpace from "./OpenSpace.svg";
class OpenSpaceIcon extends React.Component {
    render() {
        const { width, height, margin } = this.props;
        return (
          <img src={OpenSpace} style={{width : "40px", height : "50px", marginBottom : "15px"}} />
        );
    }
}

export default OpenSpaceIcon;
