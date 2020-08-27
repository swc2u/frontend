import React from "react";
import { getSLADays } from "egov-ui-kit/utils/localStorageUtils";

const styles = {
  backgroundColor: "rgb(254, 122, 81)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px",
  marginTop: "5px"
};
// const { number } = props;/ssss
function SLADays(props) {
	return <div style={styles}>Resolution Time(Days) : {getSLADays()}</div>;
}

export default SLADays;
