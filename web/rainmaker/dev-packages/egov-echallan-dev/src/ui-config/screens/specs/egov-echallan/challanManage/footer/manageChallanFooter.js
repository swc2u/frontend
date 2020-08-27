import {
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";

import {
  getCommonApplyFooter,
} from "../../../utils";

import "./index.css";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const pageResetAndChange = (state, dispatch) => {
  dispatch(setRoute("/egov-echallan/apply"));
};


export const footer = getCommonApplyFooter({
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Create Challan",
        labelKey: "EC_BUTTON_CREATE_CHALLAN"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },

    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        pageResetAndChange(state, dispatch);
      }
    },
    roleDefination: {
      rolePath: "user-info.roles",
      roles: ["challanSI"],
      //path : "tradelicence/apply"

    }
  },

});


