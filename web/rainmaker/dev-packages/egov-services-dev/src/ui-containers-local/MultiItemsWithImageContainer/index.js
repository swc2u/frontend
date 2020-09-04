import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { MultiItemsWithImage } from "../../ui-molecules-local";
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

class MultiItemsWithImageContainer extends Component {
  render() {
    const { ...rest } = this.props;
    return <MultiItemsWithImage {...rest} />
  }
}

const mapStateToProps = state => {
  let dataList = get(
    state,
    "screenConfiguration.preparedFinalObject.Booking",
    []
  );
  return { dataList};
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(MultiItemsWithImageContainer)
);
