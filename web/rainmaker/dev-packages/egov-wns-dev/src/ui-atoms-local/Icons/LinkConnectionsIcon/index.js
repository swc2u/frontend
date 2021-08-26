import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import "../index.css";

class LinkConnectionsIcon extends React.Component {
    render() {
        return (
            // <SvgIcon viewBox="0 -8 35 42"
            //     color="primary"
            //     className="module-page-icon" >
            //     <path
            //         d="M7.77 6.76L6.23 5.48.82 12l5.41 6.52 1.54-1.28L3.42 12l4.35-5.24zM7 13h2v-2H7v2zm10-2h-2v2h2v-2zm-6 2h2v-2h-2v2zm6.77-7.52l-1.54 1.28L20.58 12l-4.35 5.24 1.54 1.28L23.18 12l-5.41-6.52z"
            //         id="Shape"
            //     />
            // </SvgIcon>
            <i
    viewBox="0 -8 35 42"
    color="primary"
    font-size="40px"
    class="material-icons module-page-icon" style={{ fontSize: "42px" }}>
    settings_ethernet
  </i>
        );
    }
}

export default LinkConnectionsIcon;