import React from "react";
import SvgIcon from "material-ui/SvgIcon";

const hcIcon = (props) => {
  return (
    <SvgIcon className="custom-icon" viewBox="0 0 24 24" {...props}>
      {/* <path d="M0,21V10L7.5,5L15,10V21H10V14H5V21H0M24,2V21H17V8.93L16,8.27V6H14V6.93L10,4.27V2H24M21,14H19V16H21V14M21,10H19V12H21V10M21,6H19V8H21V6Z" /> */}
      <path
        d="M13 16.12c3.47-.41 6.17-3.36 6.17-6.95 0-3.87-3.13-7-7-7s-7 3.13-7 7c0 3.47 2.52 6.34 5.83 6.89V20H5v2h14v-2h-6v-3.88z"
        id="Shape"
      />
    </SvgIcon>
  );
};

export default hcIcon;
