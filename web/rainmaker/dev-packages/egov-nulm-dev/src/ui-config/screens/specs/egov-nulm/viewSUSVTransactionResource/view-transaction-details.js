import {
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {  checkValueForNA } from "../../utils";
const gotoCreatePage = (state, dispatch) => {
   const createUrl = `/egov-nulm/susv-transaction?step=0`;
  dispatch(setRoute(createUrl));
};

export const getTransactionDetailsView = (isReview = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Transaction Details",
            labelKey: "NULM_SUSV_TRANSACTION_DETAILS"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isReview,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "HR_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: gotoCreatePage
          }
        }
      }
    },
    viewOne: getCommonContainer({
      transactionType: getLabelWithValue(
        {
          labelName: "Transaction type",
          labelKey: "NULM_SUSV_TRANSACTION_TYPE",
        },
        { jsonPath: "NulmTransactionRequest.transactionType" ,callBack: checkValueForNA }
      ),
      amount: getLabelWithValue(
        {
          labelName: "Amount",
          labelKey: "NULM_SUSV_TRANSACTION_AMOUNT"
        },
        { jsonPath: "NulmTransactionRequest.amount",callBack: checkValueForNA  }
      ),
      modeOfPayment: getLabelWithValue(
        {
          labelName: "Mode of Payment",
          labelKey: "NULM_SUSV_TRANSACTION_MODE_OF_PAYMENT"
        },
        { jsonPath: "NulmTransactionRequest.modeOfPayment",callBack: checkValueForNA  }
      ),
      
      paymentDetails: getLabelWithValue(
        {
          labelName: "Payment Details",
          labelKey: "NULM_SUSV_TRANSACTION_PAYMENT_DETAILS"
        },
        { jsonPath: "NulmTransactionRequest.paymentDetails" ,callBack: checkValueForNA }
      ),
      donationReceivedFrom: getLabelWithValue(
        {
          labelName: "Donation Received From",
          labelKey: "NULM_SUSV_TRANSACTION_DONATION_RECEIVED_FM"
        },
        { jsonPath: "NulmTransactionRequest.donationReceivedFrom" ,callBack: checkValueForNA  }
      ),
      donorDetails: getLabelWithValue(
        {
          labelName: "Donor Details",
          labelKey: "NULM_SUSV_TRANSACTION_DONOR_DETAILS"
        },
        { jsonPath: "NulmTransactionRequest.donorDetails" ,callBack: checkValueForNA  }
      ),
      expenditureType: getLabelWithValue(
        {
          labelName: "Expenditure Type",
          labelKey: "NULM_SUSV_TRANSACTION_EXPENDITURE_TYPE"
        },
        { jsonPath: "NulmTransactionRequest.expenditureType" ,callBack: checkValueForNA  }
      ),
      expenditureDetails: getLabelWithValue(
        {
          labelName: "Expenditure Details",
          labelKey: "NULM_SUSV_TRANSACTION_EXPENDITURE_DETAILS"
        },
        { jsonPath: "NulmTransactionRequest.expenditureDetails",callBack: checkValueForNA  }
      ),

      emailId: getLabelWithValue(
        {
          labelName: "Email Id",
          labelKey: "NULM_SMID_EMAIL_ID"
        },
        { jsonPath: "NulmTransactionRequest.emailId" ,callBack: checkValueForNA  }
      ),
      comments: getLabelWithValue(
        {
          labelName: "Comments",
          labelKey: "NULM_SUSV_TRANSACTION_COMMENTS"
        },
        { jsonPath: "NulmTransactionRequest.comments" ,callBack: checkValueForNA  }
      ),   
    }),
  });
};
