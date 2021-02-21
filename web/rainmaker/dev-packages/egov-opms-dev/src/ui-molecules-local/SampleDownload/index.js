import React from "react";
import { getapplicationNumber } from "egov-ui-kit/utils/localStorageUtils";
import OrderDocument from "./OrderDocument.pdf";
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

function SampleDownload(props) {
	return <div style={styles}><a href={OrderDocument} download='OrderDocument.pdf'style={{textDecoration: "underline", fontWeight: "100"}}>Order Document</a></div>;
}

export default SampleDownload;
