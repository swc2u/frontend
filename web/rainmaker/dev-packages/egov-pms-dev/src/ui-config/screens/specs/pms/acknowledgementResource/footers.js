import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import generatePdf from "../../utils/receiptPdf";
import "./index.css";

export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/inbox"
    : "/inbox";
  return redirectionURL;
};

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

//Function for go to home button
export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
       // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      //downloadReceiptButtonLabel: getLabel
      goToHomeButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "PENSION_COMMON_BUTTON_HOME"
      })
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});

//Function for application success(show those 3 buttons )
export const applicationSuccessFooter = (
  state,
  dispatch,
  applicationNumber,
  tenant
) => {
  return getCommonApplyFooter({
    gotoHome: {
      componentPath: "Button",
      props: {
        className: "apply-wizard-footer1",
        variant: "outlined",
        color: "primary",
        style: {
          minWidth: "180px",
          height: "48px",
        }
      },
      children: {
        //downloadReceiptButtonLabel: getLabel
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "PENSION_COMMON_BUTTON_HOME"
        })
      },
      // Check this onClickDefinition later again
      onClickDefination: {
        action: "page_change",
        path: `${getRedirectionURL()}`
      },
     
    },
  
  });
};

//Function for approval footer buttons
export const approvalSuccessFooter = getCommonApplyFooter({
  //Call gotoHome
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
       // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      //downloadReceiptButtonLabel: getLabel
      goToHomeButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "PENSION_COMMON_BUTTON_HOME"
      })
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  },
  downloadLicenseButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        width: "250px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadLicenseButtonLabel: getLabel({
        labelName: "DOWNLOAD FIRE-NOC",
        labelKey: "PENSION_APPROVAL_CHECKLIST_BUTTON_DOWN_LIC"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        generatePdf(state, dispatch, "certificate_download");
      }
    }
  },
  printNOCButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        width: "250px",
        height: "48px",
        marginRight: "40px"
      }
    },
    children: {
      printLicenseButtonLabel: getLabel({
        labelName: "PRINT FIRE-NOC",
        labelKey: "PENSION_APPROVAL_CHECKLIST_PRINT_LIC"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        generatePdf(state, dispatch, "certificate_print");
      }
    }
  }
});

//Function for payment failure(retry button)
export const paymentFailureFooter = (applicationNumber, tenant) => {
  return getCommonApplyFooter({
    //Call gotoHome
    retryPayment: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
        //  minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "RETRY",
          labelKey: "PENSION_PAYMENT_RETRY"
        })
      },
      onClickDefination: {
        action: "page_change",
        path: `/fire-noc/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}`
      }
    }
  });
};

//Function for payment success(Show buttons for download and print receipts)
export const paymentSuccessFooter = () => {
  return getCommonApplyFooter({
    //call gotoHome
    downloadReceiptButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
       //   minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        downloadReceiptButtonLabel: getLabel({
          labelName: "DOWNLOAD RECEIPT",
          labelKey: "PENSION_CONFIRMATION_BUTTON_DOWNLOAD_RECEIPT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          generatePdf(state, dispatch, "receipt_download");
        }
      }
    },
    printReceiptButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
       //   minWidth: "200px",
          height: "48px",
          marginRight: "40px"
        }
      },
      children: {
        printReceiptButtonLabel: getLabel({
          labelName: "PRINT RECEIPT",
          labelKey: "PENSION_CONFIRMATION_BUTTON_PRINT_RECEIPT"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          generatePdf(state, dispatch, "receipt_print");
        }
      }
    },
    gotoHome: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
      //    minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        goToHomeButtonLabel: getLabel({
          labelName: "GO TO HOME",
          labelKey: "PENSION_COMMON_BUTTON_HOME"
        })
      },
      onClickDefination: {
        action: "page_change",
        path:
          process.env.REACT_APP_SELF_RUNNING === "true"
            ? `/egov-ui-framework/fire-noc/search`
            : `/`
      },
       visible: false
    }
  });
};

//Write a function using map to return buttons
