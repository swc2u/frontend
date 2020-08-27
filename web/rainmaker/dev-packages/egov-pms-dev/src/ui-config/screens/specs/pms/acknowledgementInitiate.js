import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  
  gotoHomeFooter,
  
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";

import {
  
  ActionButton
} from "../../../../ui-utils/sampleResponses";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Fire NOC`, //later use getFinancialYearDates
    labelKey: "PENSION_COMMON_APPLY_PENSION_HEADER_LABEL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-noc",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber")
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

  if ((purpose === _ActionButton.INITIATED) && status === "success") {
    return {

     // header,
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
              labelName: "Employee Code.",
              labelKey: "PENSION_EMPLOYEE_CODE"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  }
  else if ((purpose === "PUSH_MANNUAL") && status === "success") {
    return {

     // header,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Push to Mannual  Register Successfully",
              labelKey: "PENSION_INITIATED_SUCCESS_MESSAGE_PUSH_MANNUAL"
            },
            // body: {
            //   labelName: "Application has been Push to Mannual  Register Successfully",
            //   labelKey: "PENSION_APPLICATION_INITIATED_SUCCESS_PUSH_MANNUAL"
            // },
            tailText: {
              labelName: "Employee Code.",
              labelKey: "PENSION_EMPLOYEE_CODE"
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
      "employeeID"
    );
    const secondNumber = getQueryArg(window.location.href, "secondNumber");
    const tenant = getTenantId();
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
