import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import MyApplicationIcon from "../../../../ui-atoms-local/Icons/MyApplicationIcon";
import { getRequiredDocData, clearlocalstorageAppDetails, checkForRole } from "../utils";
import get from "lodash/get";
import set from "lodash/set";
import {
  getAccessToken,
  getOPMSTenantId,
  getLocale,
  getUserInfo,
  setapplicationType
} from "egov-ui-kit/utils/localStorageUtils";
let roles = JSON.parse(getUserInfo()).roles


const header = getCommonHeader(
  {
    labelName: "OPMS",
    labelKey: "ACTION_TEST_OPMS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
let cardItems = [];
if (checkForRole(roles, 'CITIZEN')) {
  const cardlist = [
    {
      label: {
        labelKey: "Apply a Permission for Road Cut",
        labelName: "Apply a Permission for Road Cut"
      },
      icon: <i
        viewBox="0 -8 35 42"
        color="primary"
        class="material-icons module-page-icon" style={{ fontSize: "48px" }}>
        report_problem
      </i>,
      route: "applyroadcuts"

    },
    {
      label: {
        labelKey: "My Application",
        labelName: "My Application"
      },
      icon: <MyApplicationIcon />,
      route: "roadcutnoc-my-applications"
    },


  ];
  cardItems = cardlist;
}


const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "citizenMainLanding",
  beforeInitScreen: (action, state, dispatch) => {
    clearlocalstorageAppDetails(state);
    setapplicationType('ROADCUTNOC');

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-opms",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "citizenMainLanding"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
