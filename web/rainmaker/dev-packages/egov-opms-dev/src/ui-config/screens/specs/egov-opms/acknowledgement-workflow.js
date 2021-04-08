import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
// import "./index.css";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
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

const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/"
    : "/inbox";
  return redirectionURL;
};

const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    
    props: {
      variant: "outlined",
      className:"home-footer",
      color: "primary",
      style: {
    //    minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "TL_COMMON_BUTTON_HOME"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`
    }
  }
});




const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  // status,
  applicationNumber,
  tenant
) => {
  if (purpose.includes("REVIEW") || purpose.includes("FORWARD") || purpose.includes("VERIFY") || purpose.includes("PENDINGAPPROVAL")) {
    return {
      header: getCommonHeader({
        labelName: `Online Permission`,
        labelKey: "PM_APPLICATION_HEADER",
        
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
              labelKey: "PM_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Application ID",
              labelKey: "PM_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else   if (purpose.includes("REASSIGN")) {
    return {
      header: getCommonHeader({
        labelName: `Online Permission`,
        labelKey: "PM_APPLICATION_HEADER",
        
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Reassigned Successfully",
              labelKey: "PM_REASSIGN_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Application ID",
              labelKey: "PM_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
  else   if (purpose.includes("APPROVED")) {
    return {
      header: getCommonHeader({
        labelName: `Online Permission`,
        labelKey: "PM_APPLICATION_HEADER",
        
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Approved Successfully",
              labelKey: "PM_APPROVE_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Application ID",
              labelKey: "PM_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }
 else   if (purpose.includes("COMPLETE")) {
    return {
      header: getCommonHeader({
        labelName: `Online Permission`,
        labelKey: "PM_APPLICATION_HEADER",
        
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Completed",
              labelKey: "PM_COMPLETE_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Application ID",
              labelKey: "PM_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }    
  else if (purpose.includes("REJECTED")) {
    return {
      header: getCommonHeader({
        labelName: `Online Permission`,
        labelKey: "PM_APPLICATION_HEADER",
        
      }),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application Rejected",
              labelKey: "PM_REJECT_SUCCESS_MESSAGE_MAIN"
            },
            tailText: {
              labelName: "Application ID",
              labelKey: "PM_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    }
  }

};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement-workflow",
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
    // const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenant = getQueryArg(window.location.href, "tenantId");
    
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      // status,
      applicationNumber,
      tenant
    );
    
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;