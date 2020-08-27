import React, { Component } from "react";
import { FeesEstimateCard, CustomizeTable } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";
import { getLocalization } from "egov-ui-kit/utils/localStorageUtils";


const localizationLabels = JSON.parse(getLocalization("localization_en_IN"));


class CustomizeTableContainer extends Component {
  render() {
    return <CustomizeTable data={this.props.data} />;
  }
}

const mapStateToProps = (state, ownprops) => {
  
  const { screenConfiguration } = state;
  const {
    columns,
    data,
    option,
    customSortColumn,
    title,
    sourceJsonPath
  } = ownprops;
  
  const { preparedFinalObject } = screenConfiguration;
  
  return { state };
};

export default connect(
  mapStateToProps,
  null
)(CustomizeTableContainer);
