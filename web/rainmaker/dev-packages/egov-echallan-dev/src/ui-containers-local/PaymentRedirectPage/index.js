import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { getSearchResults } from "../../ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";

class PaymentRedirect extends Component {
  componentDidMount = async () => {
    
    let { search } = this.props.location;
    try {
      let pgUpdateResponse = await httpRequest(
        "post", "pg-service/transaction/v1/_update" + search, "_update", [],
        {}
      );
      
      if (!pgUpdateResponse == "") {
        let consumerCode = get(pgUpdateResponse, "Transaction[0].consumerCode");
        let tenantId = get(pgUpdateResponse, "Transaction[0].tenantId");

        let searchdata = {
          searchtext: consumerCode,
          tenantId: tenantId,
          action: '',
        }
        let response = await getSearchResults(searchdata);
        
        let encroachment = response.ResponseBody[0].encroachmentType;
        let paymentData = {
          paymentUuid: get(response, "ResponseBody[0].paymentDetails.paymentUuid"),
          challanUuid: get(response, "ResponseBody[0].challanUuid"),
          violationUuid: get(response, "ResponseBody[0].violationUuid"),
          paymentStatus: get(pgUpdateResponse, "Transaction[0].txnStatus"),
          paymentAmount: parseInt(get(pgUpdateResponse, "Transaction[0].txnAmount")),
          paymentGateway: get(pgUpdateResponse, "Transaction[0].gateway"),
          transactionId: get(pgUpdateResponse, "Transaction[0].txnId"),
          tenantId: get(pgUpdateResponse, "Transaction[0].tenantId"),
        }
        let auditDetails = get(pgUpdateResponse, "Transaction[0].auditDetails")

        let addpaymentresponse = await httpRequest(
          "post",
          "ec-services/violation/_addPayment",
          "", [], {
            RequestBody : paymentData,
            auditDetails,
        });

        if (get(pgUpdateResponse, "Transaction[0].txnStatus") === "FAILURE") {
          this.props.setRoute(
            `/egov-echallan/acknowledgement?purpose=${"pay"}&status=${"failure"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&encroachmentType=${encroachment}`
          );
        } else {

          set(response, "ResponseBody.action", "PAY");
          let RequestBody = {
            paymentMode: 'ONLINE',
            paymentGateway: get(pgUpdateResponse, "Transaction[0].gateway"),
            transactionId: get(pgUpdateResponse, "Transaction[0].txnId"),
            pgStatus: get(pgUpdateResponse, "Transaction[0].gatewayStatusMsg"),
            paymentStatus: 'PAID',
            challanUuid: response.ResponseBody[0].challanUuid,
            tenantId:tenantId
          }
        
          let responses = await httpRequest(
            "post",
            "ec-services/storeitemregister/_updateStorePayment", // "/ec-services/v1/_update",
            "", [], {
            auditDetails,
            RequestBody
          });
          
          let transactionId = get(pgUpdateResponse, "Transaction[0].txnId");
          this.props.setRoute(
            `/egov-echallan/acknowledgement?purpose=${"pay"}&status=${"success"}&applicationNumber=${consumerCode}&tenantId=${tenantId}&secondNumber=${transactionId}&encroachmentType=${encroachment}`
          );
        }
      }
    } catch (e) {
      alert(e);
    }
  };
  render() {
    return <div />;
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setRoute: route => dispatch(setRoute(route))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(withRouter(PaymentRedirect));
