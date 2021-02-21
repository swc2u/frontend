import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const TransactionDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Transaction Details",
      labelKey: "NULM_SUSV_TRANSACTION_DETAILS"

    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  TransactionDetailsContainer: getCommonContainer({
    transactionType: {
      ...getTextField({
        label: {
          labelName: "Transaction type",
          labelKey: "NULM_SUSV_TRANSACTION_TYPE"
        },
        placeholder: {
          labelName: "select Transaction type",
          labelKey: "NULM_SUSV_TRANSACTION_TYPE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.transactionType"
      })
    },
    amount: {
      ...getTextField({
        label: {
          labelName: "Amount",
          labelKey: "NULM_SUSV_TRANSACTION_AMOUNT",
        },
        placeholder: {
          labelName: "Enter Amount",
          labelKey: "NULM_SUSV_TRANSACTION_AMOUNT_PLACEHOLDER",
        },
        required: true,
        pattern: getPattern("Amount") || null,
        jsonPath: "NulmTransactionRequest.amount",       
      })
    },
    modeOfPayment: {
      ...getTextField({
        label: {
          labelName: "Mode of Payment",
          labelKey: "NULM_SUSV_TRANSACTION_MODE_OF_PAYMENT"
        },
        placeholder: {
          labelName: "Enter Mode of Payment",
          labelKey: "NULM_SUSV_TRANSACTION_MODE_OF_PAYMENT_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.modeOfPayment"
      })
    },
    paymentDetails: {
      ...getTextField({
        label: {
          labelName: "Payment Details",
          labelKey: "NULM_SUSV_TRANSACTION_PAYMENT_DETAILS"
        },
        placeholder: {
          labelName: "Enter Payment Details",
          labelKey: "NULM_SUSV_TRANSACTION_PAYMENT_DETAILS_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.paymentDetails"
      })
    },
    donationReceivedFrom: {
      ...getTextField({
        label: {
          labelName: "Donation Received From",
          labelKey: "NULM_SUSV_TRANSACTION_DONATION_RECEIVED_FM"
        },
        placeholder: {
          labelName: "Enter Donation Received From",
          labelKey: "NULM_SUSV_TRANSACTION_DONATION_RECEIVED_FM_PLACEHOLDER"
        },
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.donationReceivedFrom"
      })
    },
    donorDetails: {
      ...getTextField({
        label: {
          labelName: "Donor Details",
          labelKey: "NULM_SUSV_TRANSACTION_DONOR_DETAILS"
        },
        placeholder: {
          labelName: "Enter Donor Details",
          labelKey: "NULM_SUSV_TRANSACTION_DONOR_DETAILS_PLACEHOLDER"
        },
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.donorDetails"
      })
    },
    expenditureType: {
      ...getTextField({
        label: {
          labelName: "Expenditure Type",
          labelKey: "NULM_SUSV_TRANSACTION_EXPENDITURE_TYPE"
        },
        placeholder: {
          labelName: "Enter Expenditure Type",
          labelKey: "NULM_SUSV_TRANSACTION_EXPENDITURE_TYPE_PLACEHOLDER"
        },
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.expenditureType"
      })
    },
    expenditureDetails: {
      ...getTextField({
        label: {
          labelName: "Expenditure Details",
          labelKey: "NULM_SUSV_TRANSACTION_EXPENDITURE_DETAILS"
        },
        placeholder: {
          labelName: "Enter Expenditure Details",
          labelKey: "NULM_SUSV_TRANSACTION_EXPENDITURE_DETAILS_PLACEHOLDER"
        },
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.expenditureDetails"
      })
    },
    emailId: {
      ...getTextField({
        label: {
          labelName: "Email Id",
          labelKey: "NULM_SMID_EMAIL_ID"
        },
        placeholder: {
          labelName: "Enter Email Id",
          labelKey: "NULM_SMID_EMAIL_ID_PLACEHOLDER"
        },
        pattern: getPattern("Email") || null,
        jsonPath: "NulmTransactionRequest.emailId",
      })
    },
  
    comments: {
      ...getTextField({
        label: {
          labelName: "Comments",
          labelKey: "NULM_SUSV_TRANSACTION_COMMENTS"
        },
        placeholder: {
          labelName: "Enter Comments",
          labelKey: "NULM_SUSV_TRANSACTION_COMMENTS_PLACEHOLDER"
        },
        pattern: getPattern("Address") || null,
        jsonPath: "NulmTransactionRequest.comments"
      })
    },
  })
});