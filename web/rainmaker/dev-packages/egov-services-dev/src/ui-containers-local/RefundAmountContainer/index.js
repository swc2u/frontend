import React, { Component } from "react";
import { FeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class RefundAmountContainer extends Component {

    render() {
        const { bookingData, cancelParkCcScreenMdmsData } = this.props;
        return (
            <div>
                Refund Amount - 3456 Rs.
            </div>
        )
    }
}



const mapStateToProps = (state, ownProps) => {
    const { screenConfiguration } = state;

    const cancelParkCcScreenMdmsData = get(
        screenConfiguration,
        "preparedFinalObject.cancelParkCcScreenMdmsData.bookingCancellationRefundCalc",
        []
    )

    const bookingData = get(
        screenConfiguration,
        "preparedFinalObject.Booking",
        []
    )

    return { bookingData, cancelParkCcScreenMdmsData };
};

export default connect(mapStateToProps, null)(RefundAmountContainer);
