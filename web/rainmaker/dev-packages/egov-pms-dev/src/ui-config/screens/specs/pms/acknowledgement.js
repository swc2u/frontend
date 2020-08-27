import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {CloudDownloadIcon} from '@material-ui/icons/CloudDownload';
import {PrintIcon} from '@material-ui/icons/Print';
import {
  applicationSuccessFooter,
  paymentSuccessFooter,
  gotoHomeFooter,
  approvalSuccessFooter,
  paymentFailureFooter
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import generatePdf from "../utils/receiptPdf";
import { Icon } from "egov-ui-framework/ui-atoms";
// import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear } from "../utils";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  
  ActionButton
} from "../../../../ui-utils/sampleResponses";
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `PENSION_COMMON_APPLY_PENSION_HEADER_LABEL`, //later use getFinancialYearDates
    labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-noc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: applicationNumber,

    },
    visible: true
  }
});
export const headerdoe = getCommonContainer({
  header: getCommonHeader({
    labelName: "Death of an employee",
    labelKey: "PENSION_NP_DETAIL_HEADER_DOE"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    },
    visible: true
  }
});
export const headerdop = getCommonContainer({
  header: getCommonHeader({
    labelName: "Death of an Pensioner",
    labelKey: "PENSION_NP_DETAIL_HEADER_DOP"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pms",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
    },
    visible: true
  }
});


const getHeader=(applicationNumber)=>{
return getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Fire NOC`, //later use getFinancialYearDates
    labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-noc",
    componentPath: "ApplicationNoContainer",
    props: {
      number:applicationNumber
    },
    visible: true
  }
})
}


const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,  
) => {
  let _ActionButton= ActionButton()

  
  if (purpose === _ActionButton.FORWARD && status === "success") {
    return {
      ackheaderforword:getCommonContainer({
        header: getCommonHeader({
          labelName: `PENSION_COMMON_APPLY_PENSION_HEADER_LABEL`, //later use getFinancialYearDates
          labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-noc",
          componentPath: "ApplicationNoContainer",
          props: {
            number:applicationNumber
          },
          visible: true
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "PENSION_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            // body: {
            //   labelName: "Application has been marked successfully",
            //   labelKey: "PENSION_APPLICATION_FORWARD_SUCCESS"
            // },
            tailText: {
              labelName: "Application No.",
              labelKey: "PENSION_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } 
  else if ((purpose === _ActionButton.BACKWORD 
    || purpose === _ActionButton.BACKWORD1
    || purpose === _ActionButton.BACKWORD2
    || purpose === _ActionButton.SEND_BACK_TO_DETAILS_REVIEW
    || purpose === _ActionButton.SEND_BACK_TO_DETAILS_VERIFICATION
    ) && status === "success") {
    return {
      ackheaderback:getCommonContainer({
      header: getCommonHeader({
        labelName: `PENSION_COMMON_APPLY_PENSION_HEADER_LABEL`, //later use getFinancialYearDates
        labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
      }),
      applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-noc",
        componentPath: "ApplicationNoContainer",
        props: {
          number:applicationNumber
        },
        visible: true
      }
    }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application sent back Successfully",
              labelKey: "PENSION_SENDBACK_SUCCESS_MESSAGE_MAIN"
            },
            // body: {
            //   labelName: "Application has been sent back successfully",
            //   labelKey: "PENSION_APPLICATION_SENDBACK_SUCCESS"
            // },
            tailText: {
              labelName: "Application No.",
              labelKey: "PENSION_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } 
  else if ((purpose === _ActionButton.REJECT) && status === "success") {
    return {
      ackheaderreject:getCommonContainer({
        header: getCommonHeader({
          labelName: `PENSION_COMMON_APPLY_PENSION_HEADER_LABEL`, //later use getFinancialYearDates
          labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-noc",
          componentPath: "ApplicationNoContainer",
          props: {
            number:applicationNumber
          },
          visible: true
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Rejected Successfully",
              labelKey: "PENSION_REJECT_SUCCESS_MESSAGE_MAIN"
            },
            // body: {
            //   labelName: "Application has been reject successfully",
            //   labelKey: "PENSION_APPLICATION_REJECT_SUCCESS"
            // },
            tailText: {
              labelName: "Application No.",
              labelKey: "PENSION_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } 
  else if ((purpose === _ActionButton.CLOSE) && status === "success") {
    return {

      ackheaderClose:getCommonContainer({
        header: getCommonHeader({
          labelName: `PENSION_COMMON_APPLY_PENSION_HEADER_LABEL`, //later use getFinancialYearDates
          labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-noc",
          componentPath: "ApplicationNoContainer",
          props: {
            number:applicationNumber
          },
          visible: true
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application closed Successfully",
              labelKey: "PENSION_CLOSE_SUCCESS_MESSAGE_MAIN"
            },
            // body: {
            //   labelName: "Application has been close successfully",
            //   labelKey: "PENSION_APPLICATION_CLOSE_SUCCESS"
            // },
            tailText: {
              labelName: "Application No.",
              labelKey: "PENSION_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
  else if ((purpose === _ActionButton.INITIATED) && status === "success") {
    return {

      ackheaderINITIATE:getCommonContainer({
        header: getCommonHeader({
          labelName: `PENSION_COMMON_APPLY_PENSION_HEADER_LABEL`, //later use getFinancialYearDates
          labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-noc",
          componentPath: "ApplicationNoContainer",
          props: {
            number:applicationNumber
          },
          visible: true
        }
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Intiated Successfully",
              labelKey: "PENSION_INITIATED_SUCCESS_MESSAGE_MAIN"
            },
            // body: {
            //   labelName: "Application has been Initiated successfully",
            //   labelKey: "PENSION_APPLICATION_INITIATED_SUCCESS"
            // },
            tailText: {
              labelName: "Application No.",
              labelKey: "PENSION_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }

};

const setApplicationData = async (dispatch, applicationNumber, tenant) => {
  const queryObject = [
    {
      key: "tenantId",
      value: tenant
    },
    {
      key: "applicationNumber",
      value: applicationNumber
    }
  ];
  
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,      
    );
   // setApplicationData(dispatch, applicationNumber, tenant);
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
