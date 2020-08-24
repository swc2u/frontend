import {
    getCommonCard,
    getTextField,
    getCommonContainer,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  export const totalValue = getCommonCard({
   
    totalValueContainer: getCommonContainer({  
      totalindentQuantity: {
        ...getTextField({
          label: {
            labelName: "Total Indent Quantity",
            labelKey: "STORE_PURCHASE_ORDER_INDENT_QUNTITY"
          },
          props: {
            disabled: true
          },
          jsonPath: "materialIssues[0].indentQuantity"
        })
      },
      totalValue: {
        ...getTextField({
          label: {
            labelName: "Total Order Quantity",
            labelKey: "STORE_ORDER_QUANTITY"
          },
          props: {
            disabled: true
          },
          jsonPath: "indents[0].totalQty"
        })
      },
      totalqtyValue: {
        ...getTextField({
          label: {
            labelName: "Total Qty Value",
            labelKey: "STORE_QTY_VALUE"
          },
          props: {
            disabled: true
          },
          gridDefination: {
            xs: 12,
            sm: 4,
          },
          jsonPath: "purchaseOrders[0].totalvalue"
        })
      },
    })
  });
  
  