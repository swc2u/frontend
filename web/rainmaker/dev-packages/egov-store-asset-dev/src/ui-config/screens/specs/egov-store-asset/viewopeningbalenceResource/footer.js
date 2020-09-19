import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { showHideAdhocPopup,getCommonApplyFooter } from "../../utils";
import { handleCreateUpdateMaterialMaster } from "./functions";

const gotoCreateFlow = (state, dispatch) => {
  const code = getQueryArg(window.location.href, "code");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const createUrl =
    process.env.REACT_APP_SELF_RUNNING === "true"
      ? `/egov-ui-framework/egov-store-asset/creatematerialmaster?code=${code}&tenantId=${tenantId}`
      : `/egov-store-asset/creatematerialmaster?code=${code}&tenantId=${tenantId}`;
  dispatch(setRoute(createUrl));
};

const getCommonCreateFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
      style:{
        width:"100%",       
     }
    },
    children
  };
};

export const masterCommonFooter = () => {
  return getCommonApplyFooter({
    submitButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "SUBMIT",
          labelKey: "STORE_SUBMIT_LABEL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: handleCreateUpdateMaterialMaster
      }
    }
  });
};

export const masterVmasterCommonFooteriewFooter = () => {
  return getCommonCreateFooter({
   
    editDetails: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        editDetailsButtonLabel: getLabel({
          labelName: "EDIT DETAILS",
          labelKey: "STORE_EDIT_DETAILS_LABEL"
        }),
        editDetailsButtonIcon: {
          uiFramework: "custom-atoms",
          componentPath: "Icon",
          props: {
            iconName: "keyboard_arrow_right"
          }
        }
      },
      onClickDefination: {
        action: "condition",
        callBack: gotoCreateFlow
      }
    }
  });
};
