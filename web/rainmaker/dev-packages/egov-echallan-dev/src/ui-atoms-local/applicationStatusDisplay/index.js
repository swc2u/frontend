import React from "react";

const styles = {
  backgroundColor: "rgba(254, 122, 81, 20.6000000238418579)",
  color: "rgba(255, 255, 255, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "10px",
  paddingRight: "10px",
  textAlign: "center",
  verticalAlign: "middle",
  lineHeight: "40px",
  fontSize: "16px",
  marginTop: "5px",
};

function ApplicationStatusContainer(props) {
  const { status } = props;
  return <div style={styles}> {status}</div>;
}

export default ApplicationStatusContainer;
