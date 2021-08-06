import React from "react";
import { getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import ConditionsOfNOC from "./ConditionsOfNOC.pdf";
const styles = {
 // backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginTop: "8px",
  //paddingLeft: "19px",
  paddingRight: "19px",
 // textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "16px"
};

function SampleDownloadDropdwonCombo(props) {
	return <div style={styles}><a href={ConditionsOfNOC} download='ConditionsOfNOC.pdf'style={{textDecoration: "underline", fontWeight: "100"}}> Dropdown Combination </a></div>;
}

export default SampleDownloadDropdwonCombo;
