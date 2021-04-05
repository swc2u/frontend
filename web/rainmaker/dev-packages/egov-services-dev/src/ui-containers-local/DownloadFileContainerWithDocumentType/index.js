import React, { Component } from "react";
import  MultiDownloadCardWithDocumentType  from "../../ui-molecules-local/MultiDownloadCardWithDocumentType";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.scss";

class DownloadFileContainerWithDocumentType extends Component {
    render() {
        const { data, documentData, ...rest } = this.props;
        return data.length > 0 ? (
            <MultiDownloadCardWithDocumentType data={data} {...rest} />
        ) : (
            "No Document Available."
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;
    console.log(screenConfiguration, "Nero Screen local hjhj")
    const data = ownProps.data
        ? ownProps.data
        : get(
              screenConfiguration.preparedFinalObject,
              ownProps.sourceJsonPath,
              []
          );
    return { data };
};

export default connect(mapStateToProps, null)(DownloadFileContainerWithDocumentType);
