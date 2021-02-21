import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { SummaryDetails } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none !important"
  }
});

class SummaryDetailsContainer extends Component {
  render() {
    const { ...rest } = this.props;
    return <SummaryDetails {...rest} />
  }
}

const mapStateToProps = state => {
  let SummaryList = get(
    state,
    "screenConfiguration.preparedFinalObject.Booking",
    []
  );
  return { SummaryList};
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(SummaryDetailsContainer)
);
