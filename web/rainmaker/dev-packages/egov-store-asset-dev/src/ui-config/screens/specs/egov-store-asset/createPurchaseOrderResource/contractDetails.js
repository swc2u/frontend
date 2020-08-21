import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const contractDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Tender/Quotation/Rate Contract Detail",
      labelKey: "STORE_PO_RC_DETAIL_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  contractDetailsContainer: getCommonContainer({
    rateContractNumber: {
      ...getTextField({
        label: {
          labelName: "Rate Contract/Tender/Quotation No.",
          labelKey: "STORE_PURCHASE_ORDER_RC_NO"
        },
        placeholder: {
          labelName: "Enter Rate Contract/Tender/Quotation No.",
          labelKey: "STORE_PURCHASE_ORDER_RC_NO_PLACEHOLDER"
        },
        // props: {
        //   disabled: true
        // },
        pattern: getPattern("alpha-numeric"),
        jsonPath: "purchaseOrders[0].priceList[0].rateContractNumber"
      })
    },
    rateContractDate: {
      ...getDateField({
        label: {
          labelName: "Rate Contract/Tender/Quotation Date",
          labelKey: "STORE_PURCHASE_ORDER_RC_DATE",
        },
        placeholder: {
          labelName: "Rate Contract/Tender/Quotation Date",
          labelKey: "STORE_PURCHASE_ORDER_RC_DATE",
        },
        pattern: getPattern("Date"),
        props: {
          inputProps: {
            disabled: true
          }
        },
        jsonPath: "purchaseOrders[0].priceList[0].rateContractDate",
      }),
    },
    agreementNumber: {
      ...getTextField({
        label: {
          labelName: "Agreement No.",
          labelKey: "STORE_PURCHASE_ORDER_AGRMENT_NO"
        },
        placeholder: {
          labelName: "Enter Agreement No.",
          labelKey: "STORE_PURCHASE_ORDER_AGRMENT_NO_PLACEHOLDER"
        },
        props: {
          disabled: true
        },
        pattern: getPattern("alpha-numeric"),
        jsonPath: "purchaseOrders[0].priceList[0].agreementNumber"
      })
    },
    agreementDate: {
      ...getDateField({
        label: {
          labelName: "Agreement Date",
          labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_DT"
        },
        placeholder: {
          labelName: "Enter Agreement Date",
          labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_DT"
        },
        pattern: getPattern("Date"),
        jsonPath: "purchaseOrders[0].priceList[0].agreementDate",
        props: {
          inputProps: {
            disabled: true
        //    max: getTodaysDateInYMD()
          }
        }
      })
    },
    agreementStartDate: {
      ...getDateField({
        label: {
          labelName: "Agreement From Date",
          labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_FRM_DT"
        },
        placeholder: {
          labelName: "Enter Agreement From Date",
          labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_FRM_DT"
        },
        pattern: getPattern("Date"),
        jsonPath: "purchaseOrders[0].priceList[0].agreementStartDate",
        props: {
          inputProps: {
            disabled: true
          }
        }
      })
    },
    agreementEndDate: {
      ...getDateField({
        label: {
          labelName: "Agreement To Date",
          labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_TO_DT"
        },
        placeholder: {
          labelName: "Enter Agreement To Date",
          labelKey: "STORE_PURCHASE_ORDER_AGREEMNT_TO_DT"
        },
        pattern: getPattern("Date"),
        jsonPath: "purchaseOrders[0].priceList[0].agreementEndDate",
        props: {
          inputProps: {
            disabled: true
          }
        }
      })
    },
  })
});

