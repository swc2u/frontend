import React from "react";

const styles = {
  backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "5px",
  paddingRight: "5px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "40px",
  fontSize: "16px",
  marginTop: "5px",
};

function ApplicationNoContainer(props) {
  const { number } = props;
  return <div style={styles}>Challan No. {number}</div>;
}

export default ApplicationNoContainer;
